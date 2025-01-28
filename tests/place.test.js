import { GameBoard } from '../src/battleship.js'; // Replace with your actual file path

describe("GameBoard place function", () => {
  let board;

  beforeEach(() => {
    board = new GameBoard(); // Create a new board before each test
  });

  test("Places a ship horizontally within bounds", () => {
    board.place([0, 0], "Battleship", 4, "x"); // Place a ship horizontally

    // Check the grid to ensure the cells are marked correctly
    const grid = board.getGrid();
    expect(grid[0][0]).toBe(1);
    expect(grid[0][1]).toBe(1);
    expect(grid[0][2]).toBe(1);
    expect(grid[0][3]).toBe(1);
  });

  test("Places a ship vertically within bounds", () => {
    board.place([0, 0], "Carrier", 5, "y"); // Place a ship vertically

    // Check the grid to ensure the cells are marked correctly
    const grid = board.getGrid();
    expect(grid[0][0]).toBe(1);
    expect(grid[1][0]).toBe(1);
    expect(grid[2][0]).toBe(1);
    expect(grid[3][0]).toBe(1);
    expect(grid[4][0]).toBe(1);
  });

  test("Throws an error when placing a ship out of bounds horizontally", () => {
    expect(() => {
      board.place([10, 0], "Destroyer", 4, "x"); // Should exceed the grid boundary
    }).toThrow("Coodinates are out of bound!.");
  });

  test("Throws an error when placing a ship out of bounds vertically", () => {
    expect(() => {
      board.place([0, 10], "Destroyer", 4, "y"); // Should exceed the grid boundary
    }).toThrow("Coodinates are out of bound!.");
  });

  test("Throws an error when placing a ship on an occupied space", () => {
    // Place the first ship
    board.place([0, 0], "Cruiser", 3, "x");

    // Attempt to place another ship overlapping the first one
    expect(() => {
      board.place([0, 0], "Destroyer", 4, "x");
    }).toThrow("Coordinate already taken");
  });

  test("Properly adds the ship to the ships list", () => {
    board.place([0, 0], "Submarine", 3, "x");

    // Check if the ship is added to the ships array
    expect(board.ships.length).toBe(1);
    expect(board.ships[0].name).toBe("Submarine");
    expect(board.ships[0].length).toBe(3);
  });

});
