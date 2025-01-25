class ship{
    constructor(crd, length, name){
        this.name = name;
        this.hit = 0;
        this.crd = crd;
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
        let coord = [a, this.length];
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

    checkBounds(x, y, length){
        let check = this.#grid.length - length;
        let bounds = false;
        if((x < 9 && y < 9) && (check >= length)){
          bounds = true;
        }

        return bounds;
    }

    checkSpace(x, y, ship){
      let isFree = false;
      // Check if all the cells to place the ship are available
      for(let i = 0; i < ship.length; i++){
        if(this.#grid[x][y] !== 0){
          isFree = false;
        }else{
          isFree = true;
        }
        x++;
      }

      return isFree;
    }

    place(crd, name, length, axis = "x"){
        let [x, y] = crd;

        if(axis === "y"){
          // First check to see whether the coordinates are within range
          if(this.checkBounds(x, y, length)){
            let ship = new ship(crd, length, name);
            this.ships.push(ship);

            // Proceed to placing ship only if selected coordinate is not occupied.
            if(this.checkSpace(x, y, ship)){
              for(let i = 0; i < length; i++){
                this.#grid[x][y] = 1;
                x++;
              }

            }else{
              throw new Error("Coordinate already taken");
            }

          }else{
            throw new Error("Coodinates are out of bound!.");
          }

        }else{

            // First check to see whether the coordinates are within range
            if(this.checkBounds(x, y, length)){
                let ship = new ship(crd, length, name);
                this.ships.push(ship);

                // Proceed to placing ship only if selected coordinate is not occupied.
                if(this.checkSpace(x, y, ship)){
                    for(let i = 0; i < length; i++){
                        this.#grid[x][y] = 1;  
                        y++;
                    }
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

    receiveAttack(x, y){
        for(let i = 0; i < this.ships.length; i++){
            let [a, b] = this.ships[i].coords();
            if(x === a && y <= b){
                this.ships[i].addHit();
                this.hits[x][y] = 1;
                return true;
            }else{
                this.#misses[x][y] = 1;
                this.hits[x][y] = 1;
                return false;
            }
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

export {GameBoard, Player, celebro };