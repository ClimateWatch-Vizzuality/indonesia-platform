import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Button } from 'cw-components';
import button from 'styles/themes/button';
import { GLOBAL_CW_PLATFORM } from 'constants/links';
import styles from './cw-disclaimer-styles.scss';

class CwDisclaimer extends PureComponent {
  handleBtnClick = () => {
    window.open(GLOBAL_CW_PLATFORM, '_blank');
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.climateWatch}>
          <span className={styles.bold}>CLIMATE</span>
          WATCH
        </div>
        <div className={styles.description}>
          Improving understanding of the possible policy and development paths that could lead to decarbonization of the economy in different countries by providing 
          high-quality, global data.
        </div>
        <Button
          onClick={this.handleBtnClick}
          theme={{ button: cx(button.primary, styles.button) }}
        >
          Explore the global site
        </Button>
      </div>
    );
  }
}
export default CwDisclaimer;
