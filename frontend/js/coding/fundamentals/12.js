// Check if a number is a whole number

// Write a function that takes a number
// Return true if it is a whole number
// Otherwise return false

function myFunction(num) {
  return Number.isInteger(num)
}

console.log(myFunction(5)); // true
console.log(myFunction(5.5)); // false
console.log(myFunction(-2)); // true
