// src/components/Room/RoomList.jsx

import React from 'react';
import { Table, Button, Tag, Popconfirm } from 'antd';

const RoomList = ({ rooms, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: 'Beds Available',
      dataIndex: 'availableBeds',
      key: 'availableBeds',
      render: (_, record) => (
        <Tag color={record.availableBeds > 0 ? 'green' : 'red'}>
          {`${record.availableBeds} / ${record.totalBeds}`}
        </Tag>
      ),
    },
    {
      title: 'Price per Bed',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => onEdit(record.key)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this room?"
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

  return <Table dataSource={rooms} columns={columns} rowKey="key" />;
};

export default RoomList;
