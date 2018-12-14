import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IndicatorsProvider from 'providers/indicators-provider';
// import styles from './socioeconomic-styles.scss';
import Population from './population';
import Economy from './economy';
import Energy from './energy';

class Socioeconomic extends PureComponent {
  render() {
    const { locale } = this.props;

    return (
      <React.Fragment>
        <Population />
        <Economy />
        <Energy />
        <IndicatorsProvider params={{ locale }} />
      </React.Fragment>
    );
  }
}

Socioeconomic.propTypes = { locale: PropTypes.string.isRequired };

Socioeconomic.defaultProps = {};

export default Socioeconomic;
