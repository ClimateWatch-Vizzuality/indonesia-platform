import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import upperFirst from 'lodash/upperFirst';
import { isArray } from 'util';
import styles from './metadata-text-styles.scss';

const MetadataAllProps = ({ data }) => Object
  .keys(data)
  .sort(a => a === 'logo' ? 1 : -1)
  .map(
    key =>
      data[key] &&
        !isArray(data[key]) &&
        <MetadataProp key={key} title={key} data={data[key]} />
  );

MetadataAllProps.propTypes = { data: PropTypes.object.isRequired };

const urlTitles = [ 'url', 'Link' ];
const MetadataProp = ({ title, data }) =>
  data &&
    (title === 'logo'
      ? <img src={`https:${data}`} alt="Metadata provider logo" />
      : (
        <p className={styles.text}>
          <span className={styles.textHighlight}>{upperFirst(title)}: </span>
          {
          urlTitles.includes(title) ? (
            <a className={styles.link} href={data}>
              {data}
            </a>
) : (
  <span
    className={cx({ [styles.empty]: data === 'Not specified' })}
  >
    {data}
  </span>
)
        }
        </p>
));

MetadataProp.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.node.isRequired
};

class MetadataText extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, className, showAll } = this.props;
    const { title, learnMoreLink, sourceOrganization, citation } = data;

    return (
      <div
        key={data.shortTitle}
        className={cx(styles.textContainer, className)}
      >
        {
          showAll ? <MetadataAllProps data={data} /> : (
            <div>
              {title && <MetadataProp title="Title" data={title} />}
              {
                sourceOrganization &&
                  (
                    <MetadataProp
                      title="Source organization"
                      data={sourceOrganization}
                    />
                  )
              }
              {
                learnMoreLink && (
                <MetadataProp
                  title="Read more"
                  data={
                        (
                          <a
                            key="link"
                            className={styles.link}
                            href={learnMoreLink}
                          >
                            {' '}
                            {learnMoreLink}{' '}
                          </a>
                        )
                      }
                />
                  )
              }
              {citation && <MetadataProp title="Citation" data={citation} />}
            </div>
)
        }
      </div>
    );
  }
}

MetadataText.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  showAll: PropTypes.bool
};

MetadataText.defaultProps = { data: {}, className: null, showAll: false };

export default MetadataText;
