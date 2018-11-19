import React, { PureComponent } from 'react';
import cx from 'classnames';
import Proptypes from 'prop-types';
import { Button } from 'cw-components';
import button from 'styles/themes/button';
import { GLOBAL_CW_PLATFORM } from 'constants/links';
import styles from './cw-disclaimer-styles.scss';

class CwDisclaimer extends PureComponent {
  handleBtnClick = () => {
    window.open(GLOBAL_CW_PLATFORM, '_blank');
  };

  render() {
    const { description, buttonTitle } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.climateWatch}>
          <span className={styles.bold}>CLIMATE</span>
          WATCH
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <Button
          onClick={this.handleBtnClick}
          theme={{ button: cx(button.primary, styles.button) }}
        >
          <span dangerouslySetInnerHTML={{ __html: buttonTitle }} />
        </Button>
      </div>
    );
  }
}

CwDisclaimer.propTypes = {
  description: Proptypes.string.isRequired,
  buttonTitle: Proptypes.string.isRequired
};

export default CwDisclaimer;
