import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import ClimatePlansProvider from 'providers/climate-plans-provider';
import styles from './regions-ghg-emissions-styles.scss';

class RegionsGhgEmissions extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <p className={styles.text}>The RegionsGhgEmissions section</p>
        <ClimatePlansProvider />
      </React.Fragment>
    );
  }
}

RegionsGhgEmissions.propTypes = {};

RegionsGhgEmissions.defaultProps = {};

export default RegionsGhgEmissions;
