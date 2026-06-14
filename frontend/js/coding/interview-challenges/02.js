for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, і * 1000);
}

// Output: 5 5 5 5 5

// Fix

for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, і * 1000);
}

// Output: 1 2 3 4 5