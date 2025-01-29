import { GameBoard } from "../src/battleship";

test("Resets the game", () => {
    let board = new GameBoard();

    board.place([0, 0], "Carrier", 5);
    board.place([1, 0], "Destroyer", 4);
    board.place([2, 0], "Cruiser", 3);
    board.place([3, 0], "Submarine", 3);
    board.place([4, 0], "Patrol Boat", 2);

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 10; j++){
        board.receiveAttack(i, j);
      }
    }

    board.reset();
    const grid = board.getGrid();
    const hits = board.getHits();
    const misses = board.getMisses();

    const checkGrid = grid.every(row => row.every(cell => cell === 0));
    const checkHits = hits.every(row => row.every(cell => cell === 0));
    const checkMisses = misses.every(row => row.every(cell => cell === 0));
    const testArr = [];

    expect(checkGrid).toBe(true);
    expect(checkHits).toBe(true);
    expect(checkMisses).toBe(true);
    expect(board.ships).toEqual(testArr);

});