import { Player } from "./battleship";


const table = document.getElementById("table-one");
const table2 = document.getElementById("table-two");

// This module sets up the game. It handles stuff like displaying the game page, filling in player names.
const setUp = (function(){
    let start = document.getElementById("start");
    let play = document.getElementById("play");
    let nameErr = document.querySelector(".nameErr");
    const playerBoard = document.querySelectorAll(".player-board");

    play.addEventListener("click", () => {
        loadPage.classList.remove("active");
        startPage.classList.add("active");
    });

    start.addEventListener("click", () => {
        let name = document.querySelector("#Player-name");
        let select = document.querySelector("#select");
        if(name.value === ''){
            nameErr.classList.add("active");
        }else{
            playerBoard[0].textContent = name.value;
            playerBoard[1].textContent = select.value;
        }

        boardEngine.setCurrentPlayer(name.value);

    });

})();

// This module handles board logic like fetching current player, checking whether an attack is valid or if the attack hits the ship
const boardEngine = (function(){
    let name = document.querySelector("#Player-name");
    const currentPlayer = null;

    function setCurrentPlayer(user){
        currentPlayer = user === name.value ? "Computer" : name.value;
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
        let hits = player.gameboard.getHits();
        if(hits[x][y] !== 0){
            if(player.gameboard.receiveAttack(x, y)){
                return true;
            }
        }else{
          return false;
        }        
    }

    return { checkAttack, shipHit, setCurrentPlayer, getCurrentPlayer };

})();

// This module handles ship placement for both players, it places the ships on the grid
const placeEngine = (function(){
    const firstCells = document.querySelectorAll(".f-cells");
    const players = gameEngine.getPlayers();

    let count = 1, rIndex = 0, cIndex = 0;
    let row = null;
    let length = 5;
    let shipArr = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];

    firstCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            row = opp.parentElement;
            rIndex = row.rowIndex;
            cIndex = opp.cellIndex;

            try{
                if(count <= 5){
                let cd = [rIndex, cIndex];
                    if(count === 4){
                        players[0].gameboard.place(cd, shipArr[3], 3);
                    }else{
                        players[0].gameboard.place(cd, shipArr[count - 1], length);
                        length--;
                    }
                    count++;
                }else{
                    return;
                }

            }catch(error){
                let cError = document.createElement("div");
                let errText = document.createElement("p");
                errText.textContent = error.message;

                cError.classList.add("c-error");
                cError.appendChild(errText);
            }
           
        })
    })


    function placeShips(){
       let axis = ['x', 'y'];
       let elem = axis[Math.random() < 0.5 ? 0 : 1];
       let x = null, y = null, crd = null;
       let length = 5;

       if(elem === 'y'){
          y = Math.floor(Math.random() * 10);
       }else{
          x = Math.floor(Math.random() * 10);
       }
       
       for(let i = 0; i < 5; i++){
           if(x === null){
               x = Math.floor(Math.random() * 10);
               crd = [x, y];       
           }else{
              y = Math.floor(Math.random() * 10);
              crd = [x, y];
           }

           if(i === 3){
               players[1].gameboard.place(crd, shipArr[i], 3, elem);
           }else{
               players[1].gameboard.place(crd, shipArr[i], length, elem);
           }

       }
    }

    return { placeShips };

})();

const gameEngine = (function(){
    const oppCells = document.querySelectorAll(".opp-cells");
    const playerCells = document.querySelectorAll(".cells");
    let name = document.querySelector("#Player-name");


    const player1 = new Player(name.value);
    const player2 = new Player("Computer");
    const players = [player1, player2];

    let rIndex = 0, cIndex = 0;
    let row = null;

    

    oppCells.forEach((opp) => {
        opp.addEventListener("click", () => {
            row = opp.parentElement;
            rIndex = row.rowIndex;
            cIndex = opp.cellIndex;
            let cplay = boardEngine.getCurrentPlayer();

            if(boardEngine.checkAttack(player2, rIndex, cIndex) && cplay !== "Computer"){
                if(boardEngine.shipHit(player2, rIndex, cIndex)){
                    let span = document.createElement("span");
                    span.classList.add("active");
                    span.classList.add("hit");
                    boardEngine.setCurrentPlayer(name.value);

                    row.appendChild(span);
                }else{
                    let span = document.createElement("span");
                    span.classList.add("active");
                    boardEngine.setCurrentPlayer(name.value);

                    row.appendChild(span);
                }
            }else{
                let [ r, c ] = celebro(player2);
                let cell = table.rows[r].cells[c];
                opp.classList.add("disabled");
            }

            if(cplay === "Computer"){

            }
        })
    })

    playerCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            row = cell.parentElement;
            rIndex = row.rowIndex;
            cIndex = cell.cellIndex;

            if(!boardEngine.checkAttack(player1, rIndex, cIndex)){
                if(boardEngine.shipHit(player1, rIndex, cIndex)){
                    let span = document.createElement("span");
                    span.classList.add("active");
                    span.classList.add("hit");

                    row.appendChild(span);
                }else{
                    let span = document.createElement("span");
                    span.classList.add("active");

                    row.appendChild(span);
                }
            }else{
                cell.classList.add("disabled");
            }
        })
    })

    function getPlayers(){
        return players;
    }

})();