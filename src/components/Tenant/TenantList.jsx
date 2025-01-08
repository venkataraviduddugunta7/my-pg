// src/components/Tenant/TenantList.jsx

import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm } from 'antd';

const TenantList = ({ tenants, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Room Number',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() => onEdit(record.key)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this tenant?"
            onConfirm={() => onDelete(record.key)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Table
      dataSource={tenants}
      columns={columns}
      rowKey="key"
    />
  );
};

export default TenantList;
