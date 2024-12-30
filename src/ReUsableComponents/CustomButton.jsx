import React from 'react';
import { Button } from 'antd';

const CustomButton = ({ type = "primary", danger = false, loading = false, children, ...props }) => (
  <Button type={type} danger={danger} loading={loading} {...props}>
    {children}
  </Button>
);

export default CustomButton;
