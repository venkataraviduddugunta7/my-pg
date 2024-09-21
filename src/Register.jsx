import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, notification, Form, Row, Col, Input, Layout } from 'antd';
import CustomCard from './CustomCard';
import "./styles.css";
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // Initialize to null
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Create a form instance

    // Handle registration
    const handleRegister = async (values) => {
        setLoading(true);
        if (values.password !== values.confirmPassword) {
            notification.error({ message: 'Passwords do not match' });
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/register', { 
                username: values.username, 
                password: values.password 
            });
            notification.success({ message: 'Succesfully Registered' });
            navigate('/login');
        } catch (error) {
            notification.error({ 
                message: 'Registration failed: ' + (error.response?.data?.message || error.message) 
            });
        } finally {
            setLoading(false);
        }
    };

    // Check username availability
    const checkUsernameAvailability = async (username) => {
        if (username) {
            try {
                const response = await axios.post('http://localhost:5000/check-username', { username });
                setIsUsernameAvailable(response.data.available);
            } catch (error) {
                setIsUsernameAvailable(true); // Assume available on error
            }
        } else {
            setIsUsernameAvailable(null); // Reset to null when empty
        }
    };

    // Handle input change for username
    const handleUsernameChange = (e) => {
        const username = e.target.value;
        form.setFieldsValue({ username });
        if (username) {
            // Debounce the availability check
            clearTimeout(window.checkUsernameTimeout);
            window.checkUsernameTimeout = setTimeout(() => {
                checkUsernameAvailability(username);
            }, 300);
        } else {
            setIsUsernameAvailable(null); // Reset to null when empty
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width:'100%' }}>
            <CustomCard style={{ width: '30vw', borderRadius: '12px', padding: '20px' }}>
                <Typography.Title level={4} align="center">Register</Typography.Title>
                <Form form={form} onFinish={handleRegister} layout="vertical">
                    <Form.Item 
                        name="username" 
                        label="Username" 
                        rules={[{ required: true, message: 'Please input your username!' }]}
                        validateStatus={isUsernameAvailable === false ? 'error' : ''}
                        help={isUsernameAvailable === false ? 'Username is taken' : ''}
                    >
                        <Input
                            prefix={<UserOutlined />}
                             placeholder="Use your Email !"
                            onChange={handleUsernameChange} // Handle input change
                        />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label="Password" 
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<KeyOutlined />} />
                    </Form.Item>
                    <Form.Item 
                        name="confirmPassword" 
                        label="Confirm Password" 
                        rules={[{ required: true, message: 'Please confirm your password!' }]}
                    >
                        <Input.Password prefix={<KeyOutlined />} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={isUsernameAvailable === false} // Disable if not available
                            block
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <Row justify="space-between">
                    <Col>
                        <Button type="link" onClick={() => navigate("/login")}>Already Have an Account?</Button>
                    </Col>
                    <Col>
                        <Button type="link">Forget Password?</Button>
                    </Col>
                </Row>
            </CustomCard>
        </Layout>
    );
};

export default Register;