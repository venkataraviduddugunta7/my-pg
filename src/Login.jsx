import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, notification, Form, Layout, Row, Col,Input, } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import {TextField} from "@mui/material";
import CustomCard from './CustomCard';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSuccessfulLogin }) => { // Receive the callback prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/login', { // Updated to port 5001
                username: values.username,
                password: values.password,
            });
            notification.success({ message: response.data.message });

            // Call the callback to update authentication state in the parent
            onSuccessfulLogin(values.username);

            navigate("/dashboard"); 
        } catch (error) {
            notification.error({
                message: 'Login failed: ' + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <CustomCard style={{ width: '30vw', borderRadius: '12px', padding: '20px' }}>
                <Typography.Title level={4} align="center">Login</Typography.Title>
                <Form onFinish={handleLogin} layout="vertical">
                    <Form.Item 
                        name="username" 
                        label="Username" 
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                        prefix={<UserOutlined />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label="Password" 
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined/>}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <Row justify="space-between">
                    <Col>
                        <Button type="link" onClick={() => navigate("/register")}>Don't Have an Account?</Button>
                    </Col>
                    <Col>
                        <Button type="link">Forget Password?</Button>
                    </Col>
                </Row>
            </CustomCard>
        </Layout>
    );
};

export default Login;
