// Clear up the chaos behind these strings

// Write a function that takes a string
// Remove all spaces from the string
// Return the cleaned string

function myFunction(str) {

    return str.replaceAll(' ',"")
  
}

console.log(myFunction(' h e l l o ')); // 'hello'
console.log(myFunction(' j a v a s c r i p t ')); // 'javascript'
console.log(myFunction(' c h a t g p t ')); // 'chatgpt'