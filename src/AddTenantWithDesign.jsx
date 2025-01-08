import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import './App.css';

const { Option } = Select;

const AddTenantWithDesign = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="form-container">
      <div className="paper-style">
        <h1 className="form-title">Add Tenant Form</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="tenant-form"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter the tenant name' }]}
          >
            <Input placeholder="Enter tenant name" />
          </Form.Item>

          <Form.Item
            label="Room Number"
            name="roomNumber"
            rules={[{ required: true, message: 'Please enter a room number' }]}
          >
            <Input placeholder="Enter room number" />
          </Form.Item>

          <Form.Item
            label="Date of Joining"
            name="dateOfJoining"
            rules={[{ required: true, message: 'Please select the joining date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Contact Number"
            name="contactNumber"
            rules={[{ required: true, message: 'Please enter a contact number' }]}
          >
            <Input placeholder="Enter contact number" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddTenantWithDesign;
