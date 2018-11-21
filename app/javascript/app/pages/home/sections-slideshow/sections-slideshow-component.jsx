import React from 'react';
import PropTypes from 'prop-types';
import { Button, Carousel } from 'cw-components';
import Link from 'redux-first-router-link';
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

const slidesData = [
  {
    pagingTitle: 'Climate goals',
    title: 'Indonesia’s climmate commitment',
    buttonText: 'Go to climate goals',
    smImage: climateSmImage,
    bgImage: climateBgImage,
    altText: 'Climate goals chart',
    routerAction: CLIMATE_GOALS
  },
  {
    pagingTitle: 'National context',
    title: 'Socioeconomic indicators',
    buttonText: 'Go to national context',
    smImage: nationalSmImage,
    bgImage: nationalBgImage,
    altText: 'National context chart',
    routerAction: NATIONAL_CONTEXT
  },
  {
    pagingTitle: 'Annual emissions',
    title: 'Greenhouse Gas Emissions and Targets',
    buttonText: 'Go to GHG target',
    smImage: anualSmImage,
    bgImage: anualBgImage,
    altText: 'GHG chart',
    routerAction: CLIMATE_GOALS
  },
  {
    pagingTitle: 'Top 10 emitting provinces',
    title: 'Top 10 emitting provinces',
    buttonText: 'Go to historical emissions',
    smImage: provincesSmImage,
    bgImage: provincesBgImage,
    altText: 'Provinces chart',
    routerAction: NATIONAL_CONTEXT,
    routeSection: 'historical-emissions'
  }
];
const pagingTitles = slidesData.map(s => s.pagingTitle);
const TopSlide = ({ title, buttonText, routerAction, routeSection }) => (
  <div className={styles.slideWrapper} key={title}>
    <h3 className={styles.slideTitle}>{title}</h3>
    <p className={styles.slideParagraph}>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
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
const bottoms = slidesData.map(slide => (
  <BottomSlide
    smImage={slide.smImage}
    bgImage={slide.bgImage}
    altText={slide.altText}
    bottomSlide
  />
));
const tops = slidesData.map(slide => (
  <TopSlide
    title={slide.title}
    buttonText={slide.buttonText}
    routerAction={slide.routerAction}
    routeSection={slide.routeSection}
    topSlide
  />
));

const slides = [ ...tops, ...bottoms ];
const SectionsSlideshowComponent = () => (
  <section className={styles.container}>
    <Carousel pagingTitles={pagingTitles}>
      {slides}
    </Carousel>
  </section>
);
TopSlide.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  routerAction: PropTypes.string.isRequired,
  routeSection: PropTypes.string
};

TopSlide.defaultProps = { routeSection: null };
BottomSlide.propTypes = {
  smImage: PropTypes.string.isRequired,
  bgImage: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired
};
export default SectionsSlideshowComponent;
