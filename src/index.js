import './styles.css';
import { celebro, Player } from "./battleship.js";
import AudioManager from "./audio.js";
import { horizontal, vertical } from "./images.js";
import "@fortawesome/fontawesome-free/css/all.css";


const table = document.querySelector("table.first");
const table2 = document.querySelector("table.enemy");
const start = document.getElementById("start");
const play = document.getElementById("play");
const name = document.getElementById("name");
const audioManager = new AudioManager();


let gameInstance = null;

function gameWrapper(){
    const domManager = (function(){
        const showErr = document.querySelector(".error");
        const firstCells = document.querySelectorAll("table.first td");
        const oppCells = document.querySelectorAll("table.enemy td");
        const overlay = document.querySelector(".overlay");
        const shipName = document.querySelector(".shipname");
        const deploy = document.querySelector(".deploy");
        const display = document.querySelector(".display");
        const settings = document.querySelector(".settings");
        const inner = settings.querySelector(".inner");
        const cls = overlay.querySelector(".cls");
        const reset = overlay.querySelector(".overlay button");
        const counts = document.querySelectorAll(".hit-count");
        const ovl = document.querySelector(".ovl");
        const info = document.querySelector(".info");
        const mute = document.querySelector(".inner .fa-volume-mute");
        const help = document.querySelector(".inner .fa-info-circle");


        inner.addEventListener("click", (event) => {
          event.stopPropagation();
        });

        settings.addEventListener("click", (event) => {
            event.stopPropagation();
            if(inner.classList.contains("active")){
                inner.classList.remove("active");
                settings.classList.remove("shade");
            }else{
                inner.classList.add("active");
                settings.classList.add("shade");
            }
        });

        cls.addEventListener("click", () => {
            overlay.classList.remove("active");
        });

        reset.addEventListener("click", () => {
            window.location.reload();
        });

        mute.addEventListener("click", (event) => {
            event.stopPropagation();
            if(mute.classList.contains("fa-volume-mute")){
                mute.classList.remove("fa-volume-mute");
                mute.classList.add("fa-volume-up");
                audioManager.mute();
            }else{
                mute.classList.remove("fa-volume-up");
                mute.classList.add("fa-volume-mute");
                audioManager.unmute();
            }
        });

        help.addEventListener("click", (event) => {
            event.stopPropagation();
            showInfo(true);
        });

        function displayComm(text = "Waiting For Your Orders Admiral!.") {
          // If there's an ongoing interval, clear it.
          if(display.intervalId){
            clearInterval(display.intervalId);
            display.intervalId = null;
          }

          // Clear the display text and use the provided text as the content.
          display.textContent = "";
          const content = text;
          let charIndex = 0;

          const interval = setInterval(() => {
            if(charIndex < content.length){
              display.textContent += content.charAt(charIndex);
              charIndex++;
            }else{
              clearInterval(interval);
              display.intervalId = null;
            }
          }, 50);

          // Save the interval ID so it can be cleared if displayComm is called again.
          display.intervalId = interval;
        }

        
        function updateCell(x, y, hit = false, table){
            let cls = table.getAttribute("class");
            let cell = table.rows[x].cells[y];
            let span = document.createElement("span");

            if(hit){

                span.classList.add("hit");
                if(cls === "enemy"){
                    counts[1].textContent = parseInt(counts[1].textContent) + 1;
                    displayComm("Missile Impact Confirmed Admiral!")
                }else{
                    counts[0].textContent = parseInt(counts[0].textContent) + 1;
                    displayComm("We've been hit Admiral!")
                }

            }else{

                if(cls === "enemy"){
                    displayComm("Our Missiles Missed!")
                }else{
                    displayComm("Inbound Warheads Evaded!")
                }
            }

            cell.appendChild(span);
        }

        function showInfo(hello = false){
            let charIndex = 0;
            let text = info.querySelector(".main-text p");
            let textOne = "Hello Admiral.\nClick on a cell on the Enemy territory to attack it. Enemy is using cloaking technology, their ships appear only after they've been sunk. We will need your univaled war strategy and vast experience to defeat them.";
            let textTwo = "Welcome aboard Admiral.\nIncoming enemy fleet detected. They are employing advanced tactical manuevers and utilizing cloaking technology. Estimated time of Arrival: 2Minutes. We advise immediate readiness for evasive action and countermeasures. ";
            if(hello) text.textContent = '';
            let welcome = hello ? textOne : textTwo;
            ovl.classList.add("active");

            if(text.intervalId){
              clearInterval(text.intervalId);
              text.intervalId = null;
            }

            setTimeout(() => {
                info.classList.add("active");
                const interval = setInterval(() => {
                  if(charIndex < welcome.length){
                    text.textContent += welcome.charAt(charIndex);
                    charIndex++;
                  }else{
                    setTimeout(() => {
                        if(welcome === textTwo) showError("Rotate Your Phone For A Better Experience.");
                        info.classList.remove("active");
                        ovl.classList.remove("active");
                        clearInterval(interval);
                        text.intervalId = null;
                    }, 1300);
                  }
                }, 60);

                text.intervalId = interval;
            }, 500);

        }

        let counter = 0;
        function updateShipName(ship){
            if(counter === 4){
                deploy.textContent = "All Ships Deployed!";
                start.classList.add("active");
            }

            shipName.classList.add("levitate");
            setTimeout(() => {
                shipName.textContent = ship;
                shipName.classList.remove("levitate");
            }, 250);
            
            counter++;
        }

        function placeShipImage(x, y, length, table, shipSrc, axis, opac = false){
            const cell = table.rows[x].cells[y];
            // if(!cell) return;

            const img = document.createElement("img");
            img.src = shipSrc;
            img.classList.add("ship");

            // Make the ship opaque if it belongs to the enemy grid                
            if(opac) img.style.opacity = "0";
            img.style.position = "absolute";
            img.style.left = "0px";
            img.style.top = `${cell.offsetTop}px`;

            // Set size based on axis
            const size = cell.getBoundingClientRect().width;
            img.style.width = axis === 'x' ? `${size * length}px` : `${size}px`;
            img.style.height = axis === 'x' ? `${size}px` : `${size * length}px`;

            cell.appendChild(img);

        }

        let errorTimeout;
        function showError(message){
            clearTimeout(errorTimeout);

            let p = showErr.querySelector("p");
            p.textContent = message;
            showErr.classList.add("active");

            errorTimeout = setTimeout(() => {
                showErr.classList.remove("active");
            }, 2000);
        }

        function getPlayerName(){
            return name;
        }

        function fCellEvents(callback){
            firstCells.forEach((cell) => {
                cell.addEventListener("click", () => callback(cell));
            });
        }

        function cellEvents(callback){
            oppCells.forEach((cell) => {
                cell.addEventListener("click", () => callback(cell));
            });
        }


        function getCoordinates(cell){
            let row = cell.parentElement;
            let rowIndex = row.rowIndex;
            let colIndex = cell.cellIndex;

            return [rowIndex, colIndex];
        }

        function announceWinner(winnerName){
            let winner = overlay.querySelector(".txt p");
            winner.textContent = `Admiral ${winnerName} won this battle!!`;
            overlay.classList.add("active");
            winner.parentElement.classList.add("active");
        }

        return { updateCell, showError, getPlayerName, fCellEvents, cellEvents, getCoordinates, announceWinner, placeShipImage, updateShipName, displayComm, showInfo };
    })();

    // This module handles board logic like fetching current player, checking whether an attack is valid or if the attack hits the ship
    const boardEngine = (function(){
        //let name = domManager.getPlayerName();
        let currentPlayer = null;

        function setCurrentPlayer(user){
            currentPlayer = user;
        }
        
        function getCurrentPlayer(){
            return currentPlayer;
        }

        // Check Whether the attack is valid
        function checkAttack(player, x, y){
            let hits = player.gameboard.getHits();
            let Misses = player.gameboard.getMisses();
            if(hits[x][y] !== 0 || Misses[x][y] !== 0){
                return false;
            }else{
                player.gameboard.receiveAttack(x, y);
                return true;
            }
        }

        // Check whether a ship was hit
        function shipHit(player, x, y){
            if(player.gameboard.doom()){
                return 2;
            }

            if(player.gameboard.receiveAttack(x, y)){
                return true;
            }else{
                return false;
            }        
        }

        return { checkAttack, shipHit, setCurrentPlayer, getCurrentPlayer };

    })();


    const gameEngine = (function(){

        const player1 = new Player(name.value);
        const player2 = new Player("Enemy");
        const players = [player1, player2];
        let awayTimeout, enemyTimeout;
        let parent = null, enemyCells = null;

        let rIndex = 0, cIndex = 0;
        let lastMove = null;

        

        function play(player, rIndex, cIndex, table){
            if(boardEngine.checkAttack(player, rIndex, cIndex)){
                let isHit =  boardEngine.shipHit(player, rIndex, cIndex);

                if(isHit === true){
                    domManager.updateCell(rIndex, cIndex, true, table);

                }else if(isHit === 2){
                    domManager.updateCell(rIndex, cIndex, true, table);
                    let winner = player.name === 'Enemy' ? name.value : 'Enemy';
                    domManager.announceWinner(winner);

                }else{
                    domManager.updateCell(rIndex, cIndex, false, table);
                }

            }else{
                let nt = boardEngine.getCurrentPlayer();
                domManager.showError(`Invalid Move!. ${nt} Should Play.`);
            }

            if(player.name === 'Enemy' && boardEngine.shipHit(player, rIndex, cIndex)){
                let ish = player.gameboard.isShipSunk(rIndex, cIndex);
                if(ish){
                    let [row, col] = ish;
                    let td = table.rows[row].cells[col];
                    console.log(td);
                    let img = td.querySelector("img");
                    img.style.opacity = '1';
                }
            }
        }

        function Computer(){
            let a = 0, b = 0;
            if(lastMove !== null){
                let [x, y] = lastMove;
                [a, b] =  player1.gameboard.receiveAttack(x, y) ? celebro(lastMove, player1) : celebro(null, player1);
                console.log([a, b]);
                play(player1, a, b, document.querySelector("table.player"));

            }else{

                [a, b] = celebro(null, player1);
                console.log([a, b]);
                play(player1, a, b, document.querySelector("table.player"));
            }

            lastMove = [a, b];
        }

        function cells(elem){
            clearTimeout(awayTimeout);
            clearTimeout(enemyTimeout);
            
            let current = boardEngine.getCurrentPlayer();
            parent = elem.closest("table");
            enemyCells = parent.querySelectorAll("td");

            [rIndex, cIndex] = domManager.getCoordinates(elem);
            const msl = "Missiles Away!!", delay = msl.length * 100;
            domManager.displayComm(msl);

            awayTimeout = setTimeout(() => {
                play(player2, rIndex, cIndex, table2);
                audioManager.playSound("explosion");
                boardEngine.setCurrentPlayer(player1.name);
            }, delay);

            enemyCells.forEach((opp) => {
                opp.classList.add("disabled");
            });

            const tg = "Enemy Is Targeting...", tgDelay = delay + (tg.length * 50);
            console.log(`delay: ${delay}, tgDelay: ${tgDelay}`);
            enemyTimeout = setTimeout(() => {
                domManager.displayComm(tg);
                setTimeout(() => {
                  Computer();
                  audioManager.playSound("afar");
                  boardEngine.setCurrentPlayer(player2.name);
                  enemyCells.forEach((opp) => {
                    opp.classList.remove("disabled");
                  });

                }, 5000 - 3500);

            }, 3500);

        }

        domManager.cellEvents(cells);

        function getPlayers(){
            return players;
        }

        return { cells, getPlayers };

    })();



    // This module handles ship placement for both players, it places the ships on the grid
    const placeEngine = (function(){
        const players = gameEngine.getPlayers();
        let count = 1, rIndex = 0, cIndex = 0, length = 5;
        let shipArr = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];
        
        function fCells(elem){
            [rIndex, cIndex] = domManager.getCoordinates(elem);

            try{
                if(count <= 5){
                    let cd = [rIndex, cIndex];
                    if(count === 4){
                        players[0].gameboard.place(cd, shipArr[3], 3);
                        domManager.placeShipImage(rIndex, cIndex, 3, table, horizontal[3], "x");
                        domManager.updateShipName(shipArr[count]);
                    }else{
                        players[0].gameboard.place(cd, shipArr[count - 1], length);
                        domManager.placeShipImage(rIndex, cIndex, length, table, horizontal[count - 1], "x");
                        domManager.updateShipName(shipArr[count]);
                        length--;
                    }
                    count++;
                }else{
                    return;
                }

            }catch(error) {
                domManager.showError(error.message);
            }  
        }
        
        // Set Event listeners up for placing ships on the grid (for user)
        domManager.fCellEvents(fCells);

        function plAnalyst(axis = 'x'){
            let x = null, y = null, crd = null;
            let valid = true;
            let grid = players[1].gameboard.getGrid();

            if(axis === 'y'){
                y = Math.floor(Math.random() * 10);
            }else{
                x = Math.floor(Math.random() * 6);
            }

            if(x === null){
                x = Math.floor(Math.random() * 10);
            }else{
                y = Math.floor(Math.random() * 6);
            } 


            if(axis === 'y'){
                for(let i = 0; i < 5; i++){
                    if(grid[x + i][y] !== 0){
                        valid = false;
                    }
                }

            }else{
                for(let i = 0; i < 5; i++){
                    if(grid[x][y +  i] !== 0){
                        valid = false;
                    }
                }
            }

            if(valid){
                crd = [x, y];
                return crd;
            }else{
               return plAnalyst(axis);
            }

        }

        // Function to place ships for opponent (Enemy)
        function placeShips(){
            let axis = ['x', 'y'];
            let elem = axis[Math.random() < 0.5 ? 0 : 1];
            let crd = null, x = null, y = null;
            let length = 5;
            let imgArr = elem === 'x' ? [...horizontal] : [...vertical];
            
            for(let i = 0; i < 5; i++){
                crd = plAnalyst(elem);
                [x, y] = crd;

                try{
                    if(i === 3){
                        players[1].gameboard.place(crd, shipArr[i], 3, elem);
                        domManager.placeShipImage(x, y, 3, table2, imgArr[3], elem, true);
                    }else{
                        players[1].gameboard.place(crd, shipArr[i], length, elem);
                        domManager.placeShipImage(x, y, length, table2, imgArr[i], elem, true);
                        length--;
                    }

                } catch(error) {
                    domManager.showError(error.message);
                }
                
            } 
    }

        return { placeShips };

    })();

    return { domManager, boardEngine, gameEngine, placeEngine }
}







