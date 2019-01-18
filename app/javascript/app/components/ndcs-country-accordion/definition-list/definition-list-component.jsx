import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './definition-list-styles.scss';

class DefinitionList extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { definitions, className } = this.props;
    return (
      <dl className={className}>
        {
          definitions && definitions.length > 0 && definitions.map(def => (
            <div className="grid-column-item" key={def.slug}>
              <div
                key={`${def.slug}-${def.title}-${Math.random()}`}
                className={styles.definition}
              >
                <dt className={styles.definitionTitle}>{def.title}</dt>
                {
                    def.descriptions && def.descriptions.map(desc => (
                      <dd
                        key={`${def.slug}-${desc.iso}`}
                        className={styles.definitionDesc}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                              __html: desc.value
                            }}
                        />
                      </dd>
                      ))
                  }
              </div>
            </div>
            ))
        }
      </dl>
    );
  }
}

DefinitionList.propTypes = {
  className: PropTypes.string,
  definitions: PropTypes.array
};

DefinitionList.defaultProps = { className: undefined, definitions: undefined };

export default DefinitionList;
