import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './card-styles.scss';

class Card extends PureComponent {
  render() {
    const { header, children, theme } = this.props;

    return (
      <div className={cx(styles.card, theme.card)}>
        <div className={cx(styles.header, theme.header)}>
          {header}
        </div>
        <div className={cx(styles.cardContent, theme.cardContent)}>
          {children}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node,
  theme: PropTypes.shape({
    card: PropTypes.string,
    header: PropTypes.string,
    cardContent: PropTypes.string
  })
};

Card.defaultProps = { header: null, children: null, theme: {} };

export default Card;
