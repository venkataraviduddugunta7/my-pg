import React from 'react';
import { Card } from 'antd';

const CustomCard = ({ title, extra, children, ...props }) => (
  <Card title={title} extra={extra} {...props}>
    {children}
  </Card>
);

export default CustomCard;
