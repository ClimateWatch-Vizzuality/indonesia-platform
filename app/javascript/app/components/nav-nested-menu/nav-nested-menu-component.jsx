import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Icon } from 'cw-components';
import arrow from 'assets/icons/arrow-down-tiny';

import styles from './nav-nested-menu-styles';

class NavNestedMenuComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { title } = this.props;
    this.state = { open: false, title };
  }

  renderButton() {
    const { buttonClassName } = this.props;
    const { open, title } = this.state;

    return (
      <button
        type="button"
        className={cx(styles.button, buttonClassName)}
        onClick={() => this.setState({ open: !open })}
      >
        {title && <div className={styles.title}>{title.label}</div>}
        <Icon
          icon={arrow}
          theme={{ icon: cx(styles.icon, { [styles.upIcon]: open }) }}
        />
      </button>
    );
  }

  render() {
    const { options, positionRight, onValueChange } = this.props;
    const { open } = this.state;

    const handleClick = option => {
      onValueChange(option);
      this.setState({ open: false, title: option });
    };

    return (
      <div
        className={cx(styles.dropdown, {
          [styles.positionRight]: positionRight
        })}
      >
        {this.renderButton()}
        {
          open && (
          <ul className={cx(styles.links, { [styles.open]: open })}>
            {options.map(
                  option /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */ => (
                    <li
                      key={option.label}
                      onKeyDown={() => handleClick(option)}
                      onClick={() => handleClick(option)}
                      className={styles.link}
                    >
                      {option.label}
                    </li>
                  )
                )}
          </ul>
            )
        }
      </div>
    );
  }
}

NavNestedMenuComponent.propTypes = {
  title: PropTypes.object,
  onValueChange: PropTypes.func,
  options: PropTypes.array,
  buttonClassName: PropTypes.string,
  positionRight: PropTypes.bool
};

NavNestedMenuComponent.defaultProps = {
  title: undefined,
  onValueChange: () => {
  },
  options: [],
  buttonClassName: '',
  positionRight: true
};

export default NavNestedMenuComponent;
