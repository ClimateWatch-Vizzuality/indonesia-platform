import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import SectionTitle from 'components/section-title';
import styles from './stories-styles.scss';

class Stories extends PureComponent {
  render() {
    const { stories } = this.props;

    return (
      <div className={styles.wrapper}>
        <SectionTitle title="Highlighted Stories" />
        <div className={styles.grid}>
          {stories.map(story => (
            <a
              key={story.link}
              className={styles.story}
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              /* onClick={() => handleClickAnalytics(story.title)} */
            >
              {story.title}
            </a>
          ))}
        </div>
      </div>
    );
  }
}

Stories.propTypes = { stories: PropTypes.array };

Stories.defaultProps = { stories: [] };

export default Stories;
