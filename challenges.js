// All challenges – each belongs to a skill
const challenges = [
  // ---------- BASICS ----------
  { id: "sum-two", skill: "basics", title: "Sum of Two Numbers",
    desc: "Write a function `sum(a, b)` that returns the sum of a and b.",
    starter: "function sum(a, b) {\n  // your code here\n}",
    tests: [
      { input: [2, 3], expected: 5 },
      { input: [-1, 5], expected: 4 },
      { input: [0, 0], expected: 0 }
    ]
  },
  { id: "is-even", skill: "basics", title: "Is Even?",
    desc: "Write a function `isEven(n)` that returns true if n is even, false otherwise.",
    starter: "function isEven(n) {\n  // your code here\n}",
    tests: [
      { input: [4], expected: true },
      { input: [7], expected: false },
      { input: [0], expected: true }
    ]
  },
  { id: "max-of-three", skill: "basics", title: "Maximum of Three",
    desc: "Write a function `maxOfThree(a, b, c)` that returns the largest of the three numbers.",
    starter: "function maxOfThree(a, b, c) {\n  // your code here\n}",
    tests: [
      { input: [1, 5, 3], expected: 5 },
      { input: [-2, -5, -1], expected: -1 },
      { input: [10, 10, 9], expected: 10 }
    ]
  },
  // ---------- STRINGS ----------
  { id: "reverse-string", skill: "strings", title: "Reverse a String",
    desc: "Write a function `reverseString(str)` that returns the reversed string.",
    starter: "function reverseString(str) {\n  // your code here\n}",
    tests: [
      { input: ["hello"], expected: "olleh" },
      { input: ["a"], expected: "a" },
      { input: [""], expected: "" }
    ]
  },
  { id: "palindrome", skill: "strings", title: "Palindrome Check",
    desc: "Write a function `isPalindrome(str)` that returns true if the string reads the same forwards and backwards.",
    starter: "function isPalindrome(str) {\n  // your code here\n}",
    tests: [
      { input: ["racecar"], expected: true },
      { input: ["hello"], expected: false },
      { input: ["A man a plan a canal Panama"], expected: true }
    ]
  },
  { id: "capitalize", skill: "strings", title: "Capitalize First",
    desc: "Write a function `capitalize(str)` that returns the string with the first character uppercase.",
    starter: "function capitalize(str) {\n  // your code here\n}",
    tests: [
      { input: ["hello"], expected: "Hello" },
      { input: ["wORLD"], expected: "WORLD" },
      { input: [""], expected: "" }
    ]
  },
  // ---------- ARRAYS ----------
  { id: "array-max", skill: "arrays", title: "Find Max in Array",
    desc: "Write a function `arrayMax(arr)` that returns the largest number in the array.",
    starter: "function arrayMax(arr) {\n  // your code here\n}",
    tests: [
      { input: [[1, 5, 3, 9, 2]], expected: 9 },
      { input: [[-5, -2, -9]], expected: -2 },
      { input: [[42]], expected: 42 }
    ]
  },
  { id: "array-sum", skill: "arrays", title: "Sum Array",
    desc: "Write a function `arraySum(arr)` that returns the sum of all numbers in the array.",
    starter: "function arraySum(arr) {\n  // your code here\n}",
    tests: [
      { input: [[1, 2, 3, 4]], expected: 10 },
      { input: [[-1, 1]], expected: 0 },
      { input: [[]], expected: 0 }
    ]
  },
  { id: "remove-dups", skill: "arrays", title: "Remove Duplicates",
    desc: "Write a function `removeDuplicates(arr)` that returns a new array with only unique elements (preserve order).",
    starter: "function removeDuplicates(arr) {\n  // your code here\n}",
    tests: [
      { input: [[1, 2, 2, 3, 4, 4]], expected: [1,2,3,4] },
      { input: [[5,5,5]], expected: [5] },
      { input: [[]], expected: [] }
    ]
  },
  // ---------- OBJECTS ----------
  { id: "person-greet", skill: "objects", title: "Object Greeting",
    desc: "Write a function `greet(person)` that returns `'Hello, ' + person.name`.",
    starter: "function greet(person) {\n  // your code here\n}",
    tests: [
      { input: [{ name: "Alice" }], expected: "Hello, Alice" },
      { input: [{ name: "Bob" }], expected: "Hello, Bob" }
    ]
  },
  { id: "obj-values", skill: "objects", title: "Object Values",
    desc: "Write a function `getValues(obj)` that returns an array of the object's values.",
    starter: "function getValues(obj) {\n  // your code here\n}",
    tests: [
      { input: [{ a: 1, b: 2 }], expected: [1, 2] },
      { input: [{}], expected: [] }
    ]
  },
  // ---------- RECURSION ----------
  { id: "factorial", skill: "recursion", title: "Factorial",
    desc: "Write a recursive function `factorial(n)` that returns n! (n >= 0).",
    starter: "function factorial(n) {\n  // your code here\n}",
    tests: [
      { input: [5], expected: 120 },
      { input: [0], expected: 1 },
      { input: [3], expected: 6 }
    ]
  },
  { id: "fibonacci", skill: "recursion", title: "Fibonacci Number",
    desc: "Write a recursive function `fibonacci(n)` that returns the nth Fibonacci number (0-indexed).",
    starter: "function fibonacci(n) {\n  // your code here\n}",
    tests: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [7], expected: 13 }
    ]
  },
  // ---------- ALGORITHMS ----------
  { id: "binary-search", skill: "algorithms", title: "Binary Search",
    desc: "Write binarySearch(sorted, target) and return the target index or -1. The input array is sorted in ascending order.",
    starter: "function binarySearch(sorted, target) {\n  // your code here\n}",
    tests: [
      { input: [[1, 3, 5, 7, 9], 7], expected: 3 },
      { input: [[1, 3, 5, 7, 9], 2], expected: -1 },
      { input: [[], 4], expected: -1 },
      { input: [[5], 5], expected: 0 }
    ]
  },
  { id: "two-sum", skill: "algorithms", title: "Two Sum",
    desc: "Return the first pair of indices [i, j] with i < j whose values sum to target. Return [] if no pair exists.",
    starter: "function twoSum(nums, target) {\n  // your code here\n}",
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[1, 2, 3], 10], expected: [] }
    ]
  },
  { id: "merge-sorted-arrays", skill: "algorithms", title: "Merge Sorted Arrays",
    desc: "Merge two sorted number arrays into one sorted array. Do not mutate either input.",
    starter: "function mergeSortedArrays(a, b) {\n  // your code here\n}",
    tests: [
      { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
      { input: [[], [1, 2]], expected: [1, 2] },
      { input: [[-3, 0], [-2, 4]], expected: [-3, -2, 0, 4] }
    ]
  },
  { id: "valid-parentheses", skill: "algorithms", title: "Valid Parentheses",
    desc: "Return true when every bracket is correctly opened and closed. Support (), [] and {} only.",
    starter: "function validParentheses(text) {\n  // your code here\n}",
    tests: [
      { input: ["()[]{}"], expected: true },
      { input: ["([{}])"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["((("], expected: false },
      { input: [""], expected: true }
    ]
  },
  { id: "longest-unique-substring", skill: "algorithms", title: "Longest Unique Substring",
    desc: "Return the length of the longest substring containing no repeated characters.",
    starter: "function longestUniqueSubstring(text) {\n  // your code here\n}",
    tests: [
      { input: ["abcabcbb"], expected: 3 },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3 },
      { input: [""], expected: 0 }
    ]
  },
  // ---------- GRAPHS ----------
  { id: "breadth-first-search", skill: "graphs", title: "Breadth-First Search Path",
    desc: "Given an adjacency-list object, return the shortest unweighted path from start to target as an array of node names. Return [] when unreachable.",
    starter: "function shortestPath(graph, start, target) {\n  // your code here\n}",
    tests: [
      { input: [{ A: ["B", "C"], B: ["D"], C: ["D"], D: [] }, "A", "D"], expected: ["A", "B", "D"] },
      { input: [{ A: ["B"], B: [], C: [] }, "A", "C"], expected: [] },
      { input: [{ A: [] }, "A", "A"], expected: ["A"] }
    ]
  },
  { id: "connected-components", skill: "graphs", title: "Connected Components",
    desc: "Count connected components in an undirected graph given as an adjacency-list object. Include isolated vertices.",
    starter: "function countComponents(graph) {\n  // your code here\n}",
    tests: [
      { input: [{ A: ["B"], B: ["A"], C: ["D"], D: ["C"], E: [] }], expected: 3 },
      { input: [{ A: ["B"], B: ["A"] }], expected: 1 },
      { input: [{}], expected: 0 }
    ]
  }
];
