//CS30 Final Project Recursion File
//Recursive backtracking file

//Resources:
// Geeks for Geeks (Website): N-Queen Problem
// Back to Back SWE (Youtube): 3 Keys to Backtracking

let grid = [[0,0,0,2,6,0,7,0,1],
            [6,8,0,0,7,0,0,9,0],
            [1,9,0,0,0,4,5,0,0],
            [8,2,0,1,0,0,0,4,0],
            [0,0,4,6,0,2,9,0,0],
            [0,5,0,0,0,3,0,2,8],
            [0,0,9,3,0,0,0,7,4],
            [0,4,0,0,5,0,0,3,6],
            [7,0,3,0,1,8,0,0,0]];

let row = 0;
let col = 0;

function solveGrid(row, col){
  //moving onto next row
  if (col === 9 && row <= 8){
    row++;
    col = 0;
  }

  //completed entire board
  else if (col === 9 && row === 8){
    return grid;
  }

  //check if cell is empty
  if (grid[row][col] === 0){
    for (let num = 1; num<=9; num++){  
      if (checkNum(row, col, num) === true){
        grid[row][col] = num;

        //recursive call
        if (solveGrid(row, col + 1)){
          return true;
        }
      }
    }
    //backtrack
    grid[row][col] = 0;
  }

  else {
    solveGrid(row, col+1);
  }
}

function checkNum(row, col, num){
  let rowRange;
  let colRange;

  //check row
  if (grid[row].includes(num)){
    return false;
  }

  //check column
  for (let i = 0; i<9; i++){
    if (num === grid[i][col]){
      return false;
    }
  }

  //check 3x3 square
  if (row <= 2){ //top row
    rowRange = 2;
  }
  else if (row <= 5){ //middle row
    rowRange = 5;
  }
  else if (row <= 8){ //bottom row
    rowRange = 8;
  }

  if (col <= 2){ //left column
    colRange = 2;
  }
  else if (col <= 5){ //middle column
    colRange = 5;
  }
  else if (col <= 8){ //right column
    colRange = 8;
  }

  for (let i = rowRange - 2; i <= rowRange; i++){
    for (let j = colRange - 2; j <= colRange; j++){
      if (num === grid[i][j]){
        return false;
      }
    }
  }
  return true;
}

console.log(solveGrid(row,col));