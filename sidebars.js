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
    {
      type: 'category',
      label: 'Repository Categories',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'MCP (Model Context Protocol) Servers',
          collapsible: true,
          collapsed: false,
          items: [
            'mcp-servers/overview',
          ],
        },
        {
          type: 'category',
          label: 'AI & Machine Learning Tools',
          collapsible: true,
          collapsed: false,
          items: [
            'ai-tools/overview',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
