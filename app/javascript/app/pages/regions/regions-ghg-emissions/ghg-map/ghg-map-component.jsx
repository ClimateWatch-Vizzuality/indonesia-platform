import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Map from 'components/map';
import MapChoroplethLegend from 'components/map-choropleth-legend';

import styles from './ghg-map-styles.scss';

const MAP_ZOOM_STEP = 2;

const MapTooltip = ({ properties }) => (
  <div>
    {properties.name}
  </div>
);

MapTooltip.propTypes = { properties: PropTypes.object.isRequired };

class GHGMap extends PureComponent {
  constructor() {
    super();
    this.state = { mapZoom: 10 };
  }

  handleProvinceClick = () => {
    /* console.log(e); */
  };

  handleZoomIn = () => {
    this.setState(({ mapZoom }) => ({ mapZoom: mapZoom * MAP_ZOOM_STEP }));
  };

  handleZoomOut = () => {
    this.setState(({ mapZoom }) => ({ mapZoom: mapZoom / MAP_ZOOM_STEP }));
  };

  render() {
    const { paths, buckets } = this.props;
    const { mapZoom } = this.state;
    const mapStyle = { width: '100%', height: '100%' };
    const center = [ 113, -1.86 ];

    return (
      <div className={styles.mapContainer}>
        <Map
          zoom={mapZoom}
          paths={paths}
          center={center}
          className={styles.map}
          style={mapStyle}
          handleZoomIn={this.handleZoomIn}
          handleZoomOut={this.handleZoomOut}
          onGeographyClick={this.handleProvinceClick}
          tooltip={MapTooltip}
          zoomEnable
          forceUpdate
        />
        <MapChoroplethLegend buckets={buckets} />
      </div>
    );
  }
}

GHGMap.propTypes = { paths: PropTypes.array, buckets: PropTypes.array };

GHGMap.defaultProps = { paths: [], buckets: [] };

export default GHGMap;
