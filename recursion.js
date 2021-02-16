//CS30 Final Project Recursion File
//Recursive backtracking file

//Resources:
// Geeks for Geeks (Website): N-Queen Problem
// Back to Back SWE (Youtube): 3 Keys to Backtracking

let original = [[0,0,0,2,6,0,7,0,1],
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
    return original;
  }

  //check if cell is empty
  if (original[row][col] === 0){
    for (let num = 1; num<=9; num++){
      original[row][col] = num;
  
      if (checkNum(row, col, num) === true){
  
        //recursive call
        if (solveGrid(row, col + 1)){
          return true;
        }
      }
    }
    //backtracks
    original[row][col] = 0;
  }

  else {
    solveGrid(row, col+1);
  }
}

function checkNum(row, col, num){
  //check row
  if (original[row].includes(num)){
    return false;
  }

  //check column
  for (let i = 0; i<9; i++){
    if (num === original[i][col]){
      return false;
    }
  }

  //check 3x3 square
  //top left
  if (row <= 2 && col <= 2){
    for (let i = 0; i <= 2; i++){
      for (let j = 0; j <= 2; j++){
        if (num === original[i][j]){
          return false;
        }
      }
    }
  }
  //top middle
  else if (row <= 2 && col <= 5){
    for (let i = 0; i <= 2; i++){
      for (let j = 3; j <= 5; j++){
        if (num === original[i][j]){
          return false;
        }
      }
    }
  }
  //top right
  if (row <= 2 && col <= 8){
    for (let i = 0; i <= 2; i++){
      for (let j = 6; j <= 8; j++){
        if (num === original[i][j]){
          return false;
        }
      }
    }
  }
}