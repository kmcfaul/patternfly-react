import React from 'react';

import {
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Popper,
  MenuToggle,
  TextInputGroup,
  MenuItemProps,
  Button,
  TextInputGroupUtilities,
  TextInputGroupMain,
  MenuToggleElement
} from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import TableIcon from '@patternfly/react-icons/dist/esm/icons/table-icon';

const intitalMenuItems: MenuItemProps[] = [
  { itemId: 'Option 1', children: 'Option 1' },
  { itemId: 'Option 2', children: 'Option 2' },
  { itemId: 'Option 3', children: 'Option 3', icon: <TableIcon aria-hidden /> }
];

export const ComposableTypeaheadSelect: React.FunctionComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [menuItems, setMenuItems] = React.useState<MenuItemProps[]>(intitalMenuItems);
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(null);
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const [isSelected, setIsSelected] = React.useState(false);

  const menuToggleRef = React.useRef<MenuToggleElement>({} as MenuToggleElement);
  const textInputRef = React.useRef<HTMLInputElement>();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<MenuToggleElement>(null);

  React.useEffect(() => {
    let newMenuItems: MenuItemProps[] = intitalMenuItems;

    // Filter menu items based on the text input value when one exists
    if (inputValue) {
      newMenuItems = intitalMenuItems.filter((menuItem) =>
        String(menuItem.children).toLowerCase().includes(inputValue.toLowerCase())
      );

      // When no options are found after filtering, display 'No results found'
      if (!newMenuItems.length) {
        newMenuItems = [{ isDisabled: false, children: `No results found for "${inputValue}"`, itemId: 'no results' }];
      }

      // Open the menu when the input value changes and the new value is not empty
      if (!isMenuOpen) {
        setIsMenuOpen(true);
      }
    }

    setMenuItems(newMenuItems);
    setActiveItem(null);
    setFocusedItemIndex(null);
  }, [inputValue]);

  const focusOnInput = () => textInputRef.current?.focus();

  const onMenuSelect = (_event: React.MouseEvent | undefined, itemId: string | number | undefined) => {
    // Only allow selection if the item is a valid, selectable option
    if (itemId && itemId !== 'no results') {
      setInputValue(itemId.toString());
      setIsSelected(true);
    }

    setIsMenuOpen(false);
    setFocusedItemIndex(null);
    setActiveItem(null);
    focusOnInput();
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isMenuOpen) {
      if (key === 'ArrowUp') {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = menuItems.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === 'ArrowDown') {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (focusedItemIndex === null || focusedItemIndex === menuItems.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus);
      const focusedItem = menuItems.filter((item) => !item.isDisabled)[indexToFocus];
      setActiveItem(`composable-typeahead-${focusedItem.itemId.replace(' ', '-')}`);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = menuItems.filter((menuItem) => !menuItem.isDisabled);
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex ? enabledMenuItems[focusedItemIndex] : firstMenuItem;

    switch (event.key) {
      // Select the first available option
      case 'Enter':
        // Only allow selection if the first item is a valid, selectable option
        if (isMenuOpen && focusedItem.itemId !== 'no results') {
          setInputValue(String(focusedItem.children));
          setIsSelected(true);
        }

        setIsMenuOpen((prevIsOpen) => !prevIsOpen);
        setFocusedItemIndex(null);
        setActiveItem(null);
        focusOnInput();

        break;
      case 'Tab':
      case 'Escape':
        setIsMenuOpen(false);
        setActiveItem(null);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  // Close the menu when a click occurs outside of the menu, toggle, or input
  const onDocumentClick = (event: MouseEvent | undefined) => {
    const isValidClick = [menuRef, menuToggleRef, textInputRef].some((ref) =>
      ref?.current?.contains(event?.target as HTMLElement)
    );
    if (isMenuOpen && !isValidClick) {
      setIsMenuOpen(false);
      setActiveItem(null);
    }
  };

  // Close the menu when focus is on a menu item and Escape or Tab is pressed
  const onDocumentKeydown = (event: KeyboardEvent | undefined) => {
    if (isMenuOpen && menuRef?.current?.contains(event?.target as HTMLElement)) {
      if (event?.key === 'Escape') {
        setIsMenuOpen(false);
        focusOnInput();
      } else if (event?.key === 'Tab') {
        setIsMenuOpen(false);
      }
    }
  };

  const toggleMenuOpen = () => {
    setIsMenuOpen((prevIsOpen) => !prevIsOpen);
    textInputRef.current?.focus();
  };

  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setInputValue(value);
    setIsSelected(false);
  };

  return (
    <Popper
      trigger={
        <MenuToggle
          ref={triggerRef}
          variant="typeahead"
          onClick={toggleMenuOpen}
          innerRef={menuToggleRef}
          isExpanded={isMenuOpen}
          isFullWidth
        >
          <TextInputGroup isPlain>
            <TextInputGroupMain
              value={inputValue}
              onClick={toggleMenuOpen}
              onChange={onTextInputChange}
              onKeyDown={onInputKeyDown}
              id="typeahead-select-input"
              autoComplete="off"
              innerRef={textInputRef}
              {...(activeItem && { 'aria-activedescendant': activeItem })}
              role="combobox"
              isExpanded={isMenuOpen}
              aria-controls="composable-typeahead-listbox"
            />

            <TextInputGroupUtilities>
              {!!inputValue && (
                <Button variant="plain" onClick={() => setInputValue('')} aria-label="Clear input value">
                  <TimesIcon aria-hidden />
                </Button>
              )}
            </TextInputGroupUtilities>
          </TextInputGroup>
        </MenuToggle>
      }
      triggerRef={triggerRef}
      popper={
        <Menu role="listbox" ref={menuRef} id="select-menu" onSelect={onMenuSelect} selected={isSelected && inputValue}>
          <MenuContent>
            <MenuList id="composable-typeahead-listbox">
              {menuItems.map((itemProps, index) => (
                <MenuItem
                  id={`composable-typeahead-${itemProps.itemId.replace(' ', '-')}`}
                  key={itemProps.itemId || itemProps.children}
                  isFocused={focusedItemIndex === index}
                  className={itemProps.className}
                  {...itemProps}
                  ref={null}
                />
              ))}
            </MenuList>
          </MenuContent>
        </Menu>
      }
      popperRef={menuRef}
      isVisible={isMenuOpen}
      onDocumentClick={onDocumentClick}
      onDocumentKeyDown={onDocumentKeydown}
    />
  );
};
