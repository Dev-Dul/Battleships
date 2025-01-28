import { GameBoard, Ship } from "../src/battleship";

test("Fetches hits array that shows where a ship has been hit", () => {
    let board = new GameBoard();

    board.place([0, 0], "Carrier", 5);
    board.place([1, 0], "Destroyer", 4);
    board.place([5, 5], "Cruiser", 3);
    board.receiveAttack(0, 3);
    board.receiveAttack(0, 2);
    board.receiveAttack(0, 1);
    board.receiveAttack(1, 3);
    board.receiveAttack(5, 7);

    let testArr = [
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    expect(board.getHits()).toEqual(testArr);

});