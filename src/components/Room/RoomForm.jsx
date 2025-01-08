// src/components/Room/RoomForm.jsx

import React from 'react';
import { Form, InputNumber, Button } from 'antd';

const RoomForm = ({ onSubmit, initialValues = {}, onCancel }) => {
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
        label="Room Number"
        name="roomNumber"
        rules={[{ required: true, message: 'Please enter the room number' }]}
      >
        <InputNumber placeholder="Room Number" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Total Beds"
        name="totalBeds"
        rules={[{ required: true, message: 'Please enter the total number of beds' }]}
      >
        <InputNumber placeholder="Total Beds" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Available Beds"
        name="availableBeds"
        rules={[
          { required: true, message: 'Please enter the number of available beds' },
        ]}
      >
        <InputNumber placeholder="Available Beds" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Price per Bed"
        name="price"
        rules={[{ required: true, message: 'Please enter the price per bed' }]}
      >
        <InputNumber placeholder="Price per Bed" style={{ width: '100%' }} />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default RoomForm;
