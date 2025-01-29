import { GameBoard } from "../src/battleship";

describe("Doom() test", () => {
    let board;
    beforeEach(() => {
        board = new GameBoard();
    });


    test("Checks if a grid's entire ships are sunk", () => {

        board.place([0, 0], "Carrier", 5);
        board.place([1, 0], "Destroyer", 4);
        board.place([2, 0], "Submarine", 3);
        
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 10; j++){
                board.receiveAttack(i, j);
            }
        }
    
        expect(board.doom()).toBe(true);
    
    });
    
    test("Checks if a grid's entire ships are sunk (Verical)", () => {
        board.place([0, 0], "Carrier", 5, "y");
        board.place([0, 1], "Destroyer", 4, "y");
        board.place([0, 2], "Submarine", 3, "y");

        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 10; j++) {
            board.receiveAttack(i, j);
          }
        }
    });

    
    test("Checks for false case", () => {
        board.place([0, 0], "Carrier", 5, "y");
        board.place([0, 1], "Destroyer", 4, "y");
        board.place([0, 2], "Submarine", 3, "y");

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 10; j++) {
            board.receiveAttack(i, j);
          }
        }

        expect(board.doom()).toBe(false);
    });
})
