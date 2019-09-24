'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Checker piece symbols for easy access
let blackCheckerSymbol = '◉';
let whiteCheckerSymbol = '◎';
let blackKingCheckerSymbol = '♚';
let whiteKingCheckerSymbol = '♔';

// player turn
let playerTurn = 'black';

class Checker {
  constructor(symbol){
    this.symbol = symbol;
    this.isKing = false;
  }
  // Label the piece a king
  makeKing() {
    // Make the piece king
    this.isKing = true;

    // If checker is black
    if (this.symbol === blackCheckerSymbol){
      this.symbol = blackKingCheckerSymbol;
    } 
    // If checker is white
    else if (this.symbol === whiteCheckerSymbol){
      this.symbol = whiteKingCheckerSymbol;
    }
  }

  // Returns true if the piece is a king
  isKingChecker() {
    return this.isKing;
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
      blackCheckers: [],
      blackKingCheckers: [],
      whiteCheckers: [],
      whiteKingCheckers: []
    };
  }

  // Populate the grid and the checker Positions
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

  // Prints out the grid
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

// Returns true or false based on whether the checker is black or white.
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

  // Clears the spot on the grid and in the checker positions object
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

  // Places down a checker by updating the grid and the 
  placeChecker(row, column, checker){
    // Create our coordinates 'data type'
    const coordinates = [Number(row), Number(column)];
      // If checker is black.
    if (checker.symbol === blackCheckerSymbol || checker.symbol === blackKingCheckerSymbol){
      // Set the grid position to a checker
      this.grid[row][column] = checker;
      // Update the checker positions object.
      this.checkerPositions.blackCheckers.push(coordinates);
    } 
    // If checker is white.
    else if (checker.symbol === whiteCheckerSymbol || checker.symbol === whiteKingCheckerSymbol){
      // Set the grid position to a checker
      this.grid[row][column] = checker;
      // Update the checker positions object.
      this.checkerPositions.whiteCheckers.push(coordinates);
    } 

  }

  // Jumps a checker
  jumpChecker(startCoo, endCoo, checker){
    // If the starting piece is black
    if (this.blackOrWhite(startCoo)){
      // Define some potential coordinates
      let rightPotential = [endCoo[0] - 1, endCoo[1] + 1];
      let leftPotential = [endCoo[0] - 1, endCoo[1] - 1];
      // If the endCoo column was +1 of the startCoo column
      if (endCoo[1] === (startCoo[1] + 1)){
        // Jump the checker one row up and one column to the right (right potential)
        this.placeChecker(rightPotential[0], rightPotential[1], checker);
      }
      // If the endCoo column was -1 of the startCoo column
      else if (endCoo[1] === (startCoo[1] - 1)){
        // Jump the checker one row up and one column to the left (left potential)
        this.placeChecker(leftPotential[0], leftPotential[1], checker);
      }
    }
    // If the starting piece is white
    else if (!this.blackOrWhite(startCoo)){
      // Define some potential coordinates
      let rightPotential = [endCoo[0] + 1, endCoo[1] + 1];
      let leftPotential = [endCoo[0] + 1, endCoo[1] - 1];
      // If the endCoo column was +1 of the startCoo column
      if (endCoo[1] === (startCoo[1] + 1)){
        // Jump the piece one row down and one column to the right (right potentia)
        this.placeChecker(rightPotential[0], rightPotential[1], checker);
      }
      // If the endCoo column was -1 of the startCoo column
      else if (endCoo[1] === (startCoo[1] - 1)){
        // Jump the piece one row down and one column to the left (left potential)
        this.placeChecker(leftPotential[0], leftPotential[1], checker);
      }
    }
  }

  // Turns the checker into king
  makeKing(coordinates){
    // If checker is black
    if (this.blackOrWhite(coordinates)){
      // grab the checker object that we want to turn to king
      let checker = this.selectChecker(coordinates[0], coordinates[1]);
      // turn the checker into king
      checker.makeKing();
      // Push the checker coordinates to the checkerPositions object
      this.checkerPositions.blackKingCheckers.push(coordinates);
      // console.log(checker);
      // console.log(this.grid)
    }
    // If checker is white
    else if (this.blackOrWhite(coordinates) === false){
      // turn the checker into king
      checker.makeKing();
      // Push the checker to the checkerPositions object
      this.checkerPositions.whiteKingCheckers.push(coordinates);
    }
  }
}

