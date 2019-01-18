import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import mapZoomIn from 'assets/icons/map-zoom-in';
import mapZoomOut from 'assets/icons/map-zoom-out';

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
      showTooltip,
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
      theme,
      tooltip
    } = this.props;

    const getMotionStyle = () => {
      const xCenter = center[0];
      const yCenter = center[1];
      return {
        z: spring(zoom, { stiffness: 240, damping: 30 }),
        x: spring(xCenter, { stiffness: 240, damping: 30 }),
        y: spring(yCenter, { stiffness: 240, damping: 30 })
      };
    };
    const getProperitesForPath = pathName => {
      const path = paths && paths.find(p => p.properties.name === pathName) ||
        {};
      return path.properties;
    };
    const Tooltip = tooltip;

    return (
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
        <Motion defaultStyle={{ z: 1, x: 20, y: 10 }} style={getMotionStyle()}>
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
                      if (showTooltip) {
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
          showTooltip &&
            Tooltip &&
            paths &&
            (
              <ReactTooltip
                place="right"
                id="namesTooltip"
                className={cx('tooltip', theme.tooltip)}
                getContent={name => (
                  <Tooltip properties={getProperitesForPath(name)} />
                )}
              />
            )
        }
      </div>
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
  tooltip: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
  showTooltip: PropTypes.bool,
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
  tooltip: null,
  showTooltip: true,
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
