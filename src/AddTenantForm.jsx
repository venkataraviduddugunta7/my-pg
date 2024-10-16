import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Upload, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddTenantForm = ({ onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    const [email, setEmail] = useState('');
    const [aadhar, setAadhar] = useState('');

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
            await form.validateFields();
            const values = form.getFieldsValue();
            values.aadhar = values.aadhar.replace(/-/g, '');
            onSubmit(values);
            form.resetFields(); 
            setEmail('');
            setAadhar(''); 
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };
    const handleCancel = () => {
        form.resetFields();  // Reset form fields
        setEmail('');        // Clear email state
        setAadhar('');       // Clear aadhar state
        if (onCancel) onCancel(); // Trigger the onCancel callback if provided
    };

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '18px', border: '1px solid #d9d9d9', borderRadius: '8px', backgroundColor: '#fff' }}>
            {/* Header */}
            <Form form={form} layout="vertical" validateTrigger="onSubmit">
                {/* Row 1: Tenant Name (Full width) and Photo Upload */}
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            label="Full Name ( As per GOVT ID )"
                            name="name"
                            rules={[{ required: true, message: 'Please enter tenant name!' }]}
                            validateTrigger="onSubmit"  // Validate on submit only
                        >
                            <Input placeholder="Enter tenant name" onKeyPress={handleTextInput} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Upload
                                label="PHOTO"
                                listType="picture-card"
                                maxCount={1}
                                accept="image/*"
                                beforeUpload={() => false}
                            >
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 2: Mobile No and Aadhar No */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mobile No"
                            name="mobile"
                            rules={[
                                { required: true, message: 'Please enter mobile number!' },
                                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
                            ]}
                            validateTrigger="onSubmit"  // Validate on submit only
                        >
                            <Input placeholder="Enter mobile number" maxLength={10} onKeyPress={handleNumberInput} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item
                        label="Aadhar No"
                        name="aadhar"
                        rules={[
                            { required: true, message: 'Please enter Aadhar number!' },
                            { pattern: /^[0-9]{12}$/, message: 'Please enter a valid 12-digit Aadhar number!' },
                        ]}
                    >
                        <Input
                            placeholder="Enter 12-digit Aadhar number"
                            maxLength={12}  // Allow up to 12 digits
                        />
                    </Form.Item>


                    </Col>
                </Row>

                {/* Row 3: Aadhar Upload */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Upload Aadhar Card">
                            <Upload
                                name="aadharUpload"
                                accept=".png,.jpg,.jpeg,.pdf"
                                beforeUpload={() => false} // Disable automatic upload
                            >
                                <Button icon={<UploadOutlined />}>Upload Aadhar (PNG/JPG/PDF)</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 4: Email, Joining Date */}
                <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Joining Date"
                            name="joiningDate"
                            rules={[{ required: true, message: 'Please enter joining date!' }]}
                            validateTrigger="onSubmit"  // Validate on submit only
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 5: Staying Mode, Permanent Address */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Staying Mode"
                            name="stayingMode"
                            rules={[{ required: true, message: 'Please select staying mode!' }]}
                            validateTrigger="onSubmit"  // Validate on submit only
                        >
                            <Select placeholder="Select staying mode">
                                <Select.Option value="daily">Daily</Select.Option>
                                <Select.Option value="weekly">Weekly</Select.Option>
                                <Select.Option value="monthly">Monthly</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Permanent Address"
                            name="permanentAddress"
                        >
                            <Input.TextArea placeholder="Enter permanent address" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 6: Room Number */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Room Number"
                            name="roomNumber"
                            rules={[{ required: true, message: 'Please enter room number!' }]}
                            validateTrigger="onSubmit"  // Validate on submit only
                        >
                            <Input placeholder="Enter room number" onKeyPress={handleNumberInput} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <Space>
                        <Button className='customButtonLink' type="link" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button className="customButtonLink" type="link" onClick={handleOk}>
                            Add Tenant
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default AddTenantForm;
