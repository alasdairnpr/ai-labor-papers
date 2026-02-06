/**
 * Generate Paper Detail Pages
 *
 * This script reads papers.json and generates individual HTML pages
 * for each paper in the /papers directory.
 *
 * Usage: node scripts/generate-pages.js
 *
 * Run this script after adding new papers to papers.json
 */

const fs = require('fs');
const path = require('path');

// Paths
const dataPath = path.join(__dirname, '..', 'data', 'papers.json');
const papersDir = path.join(__dirname, '..', 'papers');
const feedPath = path.join(__dirname, '..', 'feed.xml');

// Load papers
const papers = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Ensure papers directory exists
if (!fs.existsSync(papersDir)) {
  fs.mkdirSync(papersDir, { recursive: true });
}

// HTML template for paper detail pages
function generatePaperHTML(paper) {
  const authorsText = paper.authors.join(', ');
  const tagsHTML = paper.tags
    .map(tag => `<span class="tag">${tag.replace(/-/g, ' ')}</span>`)
    .join('\n          ');

  const pdfButton = paper.pdfUrl
    ? `<a href="${escapeHtml(paper.pdfUrl)}" target="_blank" rel="noopener" class="btn btn-outline">Download PDF</a>`
    : '';

  const dateAdded = new Date(paper.dateAdded).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate citation
  const authorsCitation = paper.authors.length === 1
    ? paper.authors[0]
    : paper.authors.length === 2
      ? `${paper.authors[0]} & ${paper.authors[1]}`
      : `${paper.authors[0]} et al.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(paper.title)} - AI Labor Research</title>
  <meta name="description" content="${escapeHtml(paper.summary.substring(0, 160))}">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <header>
    <div class="container">
      <a href="../index.html" class="logo">AI Labor Research</a>
      <nav>
        <a href="../index.html">Papers</a>
        <a href="../about.html">About</a>
        <a href="../subscribe.html">Subscribe</a>
      </nav>
    </div>
  </header>

  <main class="paper-detail">
    <div class="container">
      <a href="../index.html" class="back-link">← Back to all papers</a>

      <div class="paper-detail-header">
        <h1 class="paper-detail-title">${escapeHtml(paper.title)}</h1>
        <div class="paper-detail-meta">
          <span>${escapeHtml(authorsText)}</span>
          <span>•</span>
          <span>${paper.year}</span>
          <span>•</span>
          <span>${escapeHtml(paper.publication)}</span>
        </div>
        <div class="paper-tags">
          ${tagsHTML}
          <span class="tag" style="background-color: #f0fdf4; color: #166534;">${paper.methodology}</span>
        </div>
      </div>

      <div class="paper-detail-content">
        <div class="paper-detail-main">
          <section>
            <h2>Summary</h2>
            <p>${escapeHtml(paper.summary)}</p>
          </section>

          <section>
            <h2>Abstract</h2>
            <p>${escapeHtml(paper.abstract)}</p>
          </section>
        </div>

        <div class="paper-detail-sidebar">
          <h3>Access Paper</h3>
          <a href="${escapeHtml(paper.url)}" target="_blank" rel="noopener" class="btn">View Original →</a>
          ${pdfButton}

          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            <h3>Cite This Paper</h3>
            <p style="font-size: 0.875rem; color: var(--text-light);">
              ${escapeHtml(authorsCitation)} (${paper.year}). ${escapeHtml(paper.title)}. <em>${escapeHtml(paper.publication)}</em>.
            </p>
          </div>

          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            <h3>Added to Database</h3>
            <p style="font-size: 0.875rem; color: var(--text-light);">${dateAdded}</p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2024 AI Labor Research Database. Built for researchers and policymakers.</p>
    </div>
  </footer>
</body>
</html>`;
}

// Generate RSS feed
function generateRSSFeed(papers) {
  const sortedPapers = [...papers].sort((a, b) =>
    new Date(b.dateAdded) - new Date(a.dateAdded)
  );

  const items = sortedPapers.slice(0, 20).map(paper => {
    const pubDate = new Date(paper.dateAdded).toUTCString();
    return `    <item>
      <title>${escapeXml(paper.title)}</title>
      <link>https://YOUR-USERNAME.github.io/ai-labor-papers/papers/${paper.id}.html</link>
      <description>${escapeXml(paper.summary)}</description>
      <author>${escapeXml(paper.authors.join(', '))}</author>
      <pubDate>${pubDate}</pubDate>
      <guid>https://YOUR-USERNAME.github.io/ai-labor-papers/papers/${paper.id}.html</guid>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI &amp; Labor Market Research Database</title>
    <link>https://YOUR-USERNAME.github.io/ai-labor-papers/</link>
    <description>A curated collection of economics papers on the labor market impact of AI and automation.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://YOUR-USERNAME.github.io/ai-labor-papers/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

// Utility: Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Utility: Escape XML (for RSS)
function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate all pages
console.log('Generating paper pages...\n');

papers.forEach(paper => {
  const html = generatePaperHTML(paper);
  const filePath = path.join(papersDir, `${paper.id}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`  ✓ ${paper.id}.html`);
});

// Generate RSS feed
console.log('\nGenerating RSS feed...');
const rssFeed = generateRSSFeed(papers);
fs.writeFileSync(feedPath, rssFeed);
console.log('  ✓ feed.xml');

console.log(`\n✅ Done! Generated ${papers.length} paper pages and RSS feed.`);
console.log('\nNote: Update the URLs in feed.xml with your actual GitHub Pages URL.');
