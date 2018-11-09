import React, { PureComponent } from 'react';
import SectionTitle from 'components/section-title';
import styles from './province-styles.scss';

class Province extends PureComponent {
  render() {
    return (
      <div className={styles.provinceContainer}>
        <div className={styles.provinceImage} />
        <div className={styles.wrapper}>
          <div className={styles.provinceContentContainer}>
            <SectionTitle title="Province module data" />
            <p className={styles.description}>
              34 provinces in Indonesia reflects diverse condition geographically and socioeconomically which lead to different challenges to tackle climate change. Explore individual provinces circumstance and compare this information across provinces to address your question on:
            </p>
            <ul className={styles.list}>
              <li>Which sectors dominate the provincial GHG emissions?</li>
              <li>
                How much progress to mitigating climate change has been made so far?
              </li>
              <li>
                Which province is the most vulnerable and adaptive on climate change?
              </li>
              <li>
                What type of activities are the primary source of province emissions?
              </li>
              <li>What are provinces doing to reduce their emissions?</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default Province;
