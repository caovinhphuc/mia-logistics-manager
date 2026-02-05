import React, { useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface AutocompleteAddressProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const mockAddresses = [
  'Hà Nội, Việt Nam',
  'Quận Ba Đình, Hà Nội, Việt Nam',
  'Phường Phúc Xá, Quận Ba Đình, Hà Nội, Việt Nam',
  'TP. Hồ Chí Minh, Việt Nam',
  'Quận 1, TP. Hồ Chí Minh, Việt Nam',
  'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam',
  'Đà Nẵng, Việt Nam',
  'Quận Hải Châu, Đà Nẵng, Việt Nam',
  'Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng, Việt Nam',
  'Cần Thơ, Việt Nam',
  'Quận Ninh Kiều, Cần Thơ, Việt Nam',
  'Phường An Cư, Quận Ninh Kiều, Cần Thơ, Việt Nam',
];

const AutocompleteAddress: React.FC<AutocompleteAddressProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const filteredOptions = mockAddresses.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Autocomplete
      freeSolo
      options={filteredOptions}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue || '');
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
          {option}
        </Box>
      )}
    />
  );
};

export default AutocompleteAddress;
