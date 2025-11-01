/**
 * Creating a sidebar enables you to:
  - create an ordered group of docs
  - render a sidebar for each doc of that group
  - provide next/previous navigation

  The sidebars can be generated from the filesystem, or explicitly defined here.

  Create as many sidebars as you want.
  */
const sidebars = {
  tutorialSidebar: [
    'intro',
    'repositories',
    'categories',
    {
      type: 'category',
      label: 'Repository Categories',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '🚀 MCP Servers',
          collapsible: true,
          collapsed: false,
          items: [
            'mcp-servers/overview',
          ],
        },
        {
          type: 'category',
          label: '🤖 AI & Machine Learning Tools',
          collapsible: true,
          collapsed: false,
          items: [
            'ai-tools/overview',
          ],
        },
        {
          type: 'category',
          label: '🕷️ Web Scraping & Automation',
          collapsible: true,
          collapsed: false,
          items: [
            'web-scraping/overview',
          ],
        },
        {
          type: 'category',
          label: '🛠️ Development Tools',
          collapsible: true,
          collapsed: false,
          items: [
            'dev-tools/overview',
          ],
        },
        {
          type: 'category',
          label: '🔒 Security Tools',
          collapsible: true,
          collapsed: false,
          items: [
            'security/overview',
          ],
        },
        {
          type: 'category',
          label: '📱 Mobile & System Tools',
          collapsible: true,
          collapsed: false,
          items: [
            'mobile-system/overview',
          ],
        },
      ],
    },
    'about',
  ],
};

module.exports = sidebars;
