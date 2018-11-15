import React from 'react';
import PropTypes from 'prop-types';
import { Button, Carousel } from 'cw-components';
import ghgImage from 'assets/historical-emissions@2x';

import styles from './sections-slideshow-styles.scss';

const pagingTitles = [
  'Climate goals',
  'National context',
  'Annual emissions',
  'Top 10 emitting provinces'
];

const TopSlide = ({ title }) => (
  <div className={styles.slideWrapper}>
    <h3 className={styles.slideTitle}>{title}</h3>
    <p className={styles.slideParagraph}>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
    </p>
    <Button theme={{ button: styles.button }}>Go to GHG target</Button>
  </div>
);

const BottomSlide = () => (
  <div className={styles.bottomSlideContainer}>
    <img className={styles.image} src={ghgImage} alt="ghg" />
  </div>
);

const SectionsSlideshowComponent = () => (
  <section className={styles.container}>
    <Carousel pagingTitles={pagingTitles}>
      <TopSlide title="Greenhouse Gas Emissions and Targets" topSlide />
      <BottomSlide bottomSlide />
      <TopSlide title="National context" topSlide />
      <BottomSlide bottomSlide />
      <TopSlide title="Annual emissions" topSlide />
      <BottomSlide bottomSlide />
      <TopSlide title="Top 10 emitting provinces" topSlide />
      <BottomSlide bottomSlide />
    </Carousel>
  </section>
);

TopSlide.propTypes = { title: PropTypes.string.isRequired };

export default SectionsSlideshowComponent;
