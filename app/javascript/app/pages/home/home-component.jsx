import React from 'react';
import { Section } from 'cw-components';
import background from 'assets/hero';
// import Cards from 'components/home/cards';
import Province from 'components/province';
import CwDisclaimer from 'components/cw-disclaimer';
import HighlightedStories from 'components/stories';
import SectionsSlideshow from './sections-slideshow';
import styles from './home-styles.scss';

function Home() {
  return (
    <div className={styles.page}>
      <Section backgroundImage={background} theme={styles}>
        <div className="layout-container">
          <div className={styles.introTextContainer}>
            <h1 className={styles.pageTitle}>
              <div className={styles.country}>
                INDONESIA
              </div>
              <div className={styles.climateExplorer}>
                <span className={styles.bold}>CLIMATE </span>
                EXPLORER
              </div>
            </h1>
            <p className={styles.introText}>
              Indonesia Climate Explorer offers open data, visualizations and analysis to help policymakers, researchers and other stakeholders gather insights on Inonesia’s climate progress.
            </p>
          </div>
        </div>
        <div className="layout-container">
          {}
        </div>
      </Section>
      <SectionsSlideshow />
      <Province />
      <CwDisclaimer />
      <HighlightedStories />
    </div>
  );
}
export default Home;
