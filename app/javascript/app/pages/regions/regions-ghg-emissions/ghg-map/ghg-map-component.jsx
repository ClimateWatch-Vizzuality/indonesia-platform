import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Map from 'components/map';
import MapChoroplethLegend from 'components/map-choropleth-legend';

import styles from './ghg-map-styles.scss';

const MAP_ZOOM_STEP = 2;
const MAP_ZOOM_DEFAULT = 12;

const MapTooltip = ({ properties }) => (
  <div>
    {properties && properties.name}
  </div>
);

MapTooltip.propTypes = { properties: PropTypes.object.isRequired };

class GHGMap extends PureComponent {
  constructor() {
    super();
    this.state = { mapZoom: MAP_ZOOM_DEFAULT };
  }

  handleProvinceClick = e => {
    const { linkToProvinceGHG, query } = this.props;
    const provinceISO = e.properties && e.properties.code_hasc;

    if (!provinceISO) return;

    const metricQuery = query && query.metric && { metric: query.metric };

    linkToProvinceGHG({
      section: 'regions-ghg-emissions',
      region: provinceISO,
      query: metricQuery
    });
  };

  handleZoomIn = () => {
    this.setState(({ mapZoom }) => ({ mapZoom: mapZoom * MAP_ZOOM_STEP }));
  };

  handleZoomOut = () => {
    this.setState(({ mapZoom }) => ({ mapZoom: mapZoom / MAP_ZOOM_STEP }));
  };

  render() {
    const { paths, buckets, mapCenter, unit } = this.props;
    const { mapZoom } = this.state;
    const mapStyle = { width: '100%', height: '100%' };

    return (
      <div className={styles.mapContainer}>
        <Map
          zoom={mapZoom}
          paths={paths}
          center={mapCenter}
          className={styles.map}
          style={mapStyle}
          handleZoomIn={this.handleZoomIn}
          handleZoomOut={this.handleZoomOut}
          onGeographyClick={this.handleProvinceClick}
          tooltip={MapTooltip}
          zoomEnable
          forceUpdate
        />
        <MapChoroplethLegend buckets={buckets} unit={unit} />
      </div>
    );
  }
}

GHGMap.propTypes = {
  paths: PropTypes.array,
  buckets: PropTypes.array,
  unit: PropTypes.string,
  mapCenter: PropTypes.array,
  linkToProvinceGHG: PropTypes.func.isRequired
};

GHGMap.defaultProps = {
  mapCenter: [ 113, -1.86 ],
  paths: [],
  buckets: [],
  unit: ''
};

export default GHGMap;
