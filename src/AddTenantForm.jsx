// AddTenantForm.js
import React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddTenantForm = ({ form, onOk, onCancel }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Tenant Name"
        name="name"
        rules={[{ required: true, message: 'Please enter tenant name!' }]}
      >
        <Input placeholder="Enter tenant name" />
      </Form.Item>

      <Form.Item
        label="Room Number"
        name="room"
        rules={[{ required: true, message: 'Please enter room number!' }]}
      >
        <Input placeholder="Enter room number" />
      </Form.Item>

      <Form.Item
        label="Payment Status"
        name="paymentStatus"
        rules={[{ required: true, message: 'Please select payment status!' }]}
      >
        <Select placeholder="Select payment status">
          <Option value="Paid">Paid</Option>
          <Option value="Due">Due</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Joining Date"
        name="joiningDate"
        rules={[{ required: true, message: 'Please enter joining date!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <div style={{ textAlign: 'right' }}>
        <Button type="link" onClick={onCancel} style={{ marginRight: '8px' }}>
          Cancel
        </Button>
        <Button type="primary" onClick={onOk} icon={<PlusOutlined />}>
          Add Tenant
        </Button>
      </div>
    </Form>
  );
};

export default AddTenantForm;
