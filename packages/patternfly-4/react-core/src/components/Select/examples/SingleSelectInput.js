import React from 'react';
import { Select, SelectOption } from '@patternfly/react-core';

class SingleSelectInput extends React.Component {
  options = [
    { value: 'Choose...', disabled: false, isPlaceholder: true },
    { value: 'Mr', disabled: false },
    { value: 'Miss', disabled: false },
    { value: 'Mrs', disabled: false },
    { value: 'Ms', disabled: false },
    { value: 'Dr', disabled: false },
    { value: 'Other', disabled: false }
  ];

  state = {
    isExpanded: false,
    selected: null
  };

  onToggle = isExpanded => {
    this.setState({
      isExpanded
    });
  };

  onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) this.clearSelection();
    else {
      this.setState({
        selected: selection,
        isExpanded: false
      });
      console.log('selected:', selection);
    }
  };

  clearSelection = () => {
    this.setState({
      selected: null,
      isExpanded: false
    });
  };

  render() {
    const { isExpanded, selected } = this.state;
    return (
      <div>
        <Select
          variant="single"
          aria-label="Select Input"
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          selections={selected}
          isExpanded={isExpanded}
        >
          {this.options.map((option, index) => (
            <SelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
              isPlaceholder={option.isPlaceholder}
            />
          ))}
        </Select>
      </div>
    );
  }
}

export default SingleSelectInput;
