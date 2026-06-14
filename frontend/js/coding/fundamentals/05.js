// Find the position of one string in another

// Write a function that takes two strings
// Return the index of the second string inside the first string

function myFunction(str, search) {

    return str.search(search)
  
}

console.log(myFunction('hello world', 'world')); // 6
console.log(myFunction('javascript', 'script')); // 4
console.log(myFunction('banana', 'na')); // 2