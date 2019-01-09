import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'cw-components';
import button from 'styles/themes/button';
import { GLOBAL_CW_PLATFORM } from 'constants/links';
import styles from './cw-disclaimer-styles.scss';

class CwDisclaimer extends PureComponent {
  handleBtnClick = () => {
    window.open(GLOBAL_CW_PLATFORM, '_blank');
  };

  render() {
    const { t } = this.props;
    const disclaimer = t('pages.homepage.climate-watch.disclaimer');
    const buttonText = t('pages.homepage.climate-watch.button');

    return (
      <div className={styles.wrapper}>
        <div className={styles.climateWatch}>
          <span className={styles.bold}>CLIMATE</span>
          WATCH
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: disclaimer }}
        />
        <Button
          onClick={this.handleBtnClick}
          theme={{ button: cx(button.primary, styles.button) }}
        >
          <span dangerouslySetInnerHTML={{ __html: buttonText }} />
        </Button>
      </div>
    );
  }
}

CwDisclaimer.propTypes = { t: PropTypes.func.isRequired };

export default CwDisclaimer;
