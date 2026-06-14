var b = 1;
function outer() {
  var b = 2;
  function inner() {
    console.log(b)
    b++;
    console.log(b)
    var b = 3;
    console.log(b);
  }
  inner();
}
outer();

// Output: undefined NaN 3