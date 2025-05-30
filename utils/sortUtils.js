// Utility: compare function for sorting
function compareBy(field, a, b) {
  if (field === 'amount') return a.amount - b.amount;
  if (field === 'date') return new Date(a.date) - new Date(b.date);
  if (field === 'customer') return a.customer.localeCompare(b.customer);
  if (field === 'id') return a.id.localeCompare(b.id);
  return 0;
}

// Bubble Sort (O(n^2) time, O(1) space)
function bubbleSort(arr, field) {
  let n = arr.length;
  let sorted = [...arr];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (compareBy(field, sorted[j], sorted[j + 1]) > 0) {
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      }
    }
  }
  return sorted;
}

// Merge Sort (O(n log n) time, O(n) space)
function mergeSort(arr, field) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), field);
  const right = mergeSort(arr.slice(mid), field);
  return merge(left, right, field);
}

function merge(left, right, field) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (compareBy(field, left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

window.sortUtils = {
  bubbleSort,
  mergeSort
}; 