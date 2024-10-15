import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space } from 'antd';

const AddTenantForm = ({ onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    // Function to restrict input to only numeric characters
    const handleNumberInput = (e) => {
        if (!/^\d*$/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Function to restrict input to only alphabetic characters
    const handleTextInput = (e) => {
        if (!/^[a-zA-Z\s]*$/.test(e.key)) {
            e.preventDefault();
        }
    };

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
            {/* Tenant Name (Accept only alphabetic characters) */}
            <Form.Item
                label="Tenant Name ( As per GOVT ID )"
                name="name"
                rules={[{ required: true, message: 'Please enter tenant name!' }]}
            >
                <Input placeholder="Enter tenant name" onKeyPress={handleTextInput} />
            </Form.Item>

            {/* Mobile No (Accept only numeric characters) */}
            <Form.Item
                label="Mobile No"
                name="mobile"
                rules={[
                    { required: true, message: 'Please enter mobile number!' },
                    { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
                ]}
            >
                <Input placeholder="Enter mobile number" maxLength={10} onKeyPress={handleNumberInput} />
            </Form.Item>

            {/* Aadhar No (Accept only numeric characters, 12 digits) */}
            <Form.Item
                label="Aadhar No"
                name="aadhar"
                rules={[
                    { required: true, message: 'Please enter Aadhar number!' },
                    { pattern: /^[0-9]{12}$/, message: 'Please enter a valid 12-digit Aadhar number!' },
                ]}
            >
                <Input placeholder="Enter Aadhar number" maxLength={12} onKeyPress={handleNumberInput} />
            </Form.Item>

            {/* Email (No restrictions applied here except default validation) */}
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { type: 'email', message: 'Please enter a valid email!' },
                ]}
            >
                <Input placeholder="Enter email" />
            </Form.Item>

            {/* Joining Date (Date picker input) */}
            <Form.Item
                label="Joining Date"
                name="joiningDate"
                rules={[{ required: true, message: 'Please enter joining date!' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            {/* Staying Mode (Select input) */}
            <Form.Item
                label="Staying Mode"
                name="stayingMode"
                rules={[{ required: true, message: 'Please select staying mode!' }]}
            >
                <Select placeholder="Select staying mode">
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                    <Select.Option value="monthly">Monthly</Select.Option>
                </Select>
            </Form.Item>

            {/* Permanent Address (Free text area, no specific restriction) */}
            <Form.Item
                label="Permanent Address"
                name="permanentAddress"
            >
                <Input.TextArea placeholder="Enter permanent address" />
            </Form.Item>

            {/* Room Number (Accept only numeric characters) */}
            <Form.Item
                label="Room Number"
                name="roomNumber"
                rules={[{ required: true, message: 'Please enter room number!' }]}
            >
                <Input placeholder="Enter room number" onKeyPress={handleNumberInput} />
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
