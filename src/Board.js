// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        // console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        // console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        // console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },

    //UTILITY METHODS
    findLastPiece: function() {
      let last;
      for (row in this.attributes) {
        if (row !== 'n') {
          for (let i = 0; i < this.attributes[row].length; i++) {
            if (this.attributes[row][i] === 1) {
              last = [row, i];
            }
          }
        }
      }
      return last ? last : false;
    },

    setNextPiece: function() {
      //find the last piece
      let [row, col] = this.findLastPiece();
      //set a piece right next to it
      //Last colum in the current row condition
      if (this.attributes[row][col + 1] === undefined) {
        // Last row on the board condition
        if (parseInt(row) === this.attributes.n - 1) {
          return false;
        }
        //not the last row on the board condition
        this.attributes[parseInt(row) + 1][0] = 1;
        //not the last column in the current row condition
      } else {
        this.attributes[row][col + 1] = 1;
      }
      let context = this;

      const fixPiece = function(context) {
        if (!context.hasAnyQueensConflicts()) {
          return true;
        } else {
          let position = context.findLastPiece();
          let [row, col] = position;
          context.attributes[row][col] = 0;
          // Last spot in the current row condition
          if (context.attributes[row][col + 1] === undefined) {
            // Also the last row in the board condition
            if (context.attributes[parseInt(row) + 1] === undefined) {
              return false;
            }
            context.attributes[parseInt(row) + 1][0] = 1;
          } else {
            context.attributes[row][col + 1] = 1;
          }
          return fixPiece(context);
        }
      };
      return fixPiece(context);
    },

    // setNextPiece: function() {
    //   //find the last piece
    //   let [row, col] = this.findLastPiece();
    //   console.log(row, col);
    //   console.log(col + 1);
    //   //check if this is the last spot
    //   if (this.attributes[row][col + 1] === undefined) {
    //     if (parseInt(row) === this.attributes.n - 1) {
    //       return false;
    //     }
    //   }
    //   this.attributes[row][col] = 0;

    //   //set the next piece
    //   row = parseInt(row);
    //   row++;
    //   this.attributes[row][0] === 1;

    //   let context = this;

    //   const fixPiece = function(context) {
    //     if (!context.hasAnyQueensConflicts()) {
    //       return true;
    //     } else {
    //       let position = context.findLastPiece();
    //       let [row, col] = position;
    //       context.attributes[row][col] = 0;
    //       // Last spot in the current row condition
    //       if (context.attributes[row][col + 1] === undefined) {
    //         // Also the last row in the board condition
    //         if (context.attributes[parseInt(row) + 1] === undefined) {
    //           return false;
    //         }
    //         context.attributes[parseInt(row) + 1][0] = 1;
    //       } else {
    //         context.attributes[row][col + 1] = 1;
    //       }
    //       return fixPiece(context);
    //     }
    //   };

    //   return fixPiece(context);
    // },

    moveLastPiece: function() {
      //No other pieces on the board
      if (!this.findLastPiece()) {
        console.log('here');
        return false;
      }
      //Can only run if we find a last piece
      let [row, col] = this.findLastPiece();
      //let lastSpot = [this.attributes.n, this.attributes.n];

      // End of current row condition
      if (this.attributes[row][col + 1] === undefined) {

        // Also Last Row Condition
        if (parseInt(row) === this.attributes.n - 1) {
          this.attributes[row][col] = 0;
          return this.moveLastPiece();
        }
        this.attributes[row][col] = 0;
        this.attributes[parseInt(row) + 1][0] = 1;
      } else {
        this.attributes[row][col] = 0;
        this.attributes[row][col + 1] = 1;
      }
      if (this.hasAnyQueensConflicts()) {
        return this.moveLastPiece();
      } else {
        return true;
      }
    },


    returnMatrix: function() {
      let result = [];
      for (row in this.attributes) {
        if (row !== 'n') {
          result.push(this.attributes[row]);
        }
      }
      return result;
    },

    countPieces: function() {
      let counter = 0;
      for (row in this.attributes) {
        if (row === 'n') {
          return counter;
        }
        for (let i = 0; i < this.attributes[row].length; i++) {
          if (this.attributes[row][i] === 1) {
            counter++;
          }
        }
      }
    },
    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      let row = this.attributes[rowIndex];
      //loop through the row
      let num = 0;
      for (let i = 0; i < row.length; i++) {
        //check for 1 -- mark true
        if (row[i] === 1) {
          num++;
          //if we hit a second 1 return the index
        } if (num === 2) {
          return i;
        }
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //loop through each row
      for (row in this.attributes) {
        //run the has conflicts function
        if (this.hasRowConflictAt(row) !== undefined) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // Define a row length variable to get the number of columns
      let num = 0;
      // Check each row at its column index for pieces
      for (let row in this.attributes) {
        if (this.attributes[row][colIndex] === 1) {
          num++;
        } if (num === 2) {
          return row;
        }
      }
      //If there is more than 1, return the location of the 2nd.
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      if (this.attributes[0] === undefined) {
        return false;
      }
      for (let i = 0; i < this.attributes[0].length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      let num = 0;
      let i = majorDiagonalColumnIndexAtFirstRow;
      //iterate through the object
      for (row in this.attributes) {
        if (i > this.attributes[0].length) {
          return;
        }
        if (this.attributes[row][i] === 1) {
          num++;
        }
        if (num > 1) {
          return row;
        }
        i++;
      }
    },

    hasMajorDiagonalConflictSideAt: function (row) {
      let num = 0;
      let i = 0;
      while (row < Object.keys(this.attributes).length) {
        if (!this.attributes[row]) {
          return;
        }
        let spot = this.attributes[row][i];
        if (spot === 1) {
          num++;
        }
        if (num > 1) {
          return i;
        }
        row++;
        i++;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      if (this.attributes[0] === undefined) {
        return false;
      }
      for (let i = 0; i < this.attributes[0].length; i++) {
        if (this.hasMajorDiagonalConflictAt(i) !== undefined) {
          return true;
        }
      }
      for (row in this.attributes) {
        if (this.hasMajorDiagonalConflictSideAt(row) !== undefined) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      let num = 0;
      let i = minorDiagonalColumnIndexAtFirstRow;
      //iterate through the object
      for (row in this.attributes) {
        if (i < 0) {
          return;
        }
        if (this.attributes[row][i] === 1) {
          num++;
        }
        if (num > 1) {
          return row;
        }
        i--;
      }
    },

    hasMinorDiagonalConflictSideAt: function(row) {
      let num = 0;
      let i = this.attributes[0].length;
      while (row < Object.keys(this.attributes).length) {
        if (!this.attributes[row]) {
          return;
        }
        let spot = this.attributes[row][i];
        if (spot === 1) {
          num++;
        }
        if (num > 1) {
          return i;
        }
        row++;
        i--;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      if (this.attributes[0] === undefined) {
        return false;
      }
      for (let i = 0; i < this.attributes[0].length; i++) {
        if (this.hasMinorDiagonalConflictAt(i) !== undefined) {
          return true;
        }
      }
      for (row in this.attributes) {
        if (this.hasMinorDiagonalConflictSideAt(row) !== undefined) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
