/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


/*
O: an array of arrays (matrix) representing a board with no conflicts
I: a number
C:
E: if zero is passed in -- what should be returned?
*/
window.findNRooksSolution = function(n) {
  //create a board using new board
  let tempBoard = new Board({'n': n});
  //iterate across the board setting the major diagonal all to 1
  let matrix = tempBoard.attributes;
  let i = 0;
  let solution = [];
  for (row in matrix) {
    if (row === 'n') {
      break;
    }
    tempBoard.attributes[row][i] = 1;
    solution.push(tempBoard.attributes[row]);
    i++;
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  let value = n;
  let innerFunc = function(value) {
    if (value === 0) {
      return 1;
    } else {
      return value * innerFunc(value - 1);
    }
  };

  let solutionCount = innerFunc(value);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);

  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  debugger;
  if (n === 0) {
    return {'n': 0};
  }
  //make a board (empty)
  let board = new Board({'n': n});
  //place pice one (at 0, 0)
  board.attributes[0][0] = 1;
  //create a pieces counter
  let remainingPieces = n - 1;
  let pieces = 1;

  const innerFunc = function(board) {
    //place a piece at the next availible spot
    if (board.setNextPiece()) {
      pieces++;
      remainingPieces--;
    }
    //BASE CASE - board with all pieces placed and passes (return the board)
    if (board.hasAnyQueensConflicts() === false && pieces === n) {
      return board.returnMatrix();
    }
    //BASE CASE - board with one piece at the last spot (return undefined)
    if (!board.moveLastPiece()) {
      return;
    }
    //RECURSIVE - board has less than n pieces and has no queen conflics && remianing pieces is > 0
    return innerFunc(board);
  };
  let solution = innerFunc(board);



  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
