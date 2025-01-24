class ship{
    constructor(crd, length, name){
        this.name = name;
        this.hit = 0;
        this.crd = crd;
        this.length = length;
    }

    hit(){
        this.hit++;
    }

    isSunk(){
        if(this.hit >= this.length){
            return true;
        }else{
            return false;
        }
    }
}

class GameBoard{
    constructor(){
        this.grid = [];
        this.ships = [];
        this.misses = [];
        for(let i = 0; i < 10; i++){
            this.grid.push(new Array(10).fill(0));
            this.misses.push(new Array(10).fill(0));
        }
    }

    place(crd, name, length){
        let [x, y] = crd;
        let check = grid.length - length;
        // First check to see whether the coordinates are within range
        if((x < 9 && y < 9) && (check >= length)){
            let ship = new ship(crd, length, name);
            this.ships.push(ship);
            // Proceed to placing ship only if selected coordinate is not occupied.
            if(this.grid[x][y] !== 0){
                for(let i = 0; i < length; i++){
                    this.grid[x][y] = 1;  
                    y++;
                }
            }else{
                throw new Error("Coordinate already taken");
            }    
        }else{
            throw new Error("Coodinates are out of bound!.");
        }
    }

    receiveAttack(x, y){
        for(let i = 0; i < this.ships.length; i++){
            let [a, b] = this.ships[i].crd;
            if(x === a && y === b){
                this.ships[i].hit();
            }else{
                this.misses[x][y] = 1;
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
    constructor(type){
        this.type = type;
        this.gameboard = new GameBoard();
    }
}

export {GameBoard, Player};