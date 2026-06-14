// Round a number to 2 decimal places

// Write a function that takes a number
// Return the number rounded to 2 decimal places

function myFunction(num) {

    return num.toFixed(2)
  
}

console.log(myFunction(1.2345)); // 1.23
console.log(myFunction(5.6789)); // 5.68
console.log(myFunction(10.555)); // 10.56