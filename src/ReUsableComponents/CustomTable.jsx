import React from 'react';
import { Table } from 'antd';

const CustomTable = ({ columns, dataSource, ...props }) => (
  <Table columns={columns} dataSource={dataSource} {...props} />
);

export default CustomTable;
