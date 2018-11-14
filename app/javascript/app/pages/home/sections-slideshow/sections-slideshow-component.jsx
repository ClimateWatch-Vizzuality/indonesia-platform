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

const CustomSlide = ({ title }) => (
  <div className={styles.slideWrapper}>
    <h3 className={styles.slideTitle}>{title}</h3>
    <p className={styles.slideParagraph}>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
    </p>
    <Button theme={{ button: styles.button }}>Go to GHG target</Button>
    <div>
      <img className={styles.image} src={ghgImage} alt="ghg" />
    </div>
  </div>
);

const SectionsSlideshowComponent = () => (
  <section className={styles.container}>
    <Carousel pagingTitles={pagingTitles}>
      <CustomSlide title="Greenhouse Gas Emissions and Targets" />
      <CustomSlide title="National context" />
      <CustomSlide title="Annual emissions" />
      <CustomSlide title="Top 10 emitting provinces" />
    </Carousel>
  </section>
);

CustomSlide.propTypes = { title: PropTypes.string.isRequired };

export default SectionsSlideshowComponent;
