// Get last n characters of string

// Write a function that takes a string and a number
// Return the last n characters

function myFunction(str, n) {

    return str.split('').splice(-n).join('')
  
}

console.log(myFunction('abcdef', 2)); // 'ef'
console.log(myFunction('hello', 3)); // 'llo'
console.log(myFunction('javascript', 6)); // 'script'