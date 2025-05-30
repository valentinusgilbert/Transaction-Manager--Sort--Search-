// Use global transactions data
let displayedTransactions = [...window.transactions];

const ITEMS_PER_PAGE = 10;
let currentPage = 1;

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

// Display transactions in table
function renderTable(data) {
  const table = document.getElementById('transactionTable');
  table.innerHTML = '';
  const header = `<tr><th>ID</th><th>Customer</th><th>Amount</th><th>Date</th><th>Type</th></tr>`;
  table.insertAdjacentHTML('beforeend', header);
  // Pagination logic
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageData = data.slice(startIdx, endIdx);
  pageData.forEach(txn => {
    const row = `<tr><td>${txn.id}</td><td>${txn.customer}</td><td>${txn.amount.toFixed(2)}</td><td>${txn.date}</td><td>${txn.type}</td></tr>`;
    table.insertAdjacentHTML('beforeend', row);
  });
  renderPagination(data.length);
}

function renderPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;
  // Prev button
  pagination.insertAdjacentHTML('beforeend', `<button class="page-btn" onclick="gotoPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`);
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.insertAdjacentHTML('beforeend', `<button class="page-btn${i === currentPage ? ' active' : ''}" onclick="gotoPage(${i})">${i}</button>`);
  }
  // Next button
  pagination.insertAdjacentHTML('beforeend', `<button class="page-btn" onclick="gotoPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`);
}

function gotoPage(page) {
  const totalPages = Math.ceil(displayedTransactions.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(displayedTransactions);
}

// Sort handler
function sortTransactions() {
  const field = document.getElementById('sortField').value;
  const algo = document.getElementById('sortAlgo').value;
  const order = document.getElementById('sortOrder').value;
  
  if (algo === 'bubble') {
    displayedTransactions = window.sortUtils.bubbleSort(displayedTransactions, field);
  } else {
    displayedTransactions = window.sortUtils.mergeSort(displayedTransactions, field);
  }
  
  if (order === 'desc') {
    displayedTransactions.reverse();
  }
  
  currentPage = 1;
  renderTable(displayedTransactions);
  document.getElementById('result').textContent = `Sorted by ${field} (${order === 'asc' ? 'Ascending' : 'Descending'}) using ${algo === 'bubble' ? 'Bubble Sort' : 'Merge Sort'}`;
}

// Search handler
function searchTransactions() {
  const type = document.getElementById('searchType').value;
  const query = document.getElementById('searchQuery').value.trim();
  let result = [];
  
  // If search query is empty, show all transactions
  if (!query) {
    displayedTransactions = [...window.transactions];
    renderTable(displayedTransactions);
    document.getElementById('result').textContent = 'Showing all transactions';
    return;
  }
  
  if (type === 'linear') {
    result = window.searchUtils.linearSearch(displayedTransactions, query);
  } else {
    // For binary search, sort by id first
    displayedTransactions = window.sortUtils.mergeSort(displayedTransactions, 'id');
    renderTable(displayedTransactions);
    result = window.searchUtils.binarySearch(displayedTransactions, query);
  }
  
  currentPage = 1;
  if (result.length > 0) {
    renderTable(result);
    document.getElementById('result').textContent = `${result.length} transaction(s) found.`;
    displayedTransactions = result;
  } else {
    document.getElementById('result').textContent = 'No transactions found.';
    renderTable([]);
    displayedTransactions = [];
  }
}

window.gotoPage = gotoPage;

// Initial render
window.onload = () => {
  renderTable(displayedTransactions);
}; 