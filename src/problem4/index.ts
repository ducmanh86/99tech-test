function sumToN1(n: number) {
  // loop version: loops from 1 to n and adds them up
  // The time complexity is O(n)
  // The memory complexity is O(1)
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sumToN2(n: number) {
  // recursive version: calls itself to add numbers from n down to 1
  // The time complexity is O(n)
  // The memory complexity is O(n) due to call stack
  if (n === 1) {
    return 1;
  }
  return n + sumToN2(n - 1);
}

function sumToN3(n: number) {
  // formula version: uses the mathematical formula n * (n + 1) / 2
  // The time complexity is O(1)
  // The memory complexity is O(1)
  return (n * (n + 1)) / 2;
}

console.log(sumToN1(10)); // 55
console.log(sumToN2(10)); // 55
console.log(sumToN3(10)); // 55

console.log(sumToN1(100)); // 5050
console.log(sumToN2(100)); // 5050
console.log(sumToN3(100)); // 5050
