import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CustomSelect = ({ options = [], placeholder, onChange, ...props }) => (
  <Select placeholder={placeholder} onChange={onChange} {...props}>
    {options.map((option) => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ))}
  </Select>
);

export default CustomSelect;
