import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader } from 'cw-components';
import styles from './modal-info-styles';

class ModalInfo extends PureComponent {
  render() {
    const { isOpen, title, children, onRequestClose } = this.props;
    return (
      <Modal
        onRequestClose={onRequestClose}
        isOpen={isOpen}
        header={<ModalHeader title={title} />}
      >
        <div className={styles.modalContent}>
          {children}
        </div>
      </Modal>
    );
  }
}

ModalInfo.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

ModalInfo.defaultProps = { title: '' };

export default ModalInfo;
