import { GameBoard } from "../src/battleship";

test("Returns an array with the coordinates of all misses", () => {
    let board = new GameBoard();

    board.place([0, 0], "Destroyer", 4);
    board.place([1, 0], "Carrier", 5);
    board.place([2, 0], "Submarine", 3);

    board.receiveAttack(0, 5);
    board.receiveAttack(0, 7);
    board.receiveAttack(1, 8);
    board.receiveAttack(1, 9);
    board.receiveAttack(2, 5);
    board.receiveAttack(2, 7);

    const testArr = [
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    expect(board.getMisses()).toEqual(testArr);
})