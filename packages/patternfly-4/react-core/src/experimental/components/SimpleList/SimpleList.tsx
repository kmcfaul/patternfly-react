import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/SimpleList/simple-list';
import { SimpleListGroup } from './SimpleListGroup';
import { SimpleListItemProps } from './SimpleListItem';

export interface SimpleListProps {
  /** Content rendered inside the SimpleList */
  children?: React.ReactNode;
  /** Additional classes added to the SimpleList <ul> */
  className?: string;
  /** Callback when an item is selected */
  onSelect?: (
    ref: React.RefObject<HTMLButtonElement> | React.RefObject<HTMLAnchorElement>,
    props: SimpleListItemProps
  ) => void;
  /** Id of the SimpleList */
  id?: string;
}

export interface SimpleListState {
  /** Ref of the current SimpleListItem */
  currentRef: React.RefObject<HTMLButtonElement> | React.RefObject<HTMLAnchorElement>;
}

interface SimpleListContextProps {
  currentRef: React.RefObject<HTMLButtonElement> | React.RefObject<HTMLAnchorElement>;
  updateCurrentRef: (
    id: React.RefObject<HTMLButtonElement> | React.RefObject<HTMLAnchorElement>,
    props: SimpleListItemProps
  ) => void;
}

export const SimpleListContext = React.createContext<Partial<SimpleListContextProps>>({});

export class SimpleList extends React.Component<SimpleListProps, SimpleListState> {
  static hasWarnBeta = false;
  state = {
    currentRef: null as React.RefObject<HTMLButtonElement> | React.RefObject<HTMLAnchorElement>
  };

  static defaultProps: SimpleListProps = {
    children: null as React.ReactNode,
    className: ''
  };

  componentDidMount() {
    if (!SimpleList.hasWarnBeta && process.env.NODE_ENV !== 'production') {
      console.warn('This component is in beta and subject to change.');
      SimpleList.hasWarnBeta = true;
    }
  }

  handleCurrentUpdate = (
    newCurrentRef: React.RefObject<HTMLButtonElement> | React.RefObject<HTMLAnchorElement>,
    itemProps: SimpleListItemProps
  ) => {
    this.setState({ currentRef: newCurrentRef });
    const { onSelect } = this.props;
    onSelect && onSelect(newCurrentRef, itemProps);
  };

  render() {
    const { children, className, onSelect, id, ...props } = this.props;

    let isGrouped = false;
    if (children) {
      isGrouped = (React.Children.toArray(children)[0] as React.ReactElement).type === SimpleListGroup;
    }

    return (
      <SimpleListContext.Provider
        value={{
          currentRef: this.state.currentRef,
          updateCurrentRef: this.handleCurrentUpdate
        }}
      >
        <div className={css(styles.simpleList)} id={id} {...props}>
          {isGrouped && children}
          {!isGrouped && <ul>{children}</ul>}
        </div>
      </SimpleListContext.Provider>
    );
  }
}
