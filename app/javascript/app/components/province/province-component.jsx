import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import SectionTitle from 'components/section-title';
import styles from './province-styles.scss';

class Province extends PureComponent {
  render() {
    const { title, description } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.provinceContainer}>
          <div className={styles.provinceImage} />
          <div className={styles.wrapper}>
            <div className={styles.provinceContentContainer}>
              <SectionTitle title={title} />
              <ul
                className={styles.list}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Province.propTypes = {
  title: Proptypes.string.isRequired,
  description: Proptypes.string.isRequired
};

export default Province;
