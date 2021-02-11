//CS30 Final Project Recursion File
//This file is just for me to experiment and mess around with recursion

function factorial(n){

  //base case 
  if (n === 1){
    return n === 1;
  }

  //recursive call
  else {
    return n * factorial(n-1);
  }
}

function countDown(num){
  if (num <= 0){
    console.log("All done");
    return;
  }
  console.log(num);
  num--;
  countDown(num);
}

function sumRange(num){
  if (num === 1){
    return 1;
  }
  return num + sumRange(num-1);
}

// sumRange(3)
//     return 3 + sumRange(2)
//         return 2 + sumRange(1)
//             return 1

console.log(factorial(4));
countDown(4);
console.log(sumRange(3));

let original = [[0,0,0,2,6,0,7,0,1],
                [6,8,0,0,7,0,0,9,0],
                [1,9,0,0,0,4,5,0,0],
                [8,2,0,1,0,0,0,4,0],
                [0,0,4,6,0,2,9,0,0],
                [0,5,0,0,0,3,0,2,8],
                [0,0,9,3,0,0,0,7,4],
                [0,4,0,0,5,0,0,3,6],
                [7,0,3,0,1,8,0,0,0]];

//go through original grid. 
//If there is a zero, replace with some number
//try out every number from 1-9 and check if the row, column, and square area already has that number
//once it encounters a number that works, move on to the next empty square
//if it gets to an empty square where no number works, go back to the previous square and try the next number that works 
let rows = 9;
let cols = 9;

for (let y = 0; y<rows; y++){
  for (let x = 0; x<cols; x++){
    if (original[y][x] === 0){
      original[y][x] = findNumber(y, x);
    }
  }
}

function findNumber(y, x){
  for (let num = 1; num<=9; num++){
    if (num not in rows && num not in cols && num not in square){
      return num;
    }
  }
  return false; //no possible numbers, backtrack
}

