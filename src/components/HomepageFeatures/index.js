import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '🔍 Smart Discovery',
    description: (
      <>
        Discover amazing open-source projects with our intelligent categorization and quality scoring system.
      </>
    ),
  },
  {
    title: '⚡ Lightning Fast',
    description: (
      <>
        Built with Docusaurus for optimal performance and instant navigation between repositories.
      </>
    ),
  },
  {
    title: '🔄 Always Up-to-Date',
    description: (
      <>
        Automatically synchronized with your GitHub starred repositories for the latest project information.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <div className={styles.featureIcon}>
          <span style={{fontSize: '3rem', marginBottom: '1rem', display: 'block'}}>
            {title.split(' ')[0]}
          </span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
