import React from 'react';
import styles from '@patternfly/patternfly-next/components/Dropdown/dropdown.css';
import { css } from '@patternfly/react-styles';
import PropTypes from 'prop-types';
import { componentShape } from '../../internal/componentShape';
import { DropdownPosition, DropdownContext } from './dropdownConstants';
import FocusTrap from 'focus-trap-react';

const propTypes = {
  /** Anything which can be rendered as dropdown items */
  children: PropTypes.node,
  /** Classess applied to root element of dropdown menu */
  className: PropTypes.string,
  /** Flag to indicate if menu is opened */
  isOpen: PropTypes.bool,
  /** Indicates which component will be used as dropdown menu */
  component: componentShape,
  /** Indicates where menu will be alligned horizontally */
  position: PropTypes.oneOf(Object.values(DropdownPosition)),
  /** Additional props are spread to the container component */
  '': PropTypes.any
};

const defaultProps = {
  children: null,
  className: '',
  isOpen: true,
  position: DropdownPosition.left,
  component: 'ul'
};

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.refsCollection = {};
    this.keyHandler = this.keyHandler.bind(this);
  }

  keyHandler(index, position, custom = false) {
    const kids = this.props.children;
    if (!Array.isArray(kids)) return;
    let nextIndex;
    if (position === 'up') {
      if (index === 0) {
        // loop back to end
        nextIndex = kids.length - 1;
      } else {
        nextIndex = index - 1;
      }
    } else if (index === kids.length - 1) {
      // loop back to beginning
      nextIndex = 0;
    } else {
      nextIndex = index + 1;
    }
    if (this.refsCollection[`item-${nextIndex}`] === null) {
      this.keyHandler(nextIndex, position, custom);
    } else {
      custom
        ? this.refsCollection[`item-${nextIndex}`].current.focus()
        : this.refsCollection[`item-${nextIndex}`].focus();
    }
  }

  sendRef = (index, node, isDisabled) => {
    if (isDisabled || node.getAttribute('role') === 'separator') {
      this.refsCollection[`item-${index}`] = null;
    } else {
      this.refsCollection[`item-${index}`] = node;
    }
  };

  extendChildren() {
    return React.Children.map(this.props.children, (child, index) =>
      React.cloneElement(child, {
        keyHandler: this.keyHandler,
        index,
        sendRef: this.sendRef
      })
    );
  }

  extendCustomChildren() {
    const mappedChildren = React.Children.map(this.props.children, (child, index) => {
      const mappedChild = React.cloneElement(child, {
        ref: React.createRef(),
        tabIndex: index === 0 ? 0 : 1,
        onKeyDown: event => {
          if (event.key === 'Tab') return;
          event.preventDefault();
          if (event.key === 'ArrowUp') {
            this.keyHandler(index, 'up', true);
          } else if (event.key === 'ArrowDown') {
            this.keyHandler(index, 'down', true);
          }
        }
      });
      !mappedChild.props.disabled
        ? (this.refsCollection[`item-${index}`] = mappedChild.ref)
        : (this.refsCollection[`item-${index}`] = null);
      return mappedChild;
    });
    return mappedChildren;
  }

  render() {
    const { className, isOpen, position, children, component: Component, ...props } = this.props;
    let menu = null;
    if (Component === 'div') {
      menu = (
        <DropdownContext.Consumer>
          {onSelect => (
            <Component
              {...props}
              className={css(
                styles.dropdownMenu,
                position === DropdownPosition.right && styles.modifiers.alignRight,
                className
              )}
              hidden={!isOpen}
              onClick={event => onSelect && onSelect(event)}
            >
              {this.extendCustomChildren()}
            </Component>
          )}
        </DropdownContext.Consumer>
      );
    } else if (Component === 'ul') {
      menu = (
        <FocusTrap
          focusTrapOptions={{
            clickOutsideDeactivates: true
          }}
        >
          <Component
            {...props}
            className={css(
              styles.dropdownMenu,
              position === DropdownPosition.right && styles.modifiers.alignRight,
              className
            )}
            hidden={!isOpen}
          >
            {this.extendChildren()}
          </Component>
        </FocusTrap>
      );
    }
    return menu;
  }
}

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export default DropdownMenu;
