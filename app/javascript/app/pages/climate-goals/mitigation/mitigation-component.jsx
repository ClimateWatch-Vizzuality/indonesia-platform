import React, { PureComponent } from 'react';
import NDCCountryAccordion from 'components/ndcs-country-accordion';

// eslint-disable-next-line react/prefer-stateless-function
class Mitigation extends PureComponent {
  render() {
    return <NDCCountryAccordion category="mitigation" />;
  }
}

Mitigation.propTypes = {};

Mitigation.defaultProps = {};

export default Mitigation;
