'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Checker piece symbols for easy access
let blackCheckerSymbol = '⚫';
let whiteCheckerSymbol = '⚪';
let kingCheckerSymbol = '👑';

// player turn
let playerTurn = 'black';

class Checker {
  constructor(symbol){
    this.symbol = symbol;
  }
}

// Because two arrays are not equal even when they contain the same elements
//  we cannot use 'array.includes(param)'. As an alternative, here is a premade
//  helper funtion found here https://stackoverflow.com/a/19543566 & slighlty tweaked.
function searchForArray(haystack, needle){
  var i, j, current;
  for(i = 0; i < haystack.length; ++i){
    if(needle.length === haystack[i].length){
      current = haystack[i];
      for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
      if(j === needle.length)
        return true;
    }
  }
  return false;
}
// For the same reason that we made the searchForArray() fn, this function grabs the index of an array within
//    another array. This one was custom made from my noggin.
function getIndexOfPos(array, value){
  let row = value[0];
  let col = value[1];
  let index = -1;
  for(let i = 0; i < array.length; i++){
    if (array[i][0] === row && array[i][1] === col){
      index = i;
    }
  }
  return index;
}

class Board {
  constructor() {
    this.grid = [];
    this.checkerPositions = {
      whiteCheckers: [],
      blackCheckers: []
    };
  }
  placeCheckers(){
    // Place white checkers
    for (let row1 = 0; row1 < 3; row1++){
      for(let col1 = 0; col1 < 8; col1++){
        if((row1 % 2 === 0 && col1 % 2 === 1) || (row1 % 2 === 1 && col1 % 2 === 0) ){
          //instantiate new checker object
          const whiteChecker = new Checker(whiteCheckerSymbol);
          //Set down checker at board grid position
          this.grid[row1][col1] = whiteChecker;
          //Create coordinate data type that we will push
          const coordinates = [row1, col1];
          //Push the coordinates to our checkers array in object
          this.checkerPositions.whiteCheckers.push(coordinates);
        }
      }
    }
    // Place black checkers
    for (let row2 = 5; row2 < 8; row2++){
      for(let col1 = 0; col1 < 8; col1++){
        if((row2 % 2 === 0 && col1 % 2 === 1) || (row2 % 2 === 1 && col1 % 2 === 0) ){
          //instantiate new checker object
          const blackChecker = new Checker(blackCheckerSymbol);
          //Set down checker at board grid position
          this.grid[row2][col1] = blackChecker;
          //Create coordinate data type that we will push
          const coordinates = [row2, col1];
          //Push the coordinates to our checkers array in object
          this.checkerPositions.blackCheckers.push(coordinates);
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

// Returns true or false based on whether the piece is black or white.
  blackOrWhite(coordinates){
    if (searchForArray(this.checkerPositions.whiteCheckers, coordinates)){
      //If it's in the white category
      return false;
    }else if (searchForArray(this.checkerPositions.blackCheckers, coordinates)){
      //If it's in the black category
      return true;
    }else {
      //If it's not anywhere
      return null;
    }
  }

  clearSpot(row, column){
    //Let's update our checkerPositions object
    // Create our coordinates 'data type'
    const coordinates = [Number(row), Number(column)];
    if (this.blackOrWhite(coordinates) === true){
      // If the piece is in the black category
      //  Get the index that the piece is in
      let indexOfChecker = getIndexOfPos(this.checkerPositions.blackCheckers, coordinates);

      //Remove the value from that index
      this.checkerPositions.blackCheckers.splice(indexOfChecker, 1);

      // Set that grid spot to null
      this.grid[row][column] = null;
      return true;

    } else if (this.blackOrWhite(coordinates) === false){
      // If the piece is in the white category
      //  Get the index that the piece is in
      let indexOfChecker = getIndexOfPos(this.checkerPositions.whiteCheckers, coordinates);

      //Remove the value from that index
      this.checkerPositions.whiteCheckers.splice(indexOfChecker, 1);

      // Set that grid spot to null
      this.grid[row][column] = null;
      return true;

    } else if (this.blackOrWhite(coordinates) === null){
      return false;
    }
  }

  placeChecker(row, column, checker){
    // Create our coordinates 'data type'
    const coordinates = [Number(row), Number(column)];
      // If checker is black.
    if (checker.symbol === blackCheckerSymbol){
      // Set the grid position to a checker
      this.grid[row][column] = checker;
      // Update the checker positions object.
      this.checkerPositions.blackCheckers.push(coordinates);
    } else if (checker.symbol === whiteCheckerSymbol){
      // If checker is white.
      // Set the grid position to a checker
      this.grid[row][column] = checker;
      // Update the checker positions object.
      this.checkerPositions.whiteCheckers.push(coordinates);
    } 

  }
  jumpChecker(startCoo, endCoo, checker){
    // Kill the checker in the end position
    this.clearSpot(endCoo[0], endCoo[1]);
    // If the starting piece is black
    if (this.blackOrWhite(startCoo)){
      // If the endCoo column was +1 of the startCoo column
      if (endCoo[1] === (startCoo[1] + 1)){
        // Jump the checker one row up and one column to the right
        this.placeChecker((endCoo[0] + 1), (endCoo[1] + 1), checker);
      }
      // If the endCoo column was -1 of the startCoo column
      else if (endCoo[1] === (startCoo[1] - 1)){
        // Jump the checker one row up and one column to the left
        this.placeChecker((endCoo[0] + 1), (endCoo[1] - 1), checker);
      }
    }
    // If the starting piece is white
    else if (!this.blackOrWhite(startCoo)){
      // If the endCoo column was +1 of the startCoo column
      if (endCoo[1] === (startCoo[1] + 1)){
        // Jump the piece one row down and one column to the right
        this.placeChecker((endCoo[0] - 1), (endCoo[1] + 1), checker);
      }
      // If the endCoo column was -1 of the startCoo column
      else if (endCoo[1] === (startCoo[1] - 1)){
        // Jump the piece one row down and one column to the left
        this.placeChecker((endCoo[0] - 1), (endCoo[1] - 1), checker);
      }
    }
  }
}

class Game {
  constructor() {
    this.board = new Board;
  }
  start() {
    this.board.createGrid();
    this.board.placeCheckers();
    console.log(this.board.checkerPositions);
  }
  validInput(start, end){
    // Check to see if inputs convert to integers.
    if (isNaN(start) || isNaN(end)){
      // If not integers
      console.log('Please make sure that you input numbers.');
      return false;
    } else {
      // Convert inputs to ints
      let startRow = Number(start.charAt(0));
      let endRow = Number(end.charAt(0));
      // if they are ints, check to see that they are less than or equal to 7
      if (startRow <= 7 && endRow <= 7){
        // Let's get the col & turn them into ints
        let startCol = Number(start.charAt(1));
        let endCol = Number(end.charAt(1));
        if (startCol <= 7 && endCol <= 7){
          return true;
        } else {
          console.log('Please enter a column number less than 7.');
          return false;
        }
      } else {
        console.log('Please enter a row number less than 7.');
        return false;
      }
    }
  }
  validRow(startCoordinates, endCoordinates){
    // If the start piece is black
    if (this.board.blackOrWhite(startCoordinates)){
      // Make sure that end row is decreasing -1.
      if (endCoordinates[0] === startCoordinates[0] - 1){
        return true;
      }else {
        console.log(`Invalid Row. Row: ${endCoordinates[0]} is not a valid option.`);
        return false;
      }
    }
    // If the start piece is white
    else if (!this.board.blackOrWhite(startCoordinates)){
      if (endCoordinates[0] === (startCoordinates[0] + 1)){
        return true;
      }else {
        return false;
      }
    }
  }
  validCol(startCoordinates, endCoordinates){
    // regardless if it's white or black
    // Make sure that the end column is either one in front or one behing start column.
    if (endCoordinates[1] === (startCoordinates[1] + 1) ||
        endCoordinates[1] === (startCoordinates[1] - 1)){
      return true;
    } else {
      console.log(`Invalid column. Column ${endCoordinates[1]} is not a valid option.`);
      return false;
    }
  }
  validPos(endCoo){
    // Check to see that the endCoordinates doesn't have a piece
    // If it's player black's turn & the endCoo piece is black (aka true) 
    //    or if it's player white's turn & the enCoo piece is white (aka false), then the move is not valid.
    if (playerTurn === 'black' && this.board.blackOrWhite(endCoo) ||
        (playerTurn === 'white' && !this.board.blackOrWhite(endCoo))){
      console.log(`You already have a checker piece there!`);
      return false;
    }else {
      return true;
    }
  }
  validMove(startCoo, endCoo) {
    // Make sure that it's moving to a valid row, a valid column, & that it's an open position.
    if (this.validRow(startCoo, endCoo) && 
        this.validCol(startCoo, endCoo) && 
        this.validPos(endCoo)){
      return true;
    }else {
      return false;
    }
  }
  validJump(startCoo, endCoo){
    // If there is something other than null in that position
    if (this.board.blackOrWhite(endCoo) !== null){
      // & if there's somewhere to jump to
      if ()
    } else {
      return false;
    }
  }

  moveChecker(start, end){
    // Make sure input is valid
    if (this.validInput(start, end)){
      // Turn the start and end into small arrays. These let us choose the coordinates row = array[0], column = array[1];
      let startNum = start.split('');
      let endNum = end.split('');
      // Turn the values in each array into integers.
      let startCoordinates = startNum.map(val => parseInt(val, 10));
      let endCoordinates = endNum.map(val => parseInt(val, 10));
      // Identify the checker object
      let checker = this.board.selectChecker(startCoordinates[0], startCoordinates[1]);
      console.log(`Is move valid?: ${this.validMove(startCoordinates, endCoordinates)}`);
      // Check to see that the move is valid
      if (this.validMove(startCoordinates, endCoordinates)){
        // If there is an oponent's piece, kill it & jump!
        //  Place the checker down on the board
        this.board.placeChecker(endCoordinates[0], endCoordinates[1], checker);
        //  Clear the spot on the board
        this.board.clearSpot(startCoordinates[0], startCoordinates[1]);
        //  Switch player turn
        playerTurn = 'white';
      }
    }
  }
}

function getPrompt() {
  game.board.viewGrid();
  console.log(`It's ${playerTurn}'s turn:`);
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
      assert.equal(Number(game.board.checkerPositions.blackCheckers.length) + Number(game.board.checkerPositions.whiteCheckers.length), 24);
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
