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

  render() {
    const {
      forceUpdate,
      paths,
      cache,
      style,
      zoomEnable,
      dragEnable,
      tooltipId,
      handleZoomIn,
      handleZoomOut,
      countryNameTooltip,
      onCountryClick,
      onCountryMove,
      onCountryEnter,
      onCountryLeave,
      onCountryFocus,
      onCountryBlur,
      defaultStyle,
      controlPosition,
      zoom,
      center,
      customCenter,
      className,
      theme
    } = this.props;

    const getTooltip = name => {
      const path = paths.find(p => p.properties.name === name);
      const value = Number.parseInt(path.properties.tooltipValue, 10)
        ? format(',')(path.properties.tooltipValue)
        : path.properties.tooltipValue;

      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipTitle}>
            {path.properties.selectedYear} {name}
          </div>
          {
            // eslint-disable-next-line no-nested-ternary
            path.properties.sector && path.properties.tooltipValue
              ? (
                <div className={styles.tooltipContent}>
                  <p className={styles.tooltipActivityName}>
                    {startCase(toLower(path.properties.sector))}
                  </p>
                  <p>{value}</p>
                </div>
)
              : path.properties.tooltipValue
                ? <p>{value}</p>
                : <p className={styles.noData}>No data</p>
          }
        </div>
      );
    };

    const getMotionStyle = () => {
      const xCenter = customCenter && customCenter[0] || center[0];
      const yCenter = customCenter && customCenter[1] || center[1];
      return {
        z: spring(zoom, { stiffness: 240, damping: 30 }),
        x: spring(xCenter, { stiffness: 240, damping: 30 }),
        y: spring(yCenter, { stiffness: 240, damping: 30 })
      };
    };
    return (
      <TabletLandscape>
        {matches => (
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
                  <ZoomableGroup
                    zoom={z}
                    center={customCenter || [ x, y ]}
                    onMoveEnd={this.handleMoveEnd}
                  >
                    <Geographies
                      geography={paths}
                      disableOptimization={forceUpdate || !cache}
                    >
                      {(geographies, projection) =>
                        geographies.map(geography => {
                          if (geography) {
                            let commonProps = {
                              geography,
                              projection,
                              onClick: onCountryClick,
                              onMouseMove: onCountryMove,
                              onMouseEnter: onCountryEnter,
                              onMouseLeave: onCountryLeave,
                              onFocus: onCountryFocus,
                              onBlur: onCountryBlur,
                              style: geography.style || defaultStyle
                            };
                            if (countryNameTooltip) {
                              commonProps = {
                                ...commonProps,
                                'data-tip': geography.properties.name,
                                'data-for': 'namesTooltip'
                              };
                            }
                            if (tooltipId) {
                              commonProps = {
                                ...commonProps,
                                'data-tip': '',
                                'data-for': tooltipId
                              };
                              if (!matches) {
                                commonProps = {
                                  ...commonProps,
                                  'data-event': 'click',
                                  'data-event-off': 'click'
                                };
                              }
                            }
                            return (
                              <Geography
                                key={geography.properties.name}
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
              countryNameTooltip &&
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
        )}
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
  customCenter: PropTypes.array,
  zoom: PropTypes.number,
  /** Option to show zoom and zoom out buttons */
  zoomEnable: PropTypes.bool,
  /** Tooltip id */
  tooltipId: PropTypes.string,
  cache: PropTypes.bool,
  countryNameTooltip: PropTypes.bool,
  /** Position of zoom and zoom out buttons - default to top */
  controlPosition: PropTypes.string,
  handleZoomIn: PropTypes.func,
  handleZoomOut: PropTypes.func,
  forceUpdate: PropTypes.bool,
  /** Option to drag the map around */
  dragEnable: PropTypes.bool,
  className: PropTypes.string,
  /** Action handlers */
  onCountryEnter: PropTypes.func,
  onCountryClick: PropTypes.func,
  onCountryMove: PropTypes.func,
  onCountryLeave: PropTypes.func,
  onCountryFocus: PropTypes.func,
  onCountryBlur: PropTypes.func
};

MapComponent.defaultProps = {
  style: { width: '100%', height: 'auto' },
  theme: {},
  zoom: 1,
  paths: [],
  center: [ 0, 0 ],
  customCenter: [ 0, 0 ],
  dragEnable: true,
  zoomEnable: false,
  cache: true,
  className: '',
  controlPosition: 'top',
  handleZoomIn: () => {
  },
  handleZoomOut: () => {
  },
  onCountryClick: () => {
  },
  onCountryEnter: () => {
  },
  onCountryMove: () => {
  },
  onCountryLeave: () => {
  },
  onCountryFocus: () => {
  },
  onCountryBlur: () => {
  },
  countryNameTooltip: true,
  forceUpdate: false,
  tooltipId: '',
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
