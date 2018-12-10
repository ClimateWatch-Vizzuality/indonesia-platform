import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import IndicatorsProvider from 'providers/indicators-provider';
// import styles from './socioeconomic-styles.scss';
import Population from './population';
import Economy from './economy';
import Energy from './energy';

class Socioeconomic extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Population />
        <Economy />
        <Energy />
        <IndicatorsProvider />
      </React.Fragment>
    );
  }
}

Socioeconomic.propTypes = {};

Socioeconomic.defaultProps = {};

export default Socioeconomic;
