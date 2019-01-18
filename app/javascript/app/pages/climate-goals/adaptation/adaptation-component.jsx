import React, { PureComponent } from 'react';
import NDCCountryAccordion from 'components/ndcs-country-accordion';

// eslint-disable-next-line react/prefer-stateless-function
class Adaptation extends PureComponent {
  render() {
    return <NDCCountryAccordion category="adaptation" />;
  }
}

Adaptation.propTypes = {};

Adaptation.defaultProps = {};

export default Adaptation;
