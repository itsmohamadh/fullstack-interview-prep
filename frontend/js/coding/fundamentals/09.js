// Check whether a string contains another string and concatenate

// Write a function that takes two strings
// If the first string contains the second string, return the first string
// Otherwise concatenate both strings

function myFunction(a, b) {

    return a.includes(b) ? a :a+b 
  
}

console.log(myFunction('hello world', 'world')); // 'hello world'
console.log(myFunction('javascript', 'react')); // 'javascriptreact'
console.log(myFunction('banana', 'na')); // 'banana'