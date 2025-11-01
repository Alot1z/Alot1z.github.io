/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // But if you want a different sidebar, you can create it on the fly
  tutorialSidebar: [
    'intro',
    'repositories',
    'categories',
    'search',
    'recommendations',
    'about',
    
    {
      type: 'category',
      label: '🤖 MCP Servers',
      items: [
        'mcp-servers/overview',
      ],
    },
    
    {
      type: 'category',
      label: '🧠 AI & Machine Learning',
      items: [
        'ai-tools/overview',
      ],
    },
    
    {
      type: 'category',
      label: '🕷️ Web Scraping',
      items: [
        'web-scraping/overview',
      ],
    },
    
    {
      type: 'category',
      label: '🛠️ Development Tools',
      items: [
        'dev-tools/overview',
      ],
    },
    
    {
      type: 'category',
      label: '🔒 Security Tools',
      items: [
        'security/overview',
      ],
    },
    
    {
      type: 'category',
      label: '📱 Mobile & System',
      items: [
        'mobile-system/overview',
      ],
    },
  ],
};

module.exports = sidebars;