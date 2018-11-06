import React from 'react';
import { Section } from 'cw-components';
import background from 'assets/hero';
// import Cards from 'components/home/cards';
import styles from './home-styles.scss';

function Home() {
  return (
    <div className={styles.page}>
      <Section backgroundImage={background} theme={styles}>
        <div className="layout-container">
          <div className={styles.introTextContainer}>
            <h1 className={styles.pageTitle}>
              <div className={styles.country}>
                Indonesia
              </div>
              <div className={styles.climateExplorer}>
                <span className={styles.bold}>CLIMATE </span>
                EXPLORER
              </div>
            </h1>
            <p className={styles.introText}>
              Inonesia Climate Explorer offers open data, visualizations and analysis to help policymakers, researchers and other stakeholders gather insights on Inonesia’s climate progress.
            </p>
          </div>
        </div>
        <div className="layout-container">
          {}
        </div>
      </Section>
    </div>
  );
}
export default Home;
