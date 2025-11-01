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
          label: 'Home',
        },
        {
          to: '/repositories',
          label: 'Repositories',
          position: 'left',
        },
        {
          to: '/categories',
          label: 'Categories',
          position: 'left',
        },
        {
          to: '/search',
          label: 'Search',
          position: 'left',
        },
        {
          href: 'https://github.com/Alot1z',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: '/about',
          label: 'About',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Navigation',
          items: [
            {
              label: 'All Repositories',
              to: '/repositories',
            },
            {
              label: 'Categories',
              to: '/categories',
            },
            {
              label: 'Search',
              to: '/search',
            },
            {
              label: 'About',
              to: '/about',
            },
          ],
        },
        {
          title: 'External Links',
          items: [
            {
              label: 'GitHub Profile',
              href: 'https://github.com/Alot1z',
            },
            {
              label: 'Live Site',
              href: 'https://Alot1z.github.io',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alot1z Repository Wiki. Built with ❤️ using Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
