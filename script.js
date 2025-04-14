const form = document.getElementById('bookmark-form');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const categoryInput = document.getElementById('category');
const bookmarkList = document.getElementById('bookmark-list');
const filterCategory = document.getElementById('filter-category');
const searchInput = document.getElementById('search');

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

function saveToLocalStorage() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function validateURL(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

function renderBookmarks() {
  const categoryFilter = filterCategory.value;
  const searchQuery = searchInput.value.toLowerCase();

  bookmarkList.innerHTML = '';

  bookmarks
    .filter(b => 
      (categoryFilter === 'All' || b.category === categoryFilter) &&
      (b.title.toLowerCase().includes(searchQuery) || b.url.toLowerCase().includes(searchQuery))
    )
    .map((bookmark, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${bookmark.title}</strong> 
          (<a href="${bookmark.url}" target="_blank">Visit</a>) - 
          <em>${bookmark.category}</em>
        </div>
        <button onclick="deleteBookmark(${index})">Delete</button>
      `;
      bookmarkList.appendChild(li);
    });
}

function deleteBookmark(index) {
  bookmarks = bookmarks.filter((_, i) => i !== index);
  saveToLocalStorage();
  renderBookmarks();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();
  const category = categoryInput.value;

  if (!validateURL(url)) {
    alert('Please enter a valid URL starting with http:// or https://');
    return;
  }

  bookmarks.push({ title, url, category });
  saveToLocalStorage();
  renderBookmarks();

  // Clear form
  titleInput.value = '';
  urlInput.value = '';
});

filterCategory.addEventListener('change', renderBookmarks);
searchInput.addEventListener('input', renderBookmarks);

// Initial render
renderBookmarks();
