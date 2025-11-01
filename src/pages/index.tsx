import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/mcp-servers/overview">
            Explore MCP Servers 🚀
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/docs/ai-tools/overview">
            Discover AI Tools 🤖
          </Link>
        </div>
      </div>
    </header>
  );
}

function CategoryCard({title, description, icon, link, count}: {
  title: string;
  description: string;
  icon: string;
  link: string;
  count: number;
}) {
  return (
    <div className={clsx('col col--4', styles.categoryCard)}>
      <div className="card">
        <div className="card__header">
          <h3>{icon} {title}</h3>
          <span className="badge badge--primary">{count} repos</span>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--block" to={link}>
            Explore Category
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className="row">
          <div className="col col--4 text--center">
            <div className={styles.statNumber}>98</div>
            <div className={styles.statLabel}>Total Repositories</div>
          </div>
          <div className="col col--4 text--center">
            <div className={styles.statNumber}>10</div>
            <div className={styles.statLabel}>Categories</div>
          </div>
          <div className="col col--4 text--center">
            <div className={styles.statNumber}>15+</div>
            <div className={styles.statLabel}>Programming Languages</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    {
      title: 'MCP Servers',
      description: 'Model Context Protocol servers for AI integration with external tools',
      icon: '🔌',
      link: '/docs/mcp-servers/overview',
      count: 8
    },
    {
      title: 'AI & ML Tools',
      description: 'Cutting-edge artificial intelligence and machine learning frameworks',
      icon: '🤖',
      link: '/docs/ai-tools/overview',
      count: 12
    },
    {
      title: 'Web Scraping',
      description: 'Tools for automated data extraction and web crawling',
      icon: '🕷️',
      link: '/docs/web-scraping/overview',
      count: 6
    },
    {
      title: 'Development Utilities',
      description: 'Essential development tools and frameworks',
      icon: '🛠️',
      link: '/docs/dev-utils/overview',
      count: 15
    },
    {
      title: 'Security Tools',
      description: 'Security analysis and reverse engineering utilities',
      icon: '🔒',
      link: '/docs/security/overview',
      count: 8
    },
    {
      title: 'Mobile Development',
      description: 'iOS, Android and mobile app development tools',
      icon: '📱',
      link: '/docs/mobile/overview',
      count: 5
    }
  ];

  return (
    <section className={styles.categories}>
      <div className="container">
        <div className="row">
          <div className="col col--12 text--center margin-bottom--lg">
            <Heading as="h2">Repository Categories</Heading>
            <p>Explore repositories organized by technology and purpose</p>
          </div>
        </div>
        <div className="row">
          {categories.map((category, idx) => (
            <CategoryCard key={idx} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedReposSection() {
  const featuredRepos = [
    {
      name: 'unity-mcp',
      description: 'MCP server for Unity Editor integration',
      language: 'C#',
      stars: 0,
      url: 'https://github.com/Alot1z/unity-mcp'
    },
    {
      name: 'anything-llm',
      description: 'All-in-one AI application platform',
      language: 'JavaScript',
      stars: 0,
      url: 'https://github.com/Alot1z/anything-llm'
    },
    {
      name: 'crawl4ai',
      description: 'LLM-friendly web crawler',
      language: 'Python',
      stars: 0,
      url: 'https://github.com/Alot1z/crawl4ai'
    },
    {
      name: 'docusaurus',
      description: 'Easy to maintain documentation websites',
      language: 'TypeScript',
      stars: 0,
      url: 'https://github.com/Alot1z/docusaurus'
    }
  ];

  return (
    <section className={styles.featured}>
      <div className="container">
        <div className="row">
          <div className="col col--12 text--center margin-bottom--lg">
            <Heading as="h2">Featured Repositories</Heading>
            <p>Highlighted repositories from the collection</p>
          </div>
        </div>
        <div className="row">
          {featuredRepos.map((repo, idx) => (
            <div key={idx} className="col col--6 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  <span className={`badge badge--secondary`}>{repo.language}</span>
                </div>
                <div className="card__body">
                  <p>{repo.description}</p>
                </div>
                <div className="card__footer">
                  <Link className="button button--outline button--primary" to={repo.url}>
                    View Repository
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Welcome"
      description="Complete documentation of 98 GitHub repositories organized by categories">
      <HomepageHeader />
      <main>
        <StatsSection />
        <CategoriesSection />
        <FeaturedReposSection />
      </main>
    </Layout>
  );
}
