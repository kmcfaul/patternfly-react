import React from 'react';
import { Select, SelectOption, SelectList } from '@patternfly/react-core/next';
import { MenuToggle, MenuToggleElement } from '@patternfly/react-core';

export const SelectCheckbox: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setTimeout(() => {
      if (menuRef.current) {
        const firstElement = menuRef.current.querySelector('li > button:not(:disabled)');
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, itemId: string | number | undefined) => {
    // eslint-disable-next-line no-console
    console.log('selected', itemId);

    if (selectedItems.includes(itemId as number)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId as number]);
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: '200px'
        } as React.CSSProperties
      }
    >
      Filter by status
    </MenuToggle>
  );

  return (
    <Select
      ref={menuRef}
      isOpen={isOpen}
      selected={selectedItems}
      onSelect={onSelect}
      onOpenChange={(nextOpen: boolean) => setIsOpen(nextOpen)}
      toggle={toggle}
    >
      <SelectList>
        <SelectOption hasCheck itemId={0} isSelected={selectedItems.includes(0)}>
          Debug
        </SelectOption>
        <SelectOption hasCheck itemId={1} isSelected={selectedItems.includes(1)}>
          Info
        </SelectOption>
        <SelectOption hasCheck itemId={2} isSelected={selectedItems.includes(2)}>
          Warn
        </SelectOption>
        <SelectOption hasCheck isDisabled itemId={4} isSelected={selectedItems.includes(4)}>
          Error
        </SelectOption>
      </SelectList>
    </Select>
  );
};