// Driver Code
function gameInit(){
    if(gameInstance){
        gameInstance = null;
    }

    const playerBoard = document.querySelectorAll(".player-board");
    if(name.value === ""){
        gameInstance.domManager.showError("Player name is required");
    }else{
    
        gameInstance = gameWrapper();
        playerBoard[0].textContent = "Enemy";
        playerBoard[1].textContent = name.value;

        gameInstance.placeEngine.placeShips();
        gameInstance.boardEngine.setCurrentPlayer(name.value);
        
    }
}
    
    
    play.addEventListener("click", () => {
        audioManager.startTheme();
        const loadPage = document.querySelector("#load-page");
        const startPage = document.querySelector("#start-page");
        loadPage.classList.add("hidden");
        startPage.classList.remove("hidden");
    });
    
    
    start.addEventListener("click", () => {
        audioManager.playSound("click");

        setTimeout(() => {
            if(name.value === ""){
                gameInstance.domManager.showError("Player name is required");
            }else{
                gameInstance.domManager.showInfo();
                let wid = 25.0;
                const startPage = document.querySelector("#start-page");
                const mainPage = document.querySelector("#main-page");
                const playerTable = table.cloneNode(true);
                const imgs = playerTable.querySelectorAll("img");
    
                playerTable.classList.remove("first");
                playerTable.classList.add("player");
                gameInstance.domManager.displayComm();
                
                for(let i = 0; i < 5; i++){
                    let size = parseFloat(imgs[i].style.width);
                    imgs[i].style.width = `${size + wid}px`;
                    if(i === 2) wid = 20;
                    wid -= 5;
                }
    
                const grid = document.querySelector(".p-waters");
                grid.appendChild(playerTable);
                startPage.classList.add("hidden");
                mainPage.classList.remove("hidden");
            }

        }, 100);
    });
    


name.addEventListener("change", gameInit)
// Effects

window.onload = function(){
    document.querySelector("main").classList.add("active");
    document.querySelector(".ld").classList.remove("active");
}

window.addEventListener("DOMContentLoaded", () => {

    const typed = document.querySelectorAll(".typed-text");
    const textArr = [
      "Welcome to the Ultimate Naval Battle!.",
      "Prepare to conquer the Sea!"
    ];
    let textIndex = 0;  // This will track the current text in textArr
    let charIndex = 0;  // This will track the current character in the current text
    
    function typedEffect() {
      if (textIndex < typed.length) {
        if (charIndex < textArr[textIndex].length) {
          // Append the character to the corresponding element
          typed[textIndex].textContent += textArr[textIndex].charAt(charIndex);
          charIndex++;
    
          // Keep typing the next character after 200ms
          setTimeout(typedEffect, 50);
        } else {
          // Move to the next text in the array once current one is done
          textIndex++;
          charIndex = 0;  // Reset charIndex for the next text
          if (textIndex < typed.length) {
            // Only start the next text typing if there's another element to type into
            setTimeout(typedEffect, 50);
          }
        }
      }
    }
    
    // Start typing the first text
    typedEffect();
});