class Game {
  constructor() {
    this.board = new Board;
    this.whitePoints = 0;
    this.blackPoints = 0;
  }
  start() {
    this.board.createGrid();
    this.board.placeCheckers();
  }

  // Checks to see that the correct player is moving the checker
  validPlayer(startCoo){
    // Turn the player turn to a boolean
    let truePlayer = null;
    if (playerTurn === 'black'){
      truePlayer = true;
    }else {
      truePlayer = false;
    }

    // If the piece being moved is the same as the player move return true
    if (this.board.blackOrWhite(startCoo) === truePlayer){
      return true;
    }else{
      console.log(`\n >>> Bruh... It's not your turn...`);
      return false;
    }
  }

  // Checks to see that input is valid
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

  // Makes sure that the ending position has a valid row
  validRow(startCoordinates, endCoordinates, checker){
    // If checker is king
    if (checker.isKingChecker()){
      // Regardless of color, retuen true if end row is one above or one below
      if ((endCoordinates[0] === startCoordinates[0] - 1) ||
            endCoordinates[0] === startCoordinates[0] + 1){
        return true;
      } else {
        console.log(`Invalid Row. Row: ${endCoordinates[0]} is not a valid option.`);
        return false;
      }
    }
    // If it's a regular checker
    else {
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

        // Make sure that end row is increasing by one
        if (endCoordinates[0] === (startCoordinates[0] + 1)){
          return true;
        }else {
          console.log(`Invalid Row. Row: ${endCoordinates[0]} is not a valid option.`);
          return false;
        }
      }
    }
  }

  // makes sure that the ending position has a valid column
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

  // Checks to see that the endCoordinates doesn't have its own checker piece already
  validPos(startCoo, endCoo){
    // If it's player black's turn & the endCoo piece is black (aka true) 
    //    or if it's player white's turn & the enCoo piece is white (aka false), then the move is not valid.

    if (((this.board.blackOrWhite(startCoo) === true) && (this.board.blackOrWhite(endCoo) === true)) ||
        (((this.board.blackOrWhite(startCoo) === false) && (this.board.blackOrWhite(endCoo) === false)))){
      console.log(`You already have a checker piece there!`);
      return false;
    }else {
      return true;
    }
  }

  // Condenses previous conditions into one function
  validMove(startCoo, endCoo, checker) {
    // Make sure that it's moving to a valid row, a valid column, & that it's an open position.
    if (this.validRow(startCoo, endCoo, checker) && 
        this.validCol(startCoo, endCoo) && 
        this.validPos(startCoo, endCoo) &&
        this.validPlayer(startCoo)){
      return true;
    }else {
      return false;
    }
  }

  // Checks to see if a jump is possible
  validJump(startCoo, endCoo){
    // If there is something other than null in the endCoo position (aka if there is the oponent's piece)
    if (this.board.blackOrWhite(endCoo) !== null){
      // If the starting piece is black
      if (this.board.blackOrWhite(startCoo)){
        // Define some potential coordinates
        let rightPotential = [endCoo[0] - 1, endCoo[1] + 1];
        let leftPotential = [endCoo[0] - 1, endCoo[1] - 1];
        // & if there's somewhere to jump to (If right or left potential are not found in checker positions)
        if (!searchForArray(this.board.checkerPositions.blackCheckers, rightPotential) || 
            !searchForArray(this.board.checkerPositions.blackCheckers, leftPotential)){
          this.blackPoints = this.blackPoints + 1;
          console.log(`\n >>> Black has captured ${this.blackPoints} white checker(s)`);
          return true;
        } else {
          return false;
        }
      }
      // If the starting piece is white
      else if (!this.board.blackOrWhite(startCoo)){
        // Define some potential coordinates
        let rightPotential = [endCoo[0] + 1, endCoo[1] + 1];
        let leftPotential = [endCoo[0] + 1, endCoo[1] - 1];
        // & if there's somewhere to jump to (If right or left potential are not found in checker positions)
        if (!searchForArray(this.board.checkerPositions.whiteCheckers, rightPotential) || 
            !searchForArray(this.board.checkerPositions.whiteCheckers, leftPotential)){
          this.whitePoints = this.whitePoints + 1;
          console.log(`\n >>> White has captured ${this.whitePoints} black checker(s)`);
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  // Check to see if there's a king
  checkKing(startCoo, endCoo, checker) {
    // If piece is not already king
    if (checker.isKingChecker() === false){
      // If the piece is black & it reaches the opposite end
      if (this.board.blackOrWhite(startCoo) && endCoo[0] === 0){
        return true;
      }
      // If the piece is white & it reaches the opposite end
      else if (this.board.blackOrWhite(startCoo) === false && endCoo[0] === 7){
        return false
      }else {
        return null;
      }
    } else {
      return false;
    }
    
  }

  // Takes in coordinates and moves the checker piece
  moveChecker(start, end){
    // If nobody has won play the game
    if (this.blackPoints < 7 || this.whitePoints < 7){
      // Make sure input is valid
      if (this.validInput(start, end)){
        // Turn the start and end into small arrays. These let us choose the coordinates row = array[0], column = array[1];
        let startNum = start.split('');
        let endNum = end.split('');
        // Turn the values in each array into integers.
        let startCoordinates = startNum.map(val => parseInt(val, 10));
        let endCoordinates = endNum.map(val => parseInt(val, 10));
        // Identify the checker object (select checker)
        let checker = this.board.selectChecker(startCoordinates[0], startCoordinates[1]);
        // Check to see that the move is valid
        if (this.validMove(startCoordinates, endCoordinates, checker)){
          // If there is an oponent's piece
          if (this.validJump(startCoordinates, endCoordinates)){
            // Jump the checker & capture
            this.board.jumpChecker(startCoordinates, endCoordinates, checker);
            this.board.clearSpot(startCoordinates[0], startCoordinates[1]);
            this.board.clearSpot(endCoordinates[0], endCoordinates[1]);
            // 
            //  Switch player turn
            if (playerTurn === 'black'){
              playerTurn = 'white';
            } else if (playerTurn === 'white'){
              playerTurn = 'black';
            }
          } 
          // If there is no piece to capture (default move)
          else{
            //  Place the checker down on the board
            this.board.placeChecker(endCoordinates[0], endCoordinates[1], checker);
            // If a king can be made, make it
            if (this.checkKing(startCoordinates, endCoordinates, checker)){
              console.log(`\n >>> ${playerTurn} made a King!`);
              this.board.makeKing(endCoordinates);
            }
            //  Clear the start spot on the board
            this.board.clearSpot(startCoordinates[0], startCoordinates[1]);
            //  Switch player turn
            if (playerTurn === 'black'){
              playerTurn = 'white';
            } else if (playerTurn === 'white'){
              playerTurn = 'black';
            }
          }
        }
      }
    } else {
      console.log(`${playerTurn} is the winner!`);
    }
  }
}

function getPrompt() {
  console.log(`\n >>>> It's ${playerTurn}'s turn <<<<`);
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

// This game is playable; however, it was designed differently than the tests were intended to test for.
//  For example, the jump & capture is automated so to capture a piece the player moves their checker to the piece they want to capture and the game automatically captures and jumps their piece.
//  Another difference is that the black and white cheker pieces are stored in an object so there is syntatical difference to call them.
//    Some of the tests were altered to match the gameplay.
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
      game.moveChecker('30', '41');
      assert(game.board.grid[5][2]);
      assert(!game.board.grid[4][1]);
      assert.equal(Number(game.board.checkerPositions.blackCheckers.length) + Number(game.board.checkerPositions.whiteCheckers.length), 23);
    });
  });
} else {
  getPrompt();
}
