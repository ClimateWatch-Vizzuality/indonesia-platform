import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Icon } from 'cw-components';
import arrow from 'assets/icons/arrow-down-tiny';

import rootStyles from 'layouts/root/root-styles';
import navStyles from 'components/nav/nav-styles';
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
        key={title}
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

  renderChild() {
    const { Child, title } = this.props;
    const { open } = this.state;

    return (
      <React.Fragment>
        <button
          key={title}
          type="button"
          className={cx(rootStyles.link, navStyles.link, styles.button)}
          onClick={() => this.setState({ open: !open })}
        >
          {title && <div className={styles.title}>{title}</div>}
          <Icon
            icon={arrow}
            theme={{ icon: cx(styles.icon, { [styles.upIcon]: open }) }}
          />
        </button>
        <Child
          className={cx(styles.links, { [styles.open]: open })}
          opened={open}
          handleClickOutside={() => this.setState({ open: false })}
          onItemClick={() => this.setState({ open: !open })}
        />
      </React.Fragment>
    );
  }

  renderOptions() {
    const { options, onValueChange } = this.props;
    const { open } = this.state;

    const handleClick = option => {
      onValueChange(option);
      this.setState({ open: false, title: option });
    };

    return open && (
    <ul key="options" className={cx(styles.links, { [styles.open]: open })}>
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
      );
  }

  render() {
    const { positionRight, options, Child } = this.props;

    const element = options && options.length
      ? [ this.renderButton(), this.renderOptions() ]
      : Child && this.renderChild();

    if (!element) return null;

    return (
      <div
        className={cx(styles.dropdown, {
          [styles.positionRight]: positionRight
        })}
      >
        {element}
      </div>
    );
  }
}

NavNestedMenuComponent.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ]),
  onValueChange: PropTypes.func,
  options: PropTypes.array,
  buttonClassName: PropTypes.string,
  positionRight: PropTypes.bool,
  Child: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ])
};

NavNestedMenuComponent.defaultProps = {
  title: {},
  onValueChange: () => {
  },
  options: [],
  buttonClassName: '',
  positionRight: true,
  Child: null
};

export default NavNestedMenuComponent;
