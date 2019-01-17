import React, { PureComponent } from 'react';
import NDCCountryAccordion from 'components/ndcs-country-accordion';

class Sectoral extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return <NDCCountryAccordion category="sectoral-information" />;
  }
}

Sectoral.propTypes = {};

Sectoral.defaultProps = {};

export default Sectoral;
