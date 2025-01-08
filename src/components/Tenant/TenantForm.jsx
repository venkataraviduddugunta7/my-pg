// src/components/Tenant/TenantForm.jsx

import React from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const TenantForm = ({ onSubmit, initialValues = {}, onCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Tenant Name"
        name="name"
        rules={[{ required: true, message: 'Please enter tenant name' }]}
      >
        <Input placeholder="Enter tenant's full name" />
      </Form.Item>

      <Form.Item
        label="Contact Number"
        name="contact"
        rules={[
          { required: true, message: 'Please enter a contact number' },
          { pattern: /^[0-9]{10}$/, message: 'Contact number must be 10 digits' },
        ]}
      >
        <Input placeholder="Enter contact number" />
      </Form.Item>

      <Form.Item
        label="Room Number"
        name="roomNumber"
        rules={[{ required: true, message: 'Please select a room number' }]}
      >
        <Select placeholder="Select room number">
          <Option value="101">101</Option>
          <Option value="102">102</Option>
          <Option value="103">103</Option>
        </Select>
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button onClick={onCancel} style={{ marginRight: '8px' }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default TenantForm;
