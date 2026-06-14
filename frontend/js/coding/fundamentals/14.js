// Split a number into its digits

// Write a function that takes a number
// Return an array of its digits

function myFunction(num) {

    return num.toString().split('')
  
}

console.log(myFunction(1234)); // [1, 2, 3, 4]
console.log(myFunction(908)); // [9, 0, 8]
console.log(myFunction(55)); // [5, 5]