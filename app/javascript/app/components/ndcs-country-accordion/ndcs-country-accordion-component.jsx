import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Loading, NoContent } from 'cw-components';

import layout from 'styles/layout.scss';
import styles from './ndcs-country-accordion-styles.scss';

import DefinitionList from './definition-list';

class NdcsCountryAccordion extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { accordions: {} };
  }

  handleOnClick(accordion, slug) {
    this.setState(state => {
      const currentAccordions = state.accordions;
      const clickedAccordionSlug = !currentAccordions[accordion] ||
        currentAccordions[accordion] === slug
        ? 'none'
        : slug;
      return {
        accordions: { ...currentAccordions, [accordion]: clickedAccordionSlug }
      };
    });
  }

  renderSectoralInformationAccordion() {
    const { ndcsData } = this.props;
    const { accordions } = this.state;
    return (
      <Accordion
        data={ndcsData}
        handleOnClick={slug => this.handleOnClick('main', slug)}
        openSlug={accordions.main}
        theme={{ title: styles.mainTitle }}
      >
        {
          ndcsData && ndcsData.length > 0 && ndcsData.map(
              section =>
                section.sectors && section.sectors.length > 0
                  ? (
                    <Accordion
                      key={section.slug}
                      data={section.sectors}
                      handleOnClick={slug =>
                      this.handleOnClick(`secondary-${section.slug}`, slug)}
                      openSlug={accordions[`secondary-${section.slug}`]}
                      theme={{
                      title: styles.secondaryTitle,
                      header: styles.secondaryHeader,
                      accordion: styles.accordionContent
                    }}
                    >
                      {section.sectors.map(desc => (
                        <div key={desc.title} className={styles.definitionList}>
                          <DefinitionList
                            className={layout.content}
                            definitions={desc.definitions}
                          />
                        </div>
                    ))}
                    </Accordion>
)
                  : null
            )
        }
      </Accordion>
    );
  }

  renderAccordion() {
    const { ndcsData, loading, category } = this.props;
    const { accordions } = this.state;
    return category === 'sectoral_information'
      ? this.renderSectoralInformationAccordion()
      : (
        <Accordion
          data={ndcsData}
          loading={loading}
          handleOnClick={slug => this.handleOnClick('main', slug)}
          openSlug={accordions.main}
          theme={{ title: styles.mainTitle, accordion: styles.accordionContent }}
        >
          {
          ndcsData && ndcsData.map(section => (
            <div key={section.title} className={styles.definitionList}>
              <DefinitionList
                className={layout.content}
                definitions={section.definitions}
              />
            </div>
            ))
        }
        </Accordion>
);
  }

  render() {
    const { ndcsData, loading, search, t } = this.props;
    const message = t(
      `pages.climate-goals.no-content${search.search ? '-search' : ''}`
    );
    const showNoContent = !loading && (!ndcsData || !ndcsData.length);
    const showData = !loading && ndcsData && ndcsData.length > 0;
    return (
      <div className={styles.wrapper}>
        {loading && <Loading theme={{ wrapper: styles.loader }} />}
        {
          showNoContent &&
            (
              <NoContent
                message={message}
                theme={{ wrapper: styles.noContent }}
              />
            )
        }
        {showData && this.renderAccordion()}
      </div>
    );
  }
}

NdcsCountryAccordion.propTypes = {
  ndcsData: PropTypes.array,
  loading: PropTypes.bool,
  category: PropTypes.string,
  search: PropTypes.object,
  t: PropTypes.func.isRequired
};

NdcsCountryAccordion.defaultProps = {
  ndcsData: undefined,
  loading: false,
  category: undefined,
  search: undefined
};

export default NdcsCountryAccordion;
