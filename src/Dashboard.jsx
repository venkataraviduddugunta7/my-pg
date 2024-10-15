import React, { useState } from 'react';
import { Layout, Menu, Table, Typography, Row, Col, Button, Modal, Avatar, Dropdown, Space, Form, Input, Select, DatePicker, Card } from 'antd';
import { UserOutlined, HomeOutlined, DollarOutlined, BellOutlined, SearchOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import CustomCard from './CustomCard';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Text } = Typography;

const Dashboard = ({ username, onLogout }) => {
    const [tenants, setTenants] = useState([
        { key: '1', name: 'John Doe', room: '101', paymentStatus: 'Paid', joiningDate: '2024-09-01' },
        { key: '2', name: 'Jane Smith', room: '102', paymentStatus: 'Due', joiningDate: '2024-09-15' },
        { key: '3', name: 'Mike Johnson', room: '103', paymentStatus: 'Paid', joiningDate: '2024-09-05' },
    ]);
    
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    

    const handleLogout = () => {
        onLogout(); // Call the passed logout function (e.g., clear session, token)
        navigate('/login'); // Navigate to login page after logout
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Button
                    className='customButton'
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                  
                    style={{ marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    className='customButton'
                    onClick={() => handleReset(clearFilters)}
                  
                  
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => {
                    const searchButton = document.querySelector('.ant-table-filter-dropdown-btns .ant-btn-primary');
                    if (searchButton) { 
                        searchButton.focus(); 
                    }
                }, 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Room',
            dataIndex: 'room',
            key: 'room',
            sorter: (a, b) => a.room.localeCompare(b.room),
            ...getColumnSearchProps('room'),
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
            filters: [
                { text: 'Paid', value: 'Paid' },
                { text: 'Due', value: 'Due' },
            ],
            onFilter: (value, record) => record.paymentStatus === value,
        },
        {
            title: 'Joining Date',
            dataIndex: 'joiningDate',
            key: 'joiningDate',
            sorter: (a, b) => new Date(a.joiningDate) - new Date(b.joiningDate),
        },
    ];

    

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleAddTenant = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        
        // Add new tenant to state
        const newTenant = {
            key: `${tenants.length + 1}`, // Unique key generation
            ...values
        };
        setTenants([...tenants, newTenant]); // Update state with new tenant

        // Send the data to the backend (replace with your actual API endpoint)
        await fetch('/api/tenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTenant),
        });

        form.resetFields();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="dashboard" icon={<HomeOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="tenants" icon={<UserOutlined />}>
                        Tenants
                    </Menu.Item>
                    <Menu.Item key="payments" icon={<DollarOutlined />}>
                        Payments
                    </Menu.Item>
                    <Menu.Item key="reminders" icon={<BellOutlined />}>
                        Reminders
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                    <Title level={3} style={{ margin: 0 }}>My Dashboard</Title>
                    <Card className="customCard" bodyStyle={{ padding: "0px", margin:"10px" }} 
                    >
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <span>{username}</span>
                        <Button className="customButton" type="primary" onClick={handleLogout}>
                        Logout
                        <LogoutOutlined />
                        </Button>
                    </Space>
                    </Card>
                </Header>

                <Content style={{ margin: '16px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <CustomCard title="Total Tenants" bordered={false}>
                                <Typography.Title level={2}>{tenants.length}</Typography.Title>
                            </CustomCard>
                        </Col>
                        <Col span={8}>
                            <CustomCard title="Rooms Available" bordered={false}>
                                <Typography.Title level={2}>2</Typography.Title>
                            </CustomCard>
                        </Col>
                        <Col span={8}>
                            <CustomCard title="Payments Due" bordered={false}>
                                <Typography.Title level={2}>1</Typography.Title>
                            </CustomCard>
                        </Col>
                    </Row>

                    <div style={{ marginTop: "15px" }}>
                        <CustomCard title="Tenant Information">
                            <Table 
                                columns={columns} 
                                dataSource={tenants} 
                                pagination={false} 
                                style={{ borderRadius: "10px" }} 
                            />
                        </CustomCard>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Button className="customButton" type="primary" size="large" style={{ borderRadius: "8px" }} onClick={handleAddTenant}>
                            <PlusOutlined style={{color:"white"}}/>
                             New Tenant
                        </Button>
                    </div>
                </Content>
            </Layout>

            <Modal
                title="New Tenant"
                visible={isModalVisible}
                closable={false}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button   className='customButtonLink' key="cancel" type= "link" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button className="customButtonLink" key="submit" type="link" onClick={handleOk}>
                        Add Tenant
                    </Button>,
                ]}
            >
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
                </Form>
            </Modal>
        </Layout>
    );
};

export default Dashboard;
