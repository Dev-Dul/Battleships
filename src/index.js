import { celebro, Player } from "./battleship";


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

const domManager = (function(){
    const turnErr = document.getElementById("turn-err");
    const showErr = document.getElementById("show-err");
    const firstCells = document.querySelectorAll(".f-cell");
    const oppCells = document.querySelectorAll(".opp-cell");
    const winnerBoard = document.getElementById("winnerboard");
    const name = document.getElementById("#name");
    
    function updateCell(x, y, hit, table){
        let cell = table.rows[x].cells[y];
        let span = document.createElement("span");
        span.classList.add("active");
        if(hit) span.classList.add("hit");

        cell.appendChild(span);
    }

    function turnError(){
        turnErr.textContent = `Not too fast mate!, it's ${boardEngine.getCurrentPlayer}'s turn`;
        turnErr.classList.add("active");
    }

    function showError(message){
        showErr.textContent = message;
        showErr.classList.add("active");
    }

    function getPlayerName(){
        return name;
    }

    function fCellEvents(callback){
        firstCells.forEach((cell) => {
            cell.addEventListener("click", callback(cell));
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

    return { updateCell, turnError, showError, getPlayerName, fCellEvents, cellEvents, getCoordinates, announceWinner };
})();

// This module handles board logic like fetching current player, checking whether an attack is valid or if the attack hits the ship
const boardEngine = (function(){
    let name = domManager.getPlayerName();
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
    

    domManager.fCellEvents(fCells);

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

    return { placeShips, fCells };

})();

const gameEngine = (function(){
    let name = domManager.getPlayerName();

    const player1 = new Player(name.value);
    const player2 = new Player("Computer");
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