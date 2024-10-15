// AddTenantForm.js
import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space } from 'antd';

const AddTenantForm = ({ onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values); // Pass the form data to the parent component
            form.resetFields();
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

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
                    <Select.Option value="Paid">Paid</Select.Option>
                    <Select.Option value="Due">Due</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Joining Date"
                name="joiningDate"
                rules={[{ required: true, message: 'Please enter joining date!' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}> 
                <Space>
                    <Button className='customButtonLink' type="link" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button className="customButtonLink" type="link" onClick={handleOk}>
                        Add Tenant
                    </Button>
                </Space>
            </div>
        </Form>
    );
};

export default AddTenantForm;