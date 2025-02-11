class Ship{
    constructor(crd, length, name, axis = 'x'){
        this.name = name;
        this.hit = 0;
        this.crd = crd;
        this.axis = axis;
        this.length = length;
    }

    addHit(){
        this.hit++;
    }

    isSunk(){
        if(this.hit >= this.length){
            return true;
        }else{
            return false;
        }
    }

    coords(){
        let a = this.crd[0];
        let coord = this.axis === "x" ? [a, this.length - 1] : [a ];
        return coord;
    }
}

class GameBoard{
    #grid;
    #misses;
    constructor(){
        this.#grid = [];
        this.ships = [];
        this.hits = [];
        this.#misses = [];
        for(let i = 0; i < 10; i++){
            this.#grid.push(new Array(10).fill(0));
            this.#misses.push(new Array(10).fill(0));
            this.hits.push(new Array(10).fill(0));
        }
    }

    checkBounds(x, y, length, axis = 'x'){
        let check = axis === 'x' ? x + length <= this.#grid.length : y + length <= this.#grid.length;
        let bounds = false;
        if((x < 9 && y < 9) && check){
          bounds = true;
        }

        return bounds;
    }

    checkSpace(x, y, ship, axis = 'x'){
        let valid = true;
     // Check if all the cells to place the ship are 
      if(axis === "y"){
        for(let i = 0; i < ship.length; i++){
            if(this.#grid[x + i][y] !== 0){
                valid = false;
            }
        }
      }else{

          for(let i = 0; i < ship.length; i++){
            if(this.#grid[x][y + i] !== 0){
                valid = false;
            }
          }

      }

      return valid;
    }

    place(crd, name, length, axis = "x"){
        let [x, y] = crd;

        if(axis === "y"){
          // First check to see whether the coordinates are within range
          if(this.checkBounds(x, y, length, axis)){
            let ship = new Ship(crd, length, name, "y");
            
            // Proceed to placing ship only if selected coordinate is not occupied.
            if(this.checkSpace(x, y, ship, axis)){
                for(let i = 0; i < length; i++){
                    this.#grid[x][y] = 1;
                    x++;
                }
                this.ships.push(ship);
                
            }else{
              throw new Error("Coordinate already taken");
            }

          }else{
            throw new Error("Coodinates are out of bound!.");
          }

        }else{

            // First check to see whether the coordinates are within range
            if(this.checkBounds(x, y, length)){
                let ship = new Ship(crd, length, name);
                
                // Proceed to placing ship only if selected coordinate is not occupied.
                if(this.checkSpace(x, y, ship)){
                    for(let i = 0; i < length; i++){
                        this.#grid[x][y] = 1;  
                        y++;
                    }
                    this.ships.push(ship);
                }else{
                    throw new Error("Coordinate already taken");
                }    
            }else{
                throw new Error("Coodinates are out of bound!.");
            }
        }
    }

    getGrid(){
        return this.#grid;
    }

    getHits(){
        return this.hits;
    }

    getMisses(){
        return this.#misses;
    }

    getCells(ship){
        let cells = [];
        let [row, col] = ship.crd;

        if(ship.axis === 'x'){
            for(let i = 0; i < ship.length; i++){
                cells.push({x: row, y: col + i });
            }
        }else{
            for(let i = 0; i < ship.length; i++){
              cells.push({ x: row + i, y: col });
            }
        }

        return cells;
    }

    receiveAttack(x, y){
        let attack = false;
        for(const ship of this.ships){
            const occupiedCells = this.getCells(ship);

            for(const cell of occupiedCells){
                if(cell.x === x && cell.y === y){
                    if(this.hits[x][y] !== 1){
                        ship.addHit();
                        this.hits[x][y] = 1;
                    }

                    attack = true;
                    break;
                }
            }

            if(attack) break;
        }

        

        if(!attack){
            this.#misses[x][y] = 1;
        }

        return attack;
    }
    
    isShipSunk(x, y){
        let sunk = false;
        let theCoords = [] ;
        for(const ship of this.ships){
            console.log(ship);
            const occupiedCells = this.getCells(ship);

            for(const cell of occupiedCells){
                if(cell.x === x && cell.y === y){
                    if(ship.isSunk()){
                        theCoords = ship.crd;
                        sunk = true;
                        console.log(this.getHits());
                        console.log(ship.length);
                        console.log(ship.hit);
                        break;
                    }
                }
            }

            if(sunk) break;
        }

        if(sunk){
            return theCoords;
        }else{
            return false;
        }
    }
    
    doom(){
        // Check whether all ships are sunk or not
        let check = this.ships.every((ship) => ship.isSunk());
        if(check){
            return true;
        }else{
            return false;
        }
    }

    reset(){
        this.ships = [];
        for(let i = 0; i < this.#grid.length; i++){
            for(let j = 0; j < this.#grid[i].length; j++){
                this.#grid[i][j] = 0;
                this.#misses[i][j] = 0;
                this.hits[i][j] = 0;
            }
        }
    }
}

class Player{
    constructor(name){
        this.name = name;
        this.gameboard = new GameBoard();
    }
}

function celebro(cord = null, player){
    let x = 0, y = 0;
    let move = [null, null];
    let hits = player.gameboard.getHits();
    let Misses = player.gameboard.getMisses();

    if(cord !== null){
        let [a, b] = cord;

        if((hits[a][b + 1] === 0 && (b + 1) < 9) && (Misses[a][b + 1] === 0 && (b + 1) < 9)){

          move = [a, b + 1];
          return move;

        }else if((hits[a][b - 1] === 0 && (b - 1) < 9) && (Misses[a][b - 1] === 0 && (b - 1) < 9)){

          move = [a, b - 1];
          return move;
          
        }else{
            let [a, b] = cord;
            // x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);

            if(hits[a][y] !== 0 && Misses[a][y] !== 0){
                while(hits[a][y] !== 0 && Misses[a][y] !== 0) {
                  x = Math.floor(Math.random() * 10);
                  y = Math.floor(Math.random() * 10);
                }
            }

            move = [a, y];
            return move;
            
        }

    }else{
        
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        
        

        if(hits[x][y] !== 0 && Misses[x][y] !== 0){
            while(hits[x][y] !== 0 && Misses[x][y] !== 0){
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
            }
            

            move = [x, y];
            return move;

        }else{
            
             move = [x, y];
             return move;
        }    
    }

}

export {GameBoard, Player, celebro, Ship };