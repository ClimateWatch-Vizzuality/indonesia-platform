import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import cx from 'classnames';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps';
import { Motion, spring } from 'react-motion';
import ReactTooltip from 'react-tooltip';
import { Icon, Button } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import mapZoomIn from 'assets/icons/map-zoom-in';
import mapZoomOut from 'assets/icons/map-zoom-out';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import styles from './map-styles.scss';

class MapComponent extends Component {
  componentDidMount() {
    setTimeout(
      () => {
        ReactTooltip.rebuild();
      },
      100
    );
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      forceUpdate,
      paths,
      cache,
      style,
      zoomEnable,
      dragEnable,
      handleZoomIn,
      handleZoomOut,
      geographyTooltip,
      onGeographyClick,
      onGeographyMove,
      onGeographyEnter,
      onGeographyLeave,
      onGeographyFocus,
      onGeographyBlur,
      defaultStyle,
      controlPosition,
      zoom,
      center,
      className,
      theme
    } = this.props;

    const getTooltip = name => {
      const path = paths && paths.find(p => p.properties.name === name);
      const { tooltipUnit, tooltipValue, sector, selectedYear } = path &&
        path.properties ||
        {};
      const value = Number.parseInt(tooltipValue, 10)
        ? format(',')(tooltipValue)
        : tooltipValue;

      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipTitle}>
            {selectedYear} {name}
          </div>
          {
            // eslint-disable-next-line no-nested-ternary
            sector && tooltipValue ? (
              <div className={styles.tooltipContent}>
                <p className={styles.tooltipActivityName}>
                  {startCase(toLower(sector))}
                </p>
                <p>
                  <span>{value}</span>
                  {' '}
                  <span dangerouslySetInnerHTML={{ __html: tooltipUnit }} />
                </p>
              </div>
) : tooltipValue
                ? <p>{value}</p>
                : <p className={styles.noData}>No data</p>
          }
        </div>
      );
    };

    const getMotionStyle = () => {
      const xCenter = center[0];
      const yCenter = center[1];
      return {
        z: spring(zoom, { stiffness: 240, damping: 30 }),
        x: spring(xCenter, { stiffness: 240, damping: 30 }),
        y: spring(yCenter, { stiffness: 240, damping: 30 })
      };
    };
    return (
      <TabletLandscape>
        <div
          className={cx(styles.wrapper, className, {
            [styles.notDraggable]: !dragEnable
          })}
        >
          {
            zoomEnable && (
            <div
              className={cx(styles.actions, {
                    [styles.bottom]: controlPosition === 'bottom'
                  })}
            >
              <Button onClick={handleZoomIn}>
                <Icon icon={mapZoomIn} />
              </Button>
              <Button disabled={zoom === 1} onClick={handleZoomOut}>
                <Icon icon={mapZoomOut} />
              </Button>
            </div>
              )
          }
          <Motion
            defaultStyle={{ z: 1, x: 20, y: 10 }}
            style={getMotionStyle()}
          >
            {({ z, x, y }) => (
              <ComposableMap projection="robinson" style={style}>
                <ZoomableGroup zoom={z} center={[ x, y ]}>
                  <Geographies
                    geography={paths}
                    disableOptimization={forceUpdate || !cache}
                  >
                    {(geographies, projection) => geographies.map(geography => {
                      if (geography) {
                        let commonProps = {
                          geography,
                          projection,
                          onClick: onGeographyClick,
                          onMouseMove: onGeographyMove,
                          onMouseEnter: onGeographyEnter,
                          onMouseLeave: onGeographyLeave,
                          onFocus: onGeographyFocus,
                          onBlur: onGeographyBlur,
                          style: geography.style || defaultStyle
                        };
                        if (geographyTooltip) {
                          commonProps = {
                            ...commonProps,
                            'data-tip': geography.properties.name,
                            'data-for': 'namesTooltip'
                          };
                        }
                        return (
                          <Geography
                            key={geography.properties.name}
                            cacheId={geography.properties.name}
                            {...commonProps}
                          />
                        );
                      }
                      return null;
                    })}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            )}
          </Motion>
          {
            geographyTooltip &&
              paths &&
              (
                <ReactTooltip
                  place="right"
                  id="namesTooltip"
                  className={cx('tooltip', theme.tooltip)}
                  getContent={name => getTooltip(name)}
                />
              )
          }
        </div>
      </TabletLandscape>
    );
  }
}

MapComponent.propTypes = {
  style: PropTypes.object,
  theme: PropTypes.object,
  /** Array with topojson map */
  paths: PropTypes.array,
  defaultStyle: PropTypes.object,
  /** Center of the map */
  center: PropTypes.array,
  zoom: PropTypes.number,
  /** Option to show zoom and zoom out buttons */
  zoomEnable: PropTypes.bool,
  cache: PropTypes.bool,
  geographyTooltip: PropTypes.bool,
  /** Position of zoom and zoom out buttons - default to top */
  controlPosition: PropTypes.string,
  handleZoomIn: PropTypes.func,
  handleZoomOut: PropTypes.func,
  forceUpdate: PropTypes.bool,
  /** Option to drag the map around */
  dragEnable: PropTypes.bool,
  className: PropTypes.string,
  /** Action handlers */
  onGeographyEnter: PropTypes.func,
  onGeographyClick: PropTypes.func,
  onGeographyMove: PropTypes.func,
  onGeographyLeave: PropTypes.func,
  onGeographyFocus: PropTypes.func,
  onGeographyBlur: PropTypes.func
};

MapComponent.defaultProps = {
  style: { width: '100%', height: 'auto' },
  theme: {},
  zoom: 1,
  paths: [],
  center: [ 0, 0 ],
  dragEnable: true,
  zoomEnable: false,
  cache: true,
  className: '',
  controlPosition: 'top',
  handleZoomIn: () => {
  },
  handleZoomOut: () => {
  },
  onGeographyClick: () => {
  },
  onGeographyEnter: () => {
  },
  onGeographyMove: () => {
  },
  onGeographyLeave: () => {
  },
  onGeographyFocus: () => {
  },
  onGeographyBlur: () => {
  },
  geographyTooltip: true,
  forceUpdate: false,
  defaultStyle: {
    default: {
      fill: '#E5E5EB',
      stroke: '#001329',
      strokeWidth: 0.05,
      outline: 'none'
    },
    hover: {
      fill: '#E5E5EB',
      stroke: '#001329',
      strokeWidth: 0.05,
      outline: 'none'
    },
    pressed: {
      fill: '#E5E5EB',
      stroke: '#001329',
      strokeWidth: 0.5,
      outline: 'none'
    }
  }
};

export default MapComponent;
