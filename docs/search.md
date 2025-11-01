---
slug: /search
title: Search
---

import Link from '@docusaurus/Link';

# Search Repositories

Find the perfect repository for your next project using our advanced search capabilities.

## 🔍 Search Options

### Quick Search
<div className="card">
  <div className="card__body">
    <input
      type="text"
      placeholder="Search 98 repositories..."
      style={{
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        border: '2px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}
    />
    <div className="row">
      <div className="col col--6">
        <select style={{width: '100%', padding: '12px', marginBottom: '1rem'}}>
          <option value="">All Languages</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="csharp">C#</option>
          <option value="java">Java</option>
        </select>
      </div>
      <div className="col col--6">
        <select style={{width: '100%', padding: '12px', marginBottom: '1rem'}}>
          <option value="">All Categories</option>
          <option value="mcp-servers">🚀 MCP Servers</option>
          <option value="ai-tools">🤖 AI & ML Tools</option>
          <option value="web-scraping">🕷️ Web Scraping</option>
          <option value="dev-tools">🛠️ Development Tools</option>
          <option value="security">🔒 Security Tools</option>
          <option value="mobile-system">📱 Mobile & System</option>
        </select>
      </div>
    </div>
    <button className="button button--primary button--lg" style={{width: '100%'}}>
      Search Repositories
    </button>
  </div>
</div>

## 📋 Browse by Tags

<div className="row">
  <div className="col col--3">
    <div className="card">
      <div className="card__body text--center">
        <h4>🤖 AI/ML</h4>
        <p>23 repositories</p>
        <Link to="/category/ai-tools" className="button button--outline button--primary button--sm">
          Browse AI Tools
        </Link>
      </div>
    </div>
  </div>
  <div className="col col--3">
    <div className="card">
      <div className="card__body text--center">
        <h4>🔧 Dev Tools</h4>
        <p>18 repositories</p>
        <Link to="/category/dev-tools" className="button button--outline button--primary button--sm">
          Browse Dev Tools
        </Link>
      </div>
    </div>
  </div>
  <div className="col col--3">
    <div className="card">
      <div className="card__body text--center">
        <h4>🚀 MCP</h4>
        <p>15 repositories</p>
        <Link to="/category/mcp-servers" className="button button--outline button--primary button--sm">
          Browse MCP Servers
        </Link>
      </div>
    </div>
  </div>
  <div className="col col--3">
    <div className="card">
      <div className="card__body text--center">
        <h4>🔒 Security</h4>
        <p>15 repositories</p>
        <Link to="/category/security" className="button button--outline button--primary button--sm">
          Browse Security Tools
        </Link>
      </div>
    </div>
  </div>
</div>

## 🎯 Popular Searches

<div className="row margin-top--lg">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h4>🔥 Trending Repositories</h4>
      </div>
      <div className="card__body">
        <ul>
          <li><Link to="/repository/anything-llm">AnythingLLM</Link> - Full-stack LLM platform</li>
          <li><Link to="/repository/deepseek-ocr">DeepSeek OCR</Link> - Advanced OCR</li>
          <li><Link to="/repository/unity-mcp">Unity MCP</Link> - Unity AI integration</li>
          <li><Link to="/repository/uv">UV</Link> - Python package manager</li>
          <li><Link to="/repository/ruff">Ruff</Link> - Python linter</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h4>📚 Popular Languages</h4>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Python</strong> - 35 repositories</li>
          <li><strong>JavaScript</strong> - 22 repositories</li>
          <li><strong>TypeScript</strong> - 18 repositories</li>
          <li><strong>Rust</strong> - 12 repositories</li>
          <li><strong>Go</strong> - 8 repositories</li>
          <li><strong>C#</strong> - 6 repositories</li>
        </ul>
      </div>
    </div>
  </div>
</div>

---

## 💡 Search Tips

- Use specific keywords like "ocr", "automation", or "security"
- Filter by programming language to find tools in your preferred stack
- Browse categories to discover repositories by use case
- Check quality scores (1-10) to find the most reliable projects

<div className="text--center margin-top--xl">
  <p>
    <strong>Can't find what you're looking for?</strong> <Link to="/categories">Browse all categories</Link> or <Link to="/repositories">view all repositories</Link>.
  </p>
</div>
