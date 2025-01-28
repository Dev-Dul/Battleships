import { Ship } from "../src/battleship";
import { GameBoard } from "../src/battleship";

test("Checkspace checks whether there's available space to place the ship", () => {
    let ship1 = new Ship([0, 3], 4, "Destroyer");
    let ship2 = new Ship([0, 3], 5, "Carrier");
    let board = new GameBoard();

    board.place([0, 3], "Destroyer", 4);
    board.place([1, 5], "Carrier", 5);
    
    expect(board.checkSpace(0, 3, ship1)).toBe(false);
    expect(board.checkSpace(2, 3, ship2)).toBe(true);
});

// test for y axis
test("Tests if space is available on the y-axis (vertical)", () => {
    let ship3 = new Ship([0, 3], 5, "Carrier");
    let ship4 = new Ship([0, 5], 5, "Carrier");
    let board2 = new GameBoard();
    board2.place([0, 0], "Carrier", 5, "y");
    board2.place([0, 5], "Destroyer", 4, "y");
    

    expect(board2.checkSpace(4, 0, ship3)).toBe(false);
    expect(board2.checkSpace(0, 8, ship4)).toBe(true);


});