import React, { PureComponent } from 'react';
import NDCCountryAccordion from 'components/ndcs-country-accordion';

class Adaptation extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return <NDCCountryAccordion category="adaptation" />;
  }
}

Adaptation.propTypes = {};

Adaptation.defaultProps = {};

export default Adaptation;
