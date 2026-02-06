// Global state
let papers = [];
let filteredPapers = [];

// DOM Elements
const paperList = document.getElementById('paperList');
const searchInput = document.getElementById('searchInput');
const yearFilter = document.getElementById('yearFilter');
const methodologyFilter = document.getElementById('methodologyFilter');
const tagFilter = document.getElementById('tagFilter');
const resultsInfo = document.getElementById('resultsInfo');
const emptyState = document.getElementById('emptyState');
const subscribeForm = document.getElementById('subscribeForm');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadPapers();
  setupEventListeners();
});

// Load papers from JSON file
async function loadPapers() {
  try {
    const response = await fetch('data/papers.json');
    papers = await response.json();

    // Sort by date added (newest first)
    papers.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    filteredPapers = [...papers];

    populateFilters();
    renderPapers();
  } catch (error) {
    console.error('Error loading papers:', error);
    paperList.innerHTML = '<p class="loading">Error loading papers. Please refresh the page.</p>';
  }
}

// Populate filter dropdowns based on paper data
function populateFilters() {
  // Get unique years
  const years = [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });

  // Get unique tags
  const tags = [...new Set(papers.flatMap(p => p.tags))].sort();
  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = formatTag(tag);
    tagFilter.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  searchInput.addEventListener('input', debounce(filterPapers, 300));
  yearFilter.addEventListener('change', filterPapers);
  methodologyFilter.addEventListener('change', filterPapers);
  tagFilter.addEventListener('change', filterPapers);

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleSubscribe);
  }
}

// Filter papers based on search and filters
function filterPapers() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedYear = yearFilter.value;
  const selectedMethodology = methodologyFilter.value;
  const selectedTag = tagFilter.value;

  filteredPapers = papers.filter(paper => {
    // Search filter
    const matchesSearch = !searchTerm ||
      paper.title.toLowerCase().includes(searchTerm) ||
      paper.authors.some(a => a.toLowerCase().includes(searchTerm)) ||
      paper.summary.toLowerCase().includes(searchTerm) ||
      paper.abstract.toLowerCase().includes(searchTerm) ||
      paper.tags.some(t => t.toLowerCase().includes(searchTerm));

    // Year filter
    const matchesYear = !selectedYear || paper.year.toString() === selectedYear;

    // Methodology filter
    const matchesMethodology = !selectedMethodology || paper.methodology === selectedMethodology;

    // Tag filter
    const matchesTag = !selectedTag || paper.tags.includes(selectedTag);

    return matchesSearch && matchesYear && matchesMethodology && matchesTag;
  });

  renderPapers();
}

// Render papers to the DOM
function renderPapers() {
  // Update results info
  const total = papers.length;
  const showing = filteredPapers.length;

  if (showing === total) {
    resultsInfo.textContent = `Showing all ${total} papers`;
  } else {
    resultsInfo.textContent = `Showing ${showing} of ${total} papers`;
  }

  // Show empty state if no results
  if (filteredPapers.length === 0) {
    paperList.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  paperList.style.display = 'flex';
  emptyState.style.display = 'none';

  // Render paper cards
  paperList.innerHTML = filteredPapers.map(paper => `
    <article class="paper-card ${paper.featured ? 'featured' : ''}">
      <div class="paper-header">
        <h2 class="paper-title">
          <a href="papers/${paper.id}.html">${escapeHtml(paper.title)}</a>
        </h2>
        <span class="paper-year">${paper.year}</span>
      </div>
      <p class="paper-authors">${paper.authors.join(', ')}</p>
      <p class="paper-publication">${escapeHtml(paper.publication)}</p>
      <p class="paper-summary">${escapeHtml(paper.summary)}</p>
      <div class="paper-tags">
        ${paper.tags.map(tag => `<span class="tag">${formatTag(tag)}</span>`).join('')}
        <span class="tag" style="background-color: #f0fdf4; color: #166534;">${paper.methodology}</span>
      </div>
      <div class="paper-links">
        <a href="papers/${paper.id}.html" class="paper-link">View Details →</a>
        ${paper.url ? `<a href="${escapeHtml(paper.url)}" target="_blank" rel="noopener" class="paper-link">Original Source ↗</a>` : ''}
      </div>
    </article>
  `).join('');
}

// Handle subscribe form submission
function handleSubscribe(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  // For GitHub Pages, you would integrate with a service like:
  // - Buttondown (https://buttondown.email)
  // - Mailchimp
  // - ConvertKit
  //
  // For now, show a success message
  alert(`Thanks for subscribing! (Note: Email integration needs to be configured with a service like Buttondown or Mailchimp)`);
  e.target.reset();
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Format tag for display
function formatTag(tag) {
  return tag.replace(/-/g, ' ');
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
