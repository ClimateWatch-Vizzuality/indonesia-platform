import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, Loading, NoContent } from 'cw-components';
import MetadataText from './metadata-text';

import styles from './modal-metadata-styles.scss';

class ModalMetadata extends PureComponent {
  constructor() {
    super();
    this.state = { selectedIndex: 0 };
    this.handleOnRequestClose = this.handleOnRequestClose.bind(this);
  }

  getContent() {
    const { data, loading } = this.props;
    if (loading) {
      return <Loading className={styles.loadingContainer} />;
    }
    if (!data) return <NoContent message="There is no data available" />;
    if (data === 'error') {
      return <NoContent message="There was an error getting the metadata" />;
    }
    const { selectedIndex } = this.state;
    const selectedIndexData = data[selectedIndex];
    return <MetadataText data={selectedIndexData} />;
  }

  handleOnRequestClose() {
    const { onRequestClose } = this.props;
    this.setState({ selectedIndex: 0 });
    onRequestClose();
  }

  render() {
    const { selectedIndex } = this.state;
    const { isOpen, title } = this.props;
    return (
      <Modal
        onRequestClose={this.handleOnRequestClose}
        isOpen={isOpen}
        header={
          (
            <ModalHeader
              selectedIndex={selectedIndex}
              handleTabIndexChange={i => this.setState({ selectedIndex: i })}
              title={title}
            />
          )
        }
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalMetadata.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ModalMetadata.defaultProps = { title: '', data: [], loading: false };

export default ModalMetadata;