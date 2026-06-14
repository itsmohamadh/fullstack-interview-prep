// Get intersection of two JavaScript Sets

// Write a function that takes two Sets
// Return a new Set containing only shared values

function myFunction(set1, set2) {
  
}

console.log(
  myFunction(
    new Set([1, 2, 3]),
    new Set([2, 3, 4])
  )
); // Set(2) {2, 3}

console.log(
  myFunction(
    new Set(['a', 'b']),
    new Set(['b', 'c'])
  )
); // Set(1) {'b'}