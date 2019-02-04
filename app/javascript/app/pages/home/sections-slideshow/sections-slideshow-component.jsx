import React, { Component } from 'react';
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
    const { t } = this.props;

    const slideOne = t('pages.homepage.slide-one') || {};
    const slideTwo = t('pages.homepage.slide-two') || {};
    const slideThree = t('pages.homepage.slide-three') || {};

    const slidesData = [
      {
        pagingTitle: slideOne.paging,
        title: slideOne.title,
        text: slideOne.description,
        buttonText: slideOne.button,
        smImage: climateSmImage,
        bgImage: climateBgImage,
        altText: 'Climate goals chart',
        routerAction: CLIMATE_GOALS
      },
      {
        pagingTitle: slideTwo.paging,
        title: slideTwo.title,
        text: slideTwo.description,
        buttonText: slideTwo.button,
        smImage: nationalSmImage,
        bgImage: nationalBgImage,
        altText: 'National context chart',
        routerAction: NATIONAL_CONTEXT
      },
      {
        pagingTitle: slideThree.paging,
        title: slideThree.title,
        text: slideThree.description,
        buttonText: slideThree.button,
        smImage: anualSmImage,
        bgImage: anualBgImage,
        altText: 'GHG chart',
        routerAction: CLIMATE_GOALS
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

SectionsSlideshowComponent.propTypes = { t: PropTypes.func.isRequired };

SectionsSlideshowComponent.defaultProps = { slides: {} };
export default SectionsSlideshowComponent;
