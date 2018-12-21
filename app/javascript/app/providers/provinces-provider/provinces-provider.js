import React, { PureComponent } from 'react';

import LocationsProvider from 'providers/locations-provider';

const PROVINCE_TYPE = 'PROVINCE';

class Provinces extends PureComponent {
  render() {
    return <LocationsProvider params={{ location_type: PROVINCE_TYPE }} />;
  }
}

export default Provinces;
