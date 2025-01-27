import { GameBoard } from "../src/battleship";

test("CheckBounds checks whether the move is within the bounds of the grid", () => {
    let board = new GameBoard();
    expect(board.checkBounds(5, 3, 5)).toBe(true);
    expect(board.checkBounds(5, 9, 5)).toBe(false);
});