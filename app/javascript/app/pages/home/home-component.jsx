import React, { PureComponent } from 'react';
import { Section } from 'cw-components';
import background from 'assets/hero';
import Proptypes from 'prop-types';
import Province from 'components/province';
import CwDisclaimer from 'components/cw-disclaimer';
import HighlightedStories from 'components/stories';
import SectionsSlideshow from './sections-slideshow';
import styles from './home-styles.scss';

class Home extends PureComponent {
  render() {
    const { introText } = this.props;
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
              <p
                className={styles.introText}
                dangerouslySetInnerHTML={{ __html: introText }}
              />
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
}

Home.propTypes = { introText: Proptypes.string.isRequired };

export default Home;
