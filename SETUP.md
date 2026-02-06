# AI Labor Research Database - Setup Guide

A static website for curating economics papers on AI's labor market impact, designed to be hosted on GitHub Pages.

## Quick Start

### 1. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository `ai-labor-papers` (or your preferred name)
3. Make it **Public** (required for free GitHub Pages)
4. Click "Create repository"

### 2. Push Code to GitHub

```bash
cd ai-labor-papers
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-labor-papers.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages** (in left sidebar)
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**
6. Wait 1-2 minutes, then visit `https://YOUR-USERNAME.github.io/ai-labor-papers/`

### 4. Update URLs

After deploying, update the placeholder URLs in these files:
- `feed.xml` - Replace `YOUR-USERNAME` with your GitHub username
- `about.html` - Update email address in "Suggest a Paper" section

---

## Adding New Papers

### Option A: Edit JSON Directly on GitHub

1. Go to your repository on GitHub
2. Navigate to `data/papers.json`
3. Click the pencil icon (Edit)
4. Add a new paper entry following this format:

```json
{
  "id": "author-year",
  "title": "Paper Title",
  "authors": ["First Author", "Second Author"],
  "year": 2024,
  "publication": "Journal or Working Paper Series",
  "abstract": "Original abstract from the paper...",
  "summary": "Your curated summary of key findings...",
  "url": "https://link-to-paper.com",
  "pdfUrl": "",
  "tags": ["automation", "wages", "skills"],
  "methodology": "empirical",
  "dateAdded": "2024-02-05",
  "featured": false
}
```

5. Create the matching HTML file in `papers/` folder (copy an existing one and modify)
6. Commit changes

### Option B: Use the Generation Script (Recommended)

If you have Node.js installed:

```bash
# 1. Add your paper to data/papers.json

# 2. Run the generation script
node scripts/generate-pages.js

# 3. Commit and push
git add .
git commit -m "Add: [Paper Title]"
git push
```

The script automatically:
- Generates HTML detail pages for all papers
- Updates the RSS feed

---

## Paper Entry Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | URL-friendly identifier (e.g., "acemoglu-restrepo-2020") |
| `title` | string | Yes | Full paper title |
| `authors` | array | Yes | List of author names |
| `year` | number | Yes | Publication year |
| `publication` | string | Yes | Journal name or "Working Paper" |
| `abstract` | string | Yes | Original abstract |
| `summary` | string | Yes | Your curated summary (1-3 sentences) |
| `url` | string | Yes | Link to paper (journal page or PDF) |
| `pdfUrl` | string | No | Direct link to PDF if available |
| `tags` | array | Yes | Topic keywords (lowercase, hyphenated) |
| `methodology` | string | Yes | "empirical", "theoretical", "survey", or "experimental" |
| `dateAdded` | string | Yes | Date added (YYYY-MM-DD format) |
| `featured` | boolean | No | Highlight on homepage (default: false) |

### Common Tags

Use consistent tags for better filtering:
- `automation`, `robots`, `AI-exposure`
- `employment`, `wages`, `skills`
- `manufacturing`, `services`
- `policy`, `education`, `inequality`
- `machine-learning`, `tasks`, `occupations`

---

## Setting Up Email Subscriptions

The subscribe form needs to be connected to an email service. Options:

### Buttondown (Recommended - Free)

1. Sign up at [buttondown.email](https://buttondown.email)
2. Go to Settings > Embedding
3. Copy the form embed code
4. Replace the form in `subscribe.html`

### Mailchimp

1. Create account at [mailchimp.com](https://mailchimp.com)
2. Create an audience
3. Go to Audience > Signup forms > Embedded forms
4. Copy and paste into `subscribe.html`

---

## Setting Up Paper Discovery Alerts

To get notified about new papers to review:

### Google Scholar Alerts

1. Go to [scholar.google.com](https://scholar.google.com)
2. Search for: `"artificial intelligence" "labor market"`
3. Click "Create alert" at bottom of results
4. Enter your email
5. Repeat for other queries:
   - `automation employment wages`
   - `machine learning jobs`
   - `AI workforce`

### NBER Alerts

1. Go to [nber.org](https://www.nber.org)
2. Subscribe to the "Labor Studies" working paper series
3. Review weekly digest for relevant papers

---

## File Structure

```
ai-labor-papers/
├── index.html          # Homepage with paper list
├── about.html          # About page
├── subscribe.html      # Email subscription page
├── feed.xml            # RSS feed
├── css/
│   └── styles.css      # All styles
├── js/
│   └── app.js          # Search, filter, rendering
├── data/
│   └── papers.json     # Paper database
├── papers/
│   ├── paper-id.html   # Individual paper pages
│   └── ...
└── scripts/
    └── generate-pages.js  # Page generation script
```

---

## Customization

### Changing Colors

Edit the CSS variables at the top of `css/styles.css`:

```css
:root {
  --primary-color: #2563eb;    /* Main accent color */
  --text-color: #1f2937;       /* Body text */
  --bg-secondary: #f9fafb;     /* Section backgrounds */
}
```

### Adding a Custom Domain

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In your repo, create a file called `CNAME` with just your domain:
   ```
   papers.yourdomain.com
   ```
3. Configure DNS with your domain provider to point to GitHub Pages
4. In repo Settings > Pages, add your custom domain

---

## Need Help?

- GitHub Pages docs: https://docs.github.com/en/pages
- Report issues: Open an issue in this repository
