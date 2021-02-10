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


