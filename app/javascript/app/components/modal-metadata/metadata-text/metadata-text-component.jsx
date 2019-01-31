import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import upperFirst from 'lodash/upperFirst';
import styles from './metadata-text-styles.scss';

const DEFAULT_ORDER = [
  'short_title',
  'title',
  'source_organization',
  'learn_more_link',
  'summary',
  'description',
  'caution',
  'citation'
];
const DEFAULT_SHOW_EXCEPT = [ 'short_title' ];
const URLS = [ 'learn_more_link' ];

const renderMetadataValue = (key, data, emptyText) => {
  if (!data) {
    return (
      <span className={styles.empty}>
        {emptyText}
      </span>
    );
  }

  if (URLS.includes(key)) {
    return (
      <a className={styles.link} href={data}>
        {data}
      </a>
    );
  }

  return <span>{data}</span>;
};

const MetadataProp = ({ id, title, data, emptyText }) => (
  <p className={styles.text}>
    <span className={styles.textHighlight}>
      {upperFirst(title)}:
    </span>
    {' '}
    {renderMetadataValue(id, data, emptyText)}
  </p>
);
MetadataProp.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  data: PropTypes.node
};
MetadataProp.defaultProps = { data: null };

class MetadataText extends PureComponent {
  renderMetadataProps() {
    const { data, showExcept, t } = this.props;

    if (!data) return null;

    return Object
      .keys(data)
      .sort(a => DEFAULT_ORDER.indexOf(a))
      .filter(key => !showExcept.includes(key))
      .map(key => (
        <MetadataProp
          key={key}
          id={key}
          title={t(`common.metadata.${key}`, { default: key })}
          data={data[key]}
          emptyText={t('common.metadata.not-specified')}
        />
      ));
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, className } = this.props;

    const shortTitle = data.short_title;

    return (
      <div key={shortTitle} className={cx(styles.textContainer, className)}>
        {this.renderMetadataProps()}
      </div>
    );
  }
}

MetadataText.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.object,
  showExcept: PropTypes.array,
  className: PropTypes.string
};

MetadataText.defaultProps = {
  data: {},
  className: null,
  showExcept: DEFAULT_SHOW_EXCEPT
};

export default MetadataText;
