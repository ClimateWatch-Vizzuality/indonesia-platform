import React, { PureComponent } from 'react';
import NDCCountryAccordion from 'components/ndcs-country-accordion';

class Mitigation extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return <NDCCountryAccordion category="mitigation" />;
  }
}

Mitigation.propTypes = {};

Mitigation.defaultProps = {};

export default Mitigation;
