import { GameBoard, Player } from "../src/battleship";

test("Check whether an attack was a hit", () => {
    let board = new GameBoard();
    let player = new Player("Abdul");
    let grid = player.gameboard;
    
    

    grid.place([0, 0], "Carrier", 5);
    grid.place([1, 0], "Destroyer", 4);
    grid.place([2, 0], "Cruiser", 3);
    grid.place([3, 0], "Submarine", 3);
    grid.place([4, 0], "Patrol Boat", 2);

    // console.log(grid.getGrid());

    expect(grid.receiveAttack(0, 5)).toBe(true);
    expect(grid.receiveAttack(1, 1)).toBe(true);
    expect(grid.receiveAttack(2, 2)).toBe(true);
    expect(grid.receiveAttack(3, 5)).toBe(false);
    expect(grid.receiveAttack(3, 4)).toBe(false);

    // board.place([0, 0], "Carrier", 5);
    // board.place([1, 0], "Destroyer", 4);
    // board.place([2, 0], "Cruiser", 3);
    // board.place([3, 0], "Submarine", 3);
    // board.place([4, 0], "Patrol Boat", 2);

    // console.log(board.getGrid());

    // expect(board.receiveAttack(0, 2)).toBe(true);
    // expect(board.receiveAttack(1, 1)).toBe(true);
    // expect(board.receiveAttack(2, 2)).toBe(true);
    // expect(board.receiveAttack(3, 5)).toBe(false);
    // expect(board.receiveAttack(3, 4)).toBe(false);
});

// test("Checks if a vertical ship was hit", () => {
//     let board = new GameBoard();

//     board.place([0, 0], "Carrier", 5, "y");
//     board.place([0, 1], "Destroyer", 4, "y");
//     board.place([0, 2], "Cruiser", 3, "y");
//     board.place([0, 3], "Submarine", 3, "y");
//     board.place([0, 4], "Patrol Boat", 2, "y");

//     expect(board.receiveAttack(1, 0)).toBe(true);
//     expect(board.receiveAttack(1, 1)).toBe(true);
//     expect(board.receiveAttack(2, 2)).toBe(true);
//     expect(board.receiveAttack(4, 3)).toBe(false);
//     expect(board.receiveAttack(3, 3)).toBe(false);


// })