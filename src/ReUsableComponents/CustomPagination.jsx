import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({ total, current, onChange, ...props }) => (
  <Pagination total={total} current={current} onChange={onChange} {...props} />
);

export default CustomPagination;
