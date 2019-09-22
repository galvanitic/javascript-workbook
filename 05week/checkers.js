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
function Checkers() {
  // Your code here
}

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
    
    //Let's update our checkerPositions object
    // Create our coordinates 'data type'
    const coordinates = [Number(row), Number(column)];
      // If checker is black.
    if (checker.symbol === blackCheckerSymbol){
      // Set the grid position to a checker
      this.grid[row][column] = checker;
      this.checkerPositions.blackCheckers.push(coordinates);
    } else if (checker.symbol === whiteCheckerSymbol){
      // If checker is white.
      // Set the grid position to a checker
      this.grid[row][column] = checker;
      this.checkerPositions.whiteCheckers.push(coordinates);
    } 

  }

  killChecker(position){
    let checker = this.selectChecker(position[0], position[1]);
    let index = this.checkers.findIndex(position);
    this.checkers.splice(index, 1);
    this.grid[index] = null;
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
    // Convert inputs to ints
    let startNum = Number(start);
    let endNum = Number(end);

    // Check to see if inputs convert to integers.
    if (isNaN(startNum) || isNaN(endNum)){
      // If not integers
      console.log('Please make sure that you input numbers.');
      return false;
    } else {
      // if they are ints check to see that they are less than or equal to 7
      if (startNum <= 77 && endNum <= 77){
        return true
      } else {
        console.log('Please enter a number less than 77.')
      }
    }
  }
  validRow(startCoordinates, endCoordinates){
    if (this.board.blackOrWhite(startCoordinates) === true) {
      //If it's a black piece, the row must decrease
      if (startCoordinates[0] > endCoordinates[0]){
        return true;
      }else {
        return false;
      }
    }else if (this.board.blackOrWhite(startCoordinates) === false){
      //If it's a white piece, the row must increase
      if (startCoordinates[0] < endCoordinates[0]){
        return true;
      }else {
        return false;
      }
    } else {
      console.log('Something went wrong...');
    }
  }
  validMove(){

  }

  moveChecker(start, end){
    // console.log(this.board.checkerPositions);

    // Turn the start and end into small arrays. These let us choose the coordinates row = array[0], column = array[1];
    let startNum = start.split('');
    let endNum = end.split('');
      // Turn the values in each array into integers.
    let startCoordinates = startNum.map(val => parseInt(val, 10));
    let endCoordinates = endNum.map(val => parseInt(val, 10));

    // Identify the checker object
    let checker = this.board.selectChecker(startCoordinates[0], startCoordinates[1]);
    console.log(this.validRow(startCoordinates, endCoordinates));
    //Place the checker down on the board
    this.board.placeChecker(endCoordinates[0], endCoordinates[1], checker);
    //Clear the spot on the board
    this.board.clearSpot(startCoordinates[0], startCoordinates[1]);
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
