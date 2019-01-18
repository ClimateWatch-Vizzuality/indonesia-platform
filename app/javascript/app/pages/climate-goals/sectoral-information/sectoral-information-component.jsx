import React, { PureComponent } from 'react';
import NDCCountryAccordion from 'components/ndcs-country-accordion';

// eslint-disable-next-line react/prefer-stateless-function
class Sectoral extends PureComponent {
  render() {
    return <NDCCountryAccordion category="sectoral_information" />;
  }
}

Sectoral.propTypes = {};

Sectoral.defaultProps = {};

export default Sectoral;
