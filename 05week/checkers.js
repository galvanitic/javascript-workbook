'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function Checkers() {
  // Your code here
}

class Checker {
  constructor(symbol){
    this.symbol = symbol;
  }
}

class Board {
  constructor() {
    this.grid = [];
    this.checkers = [];
  }
  placeCheckers(){
    for (let row1 = 0; row1 < 3; row1++){
      for(let col1 = 0; col1 < 8; col1++){
        if((row1 % 2 === 0 && col1 % 2 === 1) || (row1 % 2 === 1 && col1 % 2 === 0) ){
          const whiteChecker = new Checker('⚪');
          this.grid[row1][col1] = whiteChecker;
          const coordinates = [row1, col1];
          this.checkers.push(coordinates);
        }
      }
    }
    for (let row2 = 5; row2 < 8; row2++){
      for(let col1 = 0; col1 < 8; col1++){
        if((row2 % 2 === 0 && col1 % 2 === 1) || (row2 % 2 === 1 && col1 % 2 === 0) ){
          const blackChecker = new Checker('⚫');
          this.grid[row2][col1] = blackChecker;
          const coordinates = [row2, col1];
          this.checkers.push(coordinates);
        }
      }
    }
  }
  // method that creates an 8x8 array, filled with null values
  createGrid() {
    // loop to create the 8 rows
    for (let row = 0; row < 8; row++) {
      this.grid[row] = [];
      // push in 8 columns of nulls
      for (let column = 0; column < 8; column++) {
        this.grid[row].push(null);
      }
    }
  }
  viewGrid() {
    // add our column numbers
    let string = "  0 1 2 3 4 5 6 7\n";
    for (let row = 0; row < 8; row++) {
      // we start with our row number in our array
      const rowOfCheckers = [row];
      // a loop within a loop
      for (let column = 0; column < 8; column++) {
        // if the location is "truthy" (contains a checker piece, in this case)
        if (this.grid[row][column]) {
          // push the symbol of the check in that location into the array
          rowOfCheckers.push(this.grid[row][column].symbol);
        } else {
          // just push in a blank space
          rowOfCheckers.push(' ');
        }
      }
      // join the rowOfCheckers array to a string, separated by a space
      string += rowOfCheckers.join(' ');
      // add a 'new line'
      string += "\n";
    }
    console.log(string);
  }

  selectChecker(row, column){
    return this.grid[row][column];
  }

  clearSpot(row, column){
    this.grid[row][column] = null;
  }

  placeChecker(row, column, checker){
    this.grid[row][column] = checker;
  }

  killChecker(position){
    let checker = this.selectChecker(position[0], position[1]);
    let index = this.checkers.findIndex(position);
    this.checkers.splice(index, 1);
    this.grid[index] = null;
    // console.log(this.checkers);
  }
}

class Game {
  constructor() {
    this.board = new Board;
  }
  start() {
    this.board.createGrid();
    this.board.placeCheckers();
    console.log(this.board.checkers);
  }
  moveChecker(start, end){
    // These let us choose the coordinates row = array[0], column = array[1];
    let startCoordinates = start.split('');
    let endCoordinates = end.split('');
    let checker = this.board.selectChecker(startCoordinates[0], startCoordinates[1]);
    this.board.clearSpot(startCoordinates[0], startCoordinates[1]);
    this.board.placeChecker(endCoordinates[0], endCoordinates[1], checker);
  }
}

function getPrompt() {
  game.board.viewGrid();
  rl.question('which piece?: ', (whichPiece) => {
    rl.question('to where?: ', (toWhere) => {
      game.moveChecker(whichPiece, toWhere);
      getPrompt();
    });
  });
}

const game = new Game();
game.start();


// Tests
if (typeof describe === 'function') {
  describe('Game', () => {
    it('should have a board', () => {
      assert.equal(game.board.constructor.name, 'Board');
    });
    it('board should have 24 checkers', () => {
      assert.equal(game.board.checkers.length, 24);
    });
  });

  describe('Game.moveChecker()', () => {
    it('should move a checker', () => {
      assert(!game.board.grid[4][1]);
      game.moveChecker('50', '41');
      assert(game.board.grid[4][1]);
      game.moveChecker('21', '30');
      assert(game.board.grid[3][0]);
      game.moveChecker('52', '43');
      assert(game.board.grid[4][3]);
    });
    it('should be able to jump over and kill another checker', () => {
      game.moveChecker('30', '52');
      assert(game.board.grid[5][2]);
      assert(!game.board.grid[4][1]);
      assert.equal(game.board.checkers.length, 23);
    });
  });
} else {
  getPrompt();
}
