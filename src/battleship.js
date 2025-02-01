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
     // Check if all the cells to place the ship are 
      if(axis === "y"){
        for(let i = 0; i < ship.length; i++){
            if(this.#grid[x + i][y] !== 0){
                return false;
            }
        }
      }else{

          for(let i = 0; i < ship.length; i++){
            if(this.#grid[x][y + i] !== 0){
                return false;
            }
          }

      }

      return true;
    }

    place(crd, name, length, axis = "x"){
        let [x, y] = crd;

        // console.log(axis);
        // console.log(crd);
        // console.log(this.#grid);

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
        for(const ship of this.ships){
            const occupiedCells = this.getCells(ship);

            for(const cell of occupiedCells){
                if(cell.x === x && cell.y === y){
                    ship.addHit();
                    this.hits[x][y] = 1;
                    return true;
                }
            }
        }

        this.#misses[x][y] = 1;
        this.hits[x][y] = 1;
        return false;
    
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
    let grid = player.gameboard.getGrid();

    if(cord !== null){
        let [a, b] = cord;
        y = Math.floor(Math.random() * 10);

        if(grid[a][y] !== 0){
          while(grid[a][y] !== 0){
            y = Math.floor(Math.random() * 10);
          }

          move = [a, y];
          grid[a][y] = 1;
          return move;

        }else{
          move = [a, y];
          grid[a][y] = 1;
          return move;
        }

    }else{
        
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        
        if(grid[x][y] !== 0){
            while(grid[x][y] !== 0){
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
            }

            move = [x, y];
            grid[x][y] = 1;
            return move;

        }else{
            
             move = [x, y];
             grid[x][y] = 1;
             return move;
        }    
    }

}

export {GameBoard, Player, celebro, Ship };