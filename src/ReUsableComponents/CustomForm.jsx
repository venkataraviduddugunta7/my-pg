import React from 'react';
import { Form, Input, Button } from 'antd';

const CustomForm = ({ onSubmit, formItems = [] }) => (
  <Form layout="vertical" onFinish={onSubmit}>
    {formItems.map((item) => (
      <Form.Item
        key={item.name}
        label={item.label}
        name={item.name}
        rules={item.rules}
      >
        {item.input}
      </Form.Item>
    ))}
    <Form.Item>
      <Button type="primary" htmlType="submit">Submit</Button>
    </Form.Item>
  </Form>
);

export default CustomForm;
