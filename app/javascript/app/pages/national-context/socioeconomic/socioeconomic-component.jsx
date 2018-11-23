import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import IndicatorsProvider from 'providers/indicators-provider';
// import styles from './socioeconomic-styles.scss';
import Population from './population';

class Socioeconomic extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Population />
        <IndicatorsProvider />
      </React.Fragment>
    );
  }
}

Socioeconomic.propTypes = {};

Socioeconomic.defaultProps = {};

export default Socioeconomic;
