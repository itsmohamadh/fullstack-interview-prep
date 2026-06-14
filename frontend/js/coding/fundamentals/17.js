// Find next higher natural number that is divisible by y

// Write a function that takes two numbers
// Return the next higher number greater than x that is divisible by y

function myFunction(x, y) {
  return x % y === 0 ? x + y : x + (x % y);
}

console.log(myFunction(10, 3)); // 12
console.log(myFunction(20, 5)); // 25
console.log(myFunction(7, 2)); // 8
