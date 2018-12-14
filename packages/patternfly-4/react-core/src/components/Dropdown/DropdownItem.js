import React from 'react';
import styles from '@patternfly/patternfly-next/components/Dropdown/dropdown.css';
import { css } from '@patternfly/react-styles';
import PropTypes from 'prop-types';
import { componentShape } from '../../internal/componentShape';

const propTypes = {
  /** Anything which can be rendered as dropdown item */
  children: PropTypes.node,
  /** Classes applied to root element of dropdown item */
  className: PropTypes.string,
  /** Indicates which component will be used as dropdown item */
  component: componentShape,
  /** Render dropdown item as disabled option */
  isDisabled: PropTypes.bool,
  /** Forces display of the hover state of the element */
  isHovered: PropTypes.bool,
  /** Default hyperlink location */
  href: PropTypes.string,
  keyHandler: PropTypes.func,
  index: PropTypes.number,
  sendRef: PropTypes.func
};

const defaultProps = {
  children: null,
  className: '',
  isHovered: false,
  component: 'a',
  isDisabled: false,
  href: '#',
  keyHandler: () => undefined,
  index: -1,
  sendRef: () => undefined
};

class DropdownItem extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.props.sendRef(this.props.index, this.ref, this.props.isDisabled);
  }

  onKeyDown = event => {
    // Detected key press on this item, notify the menu parent so that the appropriate
    // item can be focused
    if (event.key === 'Tab') return;
    event.preventDefault();
    if (event.key === 'ArrowUp') {
      console.log('arrow up pressed');
      this.props.keyHandler(this.props.index, 'up');
    } else if (event.key === 'ArrowDown') {
      console.log('arrow down pressed');
      this.props.keyHandler(this.props.index, 'down');
    }
  };

  render() {
    const {
      className,
      children,
      isHovered,
      keyHandler,
      component: Component,
      isDisabled,
      index,
      sendRef,
      ...props
    } = this.props;
    const additionalProps = props;
    if (Component === 'a') {
      additionalProps['aria-disabled'] = isDisabled;
      additionalProps.tabIndex = isDisabled ? -1 : additionalProps.tabIndex;
    } else if (Component === 'button') {
      additionalProps.disabled = isDisabled;
    }
    return (
      <li>
        <Component
          {...additionalProps}
          className={css(isDisabled && styles.modifiers.disabled, isHovered && styles.modifiers.hover, className)}
          onKeyDown={this.onKeyDown}
          ref={ref => (this.ref = ref)}
        >
          {children}
        </Component>
      </li>
    );
  }
}

DropdownItem.propTypes = propTypes;
DropdownItem.defaultProps = defaultProps;

export default DropdownItem;
