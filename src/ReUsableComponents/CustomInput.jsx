import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const CustomInput = ({ placeholder, rows = 4, value, onChange, ...props }) => (
  <TextArea placeholder={placeholder} rows={rows} value={value} onChange={onChange} {...props} />
);

export default CustomInput;
