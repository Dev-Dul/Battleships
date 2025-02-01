import { celebro, Player } from "./battleship";
import { vertical, horizontal } from "./images";
import './styles.css';


const table = document.getElementById("table-one");
const table2 = document.getElementById("table-two");
const start = document.getElementById("start");
const play = document.getElementById("play");
const name = document.getElementById("name");

let gameInstance = null;


function gameWrapper(){
    const domManager = (function(){
        const showErr = document.querySelector(".error");
        const firstCells = document.querySelectorAll("table.first td");
        const oppCells = document.querySelectorAll(".opp-cell");
        const winnerBoard = document.getElementById("winnerboard");
        
        function updateCell(x, y, hit, table){
            let cell = table.rows[x].cells[y];
            let span = document.createElement("span");
            span.classList.add("active");
            if(hit) span.classList.add("hit");

            cell.appendChild(span);
        }

        // function turnError(){
        //     let p = turnErr.querySelector("p");
        //     p.textContent = `Not too fast mate!, it's ${boardEngine.getCurrentPlayer}'s turn`;
        //     turnErr.classList.add("active");
        // }

        function showError(message){
            let p = showErr.querySelector("p");
            p.textContent = message;
            showErr.classList.add("active");
        }

        function getPlayerName(){
            return name;
        }

        function fCellEvents(callback){
            console.log(firstCells);
            firstCells.forEach((cell) => {
                cell.addEventListener("click", () => callback(cell));
            });
        }

        function cellEvents(callback){
            oppCells.forEach((cell) => {
                cell.addEventListener("click", callback(cell));
            });
        }


        function getCoordinates(cell){
            let row = cell.parentElement;
            let rowIndex = row.rowIndex;
            let colIndex = cell.cellIndex;

            return [rowIndex, colIndex];
        }

        function announceWinner(name){
            let winner = winnerBoard.querySelector(".winner");
            winner.textContent = `Marshall ${name} won!!`;
            winnerBoard.classList.add("active");
        }

        return { updateCell, showError, getPlayerName, fCellEvents, cellEvents, getCoordinates, announceWinner };
    })();

    // This module handles board logic like fetching current player, checking whether an attack is valid or if the attack hits the ship
    const boardEngine = (function(){
        //let name = domManager.getPlayerName();
        let currentPlayer = null;

        function setCurrentPlayer(user){
            currentPlayer = user === name.value ? "Enemy" : name.value;
        }
        
        function getCurrentPlayer(){
            return currentPlayer;
        }

        // Check Whether the attack is valid
        function checkAttack(player, x, y){
            let hits = player.gameboard.getHits();
            if(hits[x][y] !== 0){
                return false;
            }else{
                player.gameboard.receiveAttack(x, y);
                return true;
            }
        }

        // Check whether a ship was hit
        function shipHit(player, x, y){
            if(player.gameboard.doom()){
                domManager.announceWinner(player.name);
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
        // let name = domManager.getPlayerName();

        const player1 = new Player(name.value);
        const player2 = new Player("Enemy");
        const players = [player1, player2];

        let rIndex = 0, cIndex = 0;
        let lastMove = null;

        function Computer(){
            let [a, b] = lastMove ? celebro(lastMove, player2) : celebro(player2);
            play(player2, a, b, table2);
            lastMove = [a, b];

        }

        function play(player, rIndex, cIndex, table){
            if(boardEngine.checkAttack(player, rIndex, cIndex)){
                if(boardEngine.shipHit(player, rIndex, cIndex)){
                    domManager.updateCell(rIndex, cIndex, true, table);
                }
            }else{
                domManager.showError("Invalid Move");
            }
        }

        function cells(elem){
            [rIndex, cIndex] = domManager.getCoordinates(elem);

            play(player1, rIndex, cIndex, table);
            boardEngine.setCurrentPlayer(player1.name);

            setTimeout(() => {
            oppCells.forEach((opp) => {
                opp.classList.add("disabled");
            });

            Computer();
            boardEngine.setCurrentPlayer(player1.name);
            }, 2000);
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
                            length--;
                        }else{
                            players[0].gameboard.place(cd, shipArr[count - 1], length);
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

        function plAnalyst(length, axis = 'x'){
            let x = null, y = null, crd = null;
            let valid = true;
            let grid = players[1].gameboard.getGrid();

            if(axis === 'y'){
                y = Math.floor(Math.random() * 6);
            }else{
                x = Math.floor(Math.random() * 6);
            }

            if(x === null){
                x = Math.floor(Math.random() * 6);
            }else{
                y = Math.floor(Math.random() * 6);
            } 


            if(axis === 'y'){

                for(let i = 0; i < length; i++){
                    if(grid[x + i][y] !== 0){
                        valid = false;
                    }
                }

            }else{
                for(let i = 0; i < length; i++){
                    if(grid[x][y +  i] !== 0){
                        valid = false;
                    }
                }
            }

            if(valid){
                crd = [x, y];
                return crd;
            }else{
               return plAnalyst(length, axis);
            }

        }

        // Function to place ships for opponent (Enemy)
        function placeShips(){
            let axis = ['x', 'y'];
            let elem = axis[Math.random() < 0.5 ? 0 : 1];
            let crd = null;
            let length = 5;

            
            for(let i = 0; i < 5; i++){
                crd = plAnalyst(length, elem);
                console.log(crd);
                console.log(elem);

                try{
                    if(i === 3){
                        players[1].gameboard.place(crd, shipArr[i], 3, elem);
                        length--;
                    }else{
                        players[1].gameboard.place(crd, shipArr[i], length, elem);
                        // console.log(length)
                        length--;
                    }

                    console.log(`len: ${length}`);
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
    // let name = domManager.getPlayerName();
    const playerBoard = document.querySelectorAll(".player-board");
    
    if(name.value === ""){
        gameInstance.domManager.showError("Player name is required");
    }
    
        gameInstance = gameWrapper();
        playerBoard[0].textContent = name.value;
        playerBoard[1].textContent = "Enemy";

        gameInstance.placeEngine.placeShips();
        gameInstance.boardEngine.setCurrentPlayer(name.value);
    
}


play.addEventListener("click", () => {
    const loadPage = document.querySelector("#load-page");
    const startPage = document.querySelector("#start-page");
    loadPage.classList.add("hidden");
    startPage.classList.remove("hidden");
});


start.addEventListener("click", () => {
    const startPage = document.querySelector("#start-page");
    const mainPage = document.querySelector("#main-page");
    startPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
    
});

name.addEventListener("change", gameInit)
// Effects
// const typed = document.querySelectorAll(".typed-text");
// const textArr = [
//   "Welcome to the Ultimate Naval Battle!.Welcome to the Ultimate Naval Battle!.",
//   "Prepare to conquer the Sea!."
// ];
// let textIndex = 0;
// let charIndex = 0;

// function typedEffect() {
// //   if(textIndex < typed.length){
//     if(charIndex < textArr[textIndex].length){
//       typed[textIndex].textContent += textArr[textIndex].charAt(charIndex);
//       charIndex++;

//       setTimeout(typedEffect, 200);
//     }
//     // else{
//     //   textIndex++;
//     //   charIndex = 0;
//     //   setTimeout(typedEffect, 200); // Move to next text after finishing current one
//     // }
// //   }
// }

const typed = document.querySelectorAll(".typed-text");
console.log(typed);
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

// typedEffect();



