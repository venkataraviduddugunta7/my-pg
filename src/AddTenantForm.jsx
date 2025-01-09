import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Upload,
    Row,
    Col,
    Radio,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './App.css';
import CustomCard from './CustomCard';

const AddTenantForm = ({ onSubmit, onCancel }) => {
    const [form] = Form.useForm();
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([1]);
    const [fileList, setFileList] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const roomData = [
        { room_id: 1, room_name: '101', beds: [1, 2, 3, 4, 5] },
        { room_id: 2, room_name: '102', beds: [1, 2, 3, 4] },
        { room_id: 3, room_name: '103', beds: [1, 2, 3] },
    ];

    const handlePhotoChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleOk = async () => {
        setSubmitted(true);
        try {
            const values = await form.validateFields();
            values.aadhar = values.aadhar.replace(/-/g, '');
            onSubmit(values);
            form.resetFields();
            setFileList([]);
            setSubmitted(false);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        if (onCancel) onCancel();
        

    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('/api/rooms');
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleRoomChange = async (roomId) => {
        setSelectedRoom(roomId);
        try {
            const response = await fetch(`/api/rooms/${roomId}/beds`);
            const data = await response.json();
            setBeds(data);
        } catch (error) {
            console.error('Error fetching beds:', error);
        }
    };

    const handleInputChange = (e, type) => {
        const { value } = e.target;
        if (type === 'number' && !/^\d*$/.test(value)) {
            e.preventDefault();
        } else if (type === 'text' && !/^[a-zA-Z\s]*$/.test(value)) {
            e.preventDefault();
        }
    };

    return (
        <div className="punched-paper">
            <CustomCard className="add-tenant-form" title={"New Tenant Form"}>
                <Form form={form} layout="vertical">
                    {/* Tenant Name and Photo Upload */}
                    <Row gutter={16}>
                        <Col span={18}>
                            <Form.Item
                                className='poppins'
                                label="Full Name (As per GOVT ID)"
                                name="name"
                                rules={[{ required: submitted, message: 'Please enter tenant name!' }]}
                            >
                                <Input
                                    placeholder="Enter tenant name"
                                    onKeyPress={(e) => handleInputChange(e, 'text')}
                                />
                            </Form.Item>
                            <Row >
                                <Col span={14}>
                                    <Form.Item
                                        className='poppins'
                                        label="Gender"
                                        name="gender"
                                        rules={[{ required: submitted, message: 'Please select gender!' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value="male">Male</Radio>
                                            <Radio value="female">Female</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item
                                        className='poppins'
                                        label="Date of Birth"
                                        name="dateofbirth"
                                        rules={[{ required: submitted, message: 'Please enter date of birth!' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                className='poppins'
                                name="photo"
                                valuePropName="fileList"
                                getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    accept="image/*"
                                    beforeUpload={() => false}
                                    fileList={fileList}
                                    onChange={handlePhotoChange}
                                    showUploadList={{
                                        showPreviewIcon: false,
                                        showRemoveIcon: true,
                                        showDownloadIcon: false,
                                    }}
                                >
                                    {fileList.length < 1 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                                <div className="upload-label">Tenant Photo</div>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Mobile No and Email */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className='poppins'
                                label="Mobile No"
                                name="mobile"
                                rules={[
                                    { required: submitted, message: 'Please enter mobile number!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
                                ]}
                            >
                                <Input
                                    placeholder="Enter mobile number"
                                    maxLength={10}
                                    onKeyPress={(e) => handleInputChange(e, 'number')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className='poppins'
                                label="Email"
                                name="email"
                                rules={[
                                    { type: 'email', message: 'Please enter a valid email!' },
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Aadhar No, Joining Date */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className='poppins'
                                label="Aadhar No"
                                name="aadhar"
                                rules={[
                                    { required: submitted, message: 'Please enter Aadhar number!' },
                                    { pattern: /^[0-9]{12}$/, message: 'Please enter a valid 12-digit Aadhar number!' },
                                ]}
                            >
                                <Input
                                    placeholder="Enter 12-digit Aadhar number"
                                    maxLength={12}
                                    onKeyPress={(e) => handleInputChange(e, 'number')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className='poppins'
                                label="Joining Date"
                                name="joiningDate"
                                rules={[{ required: submitted, message: 'Please enter joining date!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Room Number and Bed Number */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className='poppins'
                                label="Room Number"
                                name="roomId"
                                rules={[{ required: submitted, message: 'Please select a room!' }]}
                            >
                                <Select
                                    placeholder="Select room"
                                    onChange={handleRoomChange}>
                                    {roomData.map((room) => (
                                        <Select.Option key={room.room_id} value={room.room_id}>
                                            {room.room_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className='poppins'
                                label="Bed Number"
                                name="bedId"
                                rules={[{ required: submitted, message: 'Please select a bed!' }]}
                            >
                                <Select placeholder="Select bed">
                                    {selectedRoom &&
                                        roomData
                                            .find((room) => room.room_id === selectedRoom)
                                            ?.beds.map((bed) => (
                                                <Select.Option key={bed} value={bed}>
                                                    Bed {bed}
                                                </Select.Option>
                                            ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Aadhar Upload and Staying Mode */}
                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item className='poppins' label="Upload Aadhar Card">
                                <Upload
                                    className='inter'
                                    name="aadharUpload"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    beforeUpload={() => false}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Aadhar (PNG/JPG/PDF)</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                className='poppins'
                                label="Staying Mode"
                                name="stayingMode"
                                rules={[{ required: submitted, message: 'Please select staying mode!' }]}
                            >
                                <Select placeholder="Select staying mode">
                                    <Select.Option value="daily">Daily</Select.Option>
                                    <Select.Option value="monthly">Monthly</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Address */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                className='poppins'
                                label="Address"
                                name="address"
                            >
                                <Input.TextArea rows={2} placeholder="Enter full address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <div className="form-actions">
                        <Space>
                            <Button type="link" className='customButtonLink' onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="link" className='customButtonLink' onClick={handleOk}>
                                Add Tenant
                            </Button>
                        </Space>
                    </div>
                </Form>
            </CustomCard>
        </div>
    );
};

export default AddTenantForm;

