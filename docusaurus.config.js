// @ts-check
const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Alot1z GitHub Repository Wiki',
  tagline: 'Complete documentation for 98 starred GitHub repositories',
  favicon: 'img/favicon.ico',
  url: 'https://Alot1z.github.io',
  baseUrl: '/',
  organizationName: 'Alot1z',
  projectName: 'Alot1z.github.io',
  deploymentBranch: 'main',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Alot1z/Alot1z.github.io/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Alot1z Repo Wiki',
      logo: {
        alt: 'Alot1z Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/Alot1z',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Repository',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Alot1z',
            },
            {
              label: 'Starred Repos',
              href: 'https://github.com/Alot1z?tab=repositories&type=star',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/users/Alot1z',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/Alot1z',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Alot1z/Alot1z.github.io',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alot1z Repository Wiki.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
