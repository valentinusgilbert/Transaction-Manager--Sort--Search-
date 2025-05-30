// Linear Search (O(n) time)
function linearSearch(arr, query) {
  query = query.toLowerCase();
  return arr.filter(txn => txn.customer.toLowerCase().includes(query));
}

// Binary Search (O(log n) time)
function binarySearch(arr, id) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid].id === id) return [arr[mid]];
    if (arr[mid].id < id) left = mid + 1;
    else right = mid - 1;
  }
  return [];
}

window.searchUtils = {
  linearSearch,
  binarySearch
}; 