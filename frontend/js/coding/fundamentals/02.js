// Remove first n characters of string

// Write a function that takes a string and a number
// Remove the first n characters from the string
// Return the result

function myFunction(str, n) {

    return str.split('').splice(n).join('')
  
}

console.log(myFunction('abcdef', 2)); // 'cdef'
console.log(myFunction('hello world', 6)); // 'world'
console.log(myFunction('javascript', 4)); // 'script'