import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ModalHeader } from 'cw-components';
import Tab from 'components/tab';

class HeaderWithTabs extends PureComponent {
  render() {
    const {
      title,
      theme,
      tabTitles,
      selectedIndex,
      handleTabIndexChange,
      children
    } = this.props;
    return (
      <ModalHeader title={title} theme={theme}>
        {
          tabTitles &&
            (
              <Tab
                options={tabTitles}
                selectedIndex={selectedIndex}
                handleTabIndexChange={handleTabIndexChange}
              />
            )
        }
        {children}
      </ModalHeader>
    );
  }
}

HeaderWithTabs.propTypes = {
  title: PropTypes.string,
  tabTitles: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  handleTabIndexChange: PropTypes.func.isRequired,
  theme: PropTypes.object,
  children: PropTypes.node.isRequired
};

HeaderWithTabs.defaultProps = { theme: {}, title: '' };

export default HeaderWithTabs;
