import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Carousel } from 'cw-components';
import Link from 'redux-first-router-link';
import { getTranslation } from 'utils/translations';
// redirect actions
import { NATIONAL_CONTEXT, CLIMATE_GOALS } from 'router';
// images
import climateSmImage from 'assets/carousel_climate_goals@1x';
import climateBgImage from 'assets/carousel_climate_goals@2x';
import nationalSmImage from 'assets/carousel_national_context@1x';
import nationalBgImage from 'assets/carousel_national_context@2x';
import anualSmImage from 'assets/carousel_annual_emissions@1x';
import anualBgImage from 'assets/carousel_annual_emissions@2x';
import provincesSmImage from 'assets/carousel_top_10_emitting_provinces@1x';
import provincesBgImage from 'assets/carousel_top_10_emitting_provinces@2x';

import styles from './sections-slideshow-styles.scss';

const TopSlide = ({ title, text, buttonText, routerAction, routeSection }) => (
  <div className={styles.slideWrapper} key={title}>
    <h3 className={styles.slideTitle}>{title}</h3>
    <p className={styles.slideParagraph}>
      {text}
    </p>
    <Button theme={{ button: styles.button }}>
      <Link
        to={{ type: routerAction, payload: { section: routeSection } }}
        onMouseDown={undefined}
        onTouchStart={undefined}
      >
        {buttonText}
      </Link>
    </Button>
  </div>
);

const BottomSlide = ({ smImage, bgImage, altText }) => (
  <div className={styles.bottomSlideContainer} key={altText}>
    <img
      className={styles.image}
      src={smImage}
      srcSet={`${smImage}, ${bgImage} 2x`}
      alt={altText}
    />
  </div>
);

class SectionsSlideshowComponent extends Component {
  pagingTitles = slidesData => slidesData.map(s => s.pagingTitle);

  renderSlides = slidesData => {
    const tops = slidesData &&
      slidesData.map(slide => (
        <TopSlide
          key={slide.title}
          title={slide.title}
          text={slide.text}
          buttonText={slide.buttonText}
          routerAction={slide.routerAction}
          routeSection={slide.routeSection}
          topSlide
        />
      ));

    const bottoms = slidesData &&
      slidesData.map(slide => (
        <BottomSlide
          key={slide.smImage}
          smImage={slide.smImage}
          bgImage={slide.bgImage}
          altText={slide.altText}
          bottomSlide
        />
      ));

    return [ ...tops, ...bottoms ];
  };

  render() {
    const { slides } = this.props;
    const slidesData = [
      {
        pagingTitle: getTranslation(slides, 'slide-one-paging', 'title'),
        title: getTranslation(slides, 'slide-one', 'title'),
        text: getTranslation(slides, 'slide-one', 'description'),
        buttonText: getTranslation(slides, 'slide-one-button', 'title'),
        smImage: climateSmImage,
        bgImage: climateBgImage,
        altText: 'Climate goals chart',
        routerAction: CLIMATE_GOALS
      },
      {
        pagingTitle: getTranslation(slides, 'slide-two-paging', 'title'),
        title: getTranslation(slides, 'slide-two', 'title'),
        text: getTranslation(slides, 'slide-two', 'description'),
        buttonText: getTranslation(slides, 'slide-two-button', 'title'),
        smImage: nationalSmImage,
        bgImage: nationalBgImage,
        altText: 'National context chart',
        routerAction: NATIONAL_CONTEXT
      },
      {
        pagingTitle: getTranslation(slides, 'slide-three-paging', 'title'),
        title: getTranslation(slides, 'slide-three', 'title'),
        text: getTranslation(slides, 'slide-three', 'description'),
        buttonText: getTranslation(slides, 'slide-three-button', 'title'),
        smImage: anualSmImage,
        bgImage: anualBgImage,
        altText: 'GHG chart',
        routerAction: CLIMATE_GOALS
      },
      {
        pagingTitle: getTranslation(slides, 'slide-four-paging', 'title'),
        title: getTranslation(slides, 'slide-four', 'title'),
        text: getTranslation(slides, 'slide-four', 'description'),
        buttonText: getTranslation(slides, 'slide-four-button', 'title'),
        smImage: provincesSmImage,
        bgImage: provincesBgImage,
        altText: 'Provinces chart',
        routerAction: NATIONAL_CONTEXT,
        routeSection: 'historical-emissions'
      }
    ];

    return (
      <section className={styles.container}>
        <Carousel pagingTitles={this.pagingTitles(slidesData)}>
          {this.renderSlides(slidesData)}
        </Carousel>
      </section>
    );
  }
}

TopSlide.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  routerAction: PropTypes.string,
  routeSection: PropTypes.string
};

TopSlide.defaultProps = {
  title: null,
  text: null,
  buttonText: null,
  routerAction: null,
  routeSection: null
};

BottomSlide.propTypes = {
  smImage: PropTypes.string.isRequired,
  bgImage: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired
};

SectionsSlideshowComponent.propTypes = { slides: PropTypes.shape() };

SectionsSlideshowComponent.defaultProps = { slides: {} };
export default SectionsSlideshowComponent;
