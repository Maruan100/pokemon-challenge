// filepath: /pokemon-challenge/pokemon-challenge/src/app/components/drop-down.tsx
import React from 'react';

interface DropDownProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const DropDown: React.FC<DropDownProps> = ({ options, selectedOptions, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter(option => option !== value)
      : [...selectedOptions, value];

    onChange(newSelectedOptions);
  };

  return (
    <select multiple value={selectedOptions} onChange={handleChange}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropDown;