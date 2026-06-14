// Get first n characters of string

// Write a function that takes a string and a number
// Return the first n characters

function myFunction(str, n) {

    return str.split('').splice(0,n).join('')
  
}

console.log(myFunction('abcdef', 3)); // 'abc'
console.log(myFunction('hello', 2)); // 'he'
console.log(myFunction('javascript', 4)); // 'java'