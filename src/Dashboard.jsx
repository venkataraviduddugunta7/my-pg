// Dashboard.js
import React, { useState } from 'react';
import { Layout, Menu, Table, Typography, Row, Col, Button, Modal, Avatar, Space, Card, Input } from 'antd';
import { UserOutlined, HomeOutlined, DollarOutlined, BellOutlined, SearchOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import CustomCard from './CustomCard';
import AddTenantForm from './AddTenantForm';
import './App.css';
import './CustomModal.css';
import DrawerComponent from "./DrawerComponent";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = ({ username, onLogout }) => {
    const [tenants, setTenants] = useState([
        { key: '1', name: 'John Doe', room: '101', paymentStatus: 'Paid', joiningDate: '2024-09-01' },
        { key: '2', name: 'Jane Smith', room: '102', paymentStatus: 'Due', joiningDate: '2024-09-15' },
        { key: '3', name: 'Mike Johnson', room: '103', paymentStatus: 'Paid', joiningDate: '2024-09-05' },
    ]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };
    const handleSubmit = (values) => {
        console.log('Submitted values:', values);
        handleCloseModal();
    };

    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    const menuItems = [
        { label: "Home" },
        { label: "Trending" },
        { label: "My List" },
        { label: "Settings" },
    ];

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
                    className='customButtonLink'
                    type="link"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    style={{ marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    type='link'
                    className='customButtonLink'
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

    const handleOk = (newTenantData) => {
        const newTenant = {
            key: `${tenants.length + 1}`,
            ...newTenantData,
        };
        setTenants([...tenants, newTenant]);

        fetch('/api/tenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTenant),
        });

        setIsModalVisible(false);
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Sider width={200} className="site-layout-background">
                <div className="logo" style={{
                    height: '64px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'shaded',
                }}>
                    <Title level={4} style={{ color: '#fff', margin: 0 }}>My PG !</Title>
                </div>
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
                <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 0 16px' }}>
                    <Title level={3} style={{ margin: 0 }}>My Dashboard</Title>
                    <Card className="customCard" bodyStyle={{ padding: "0px", margin: "10px" }} >
                        <div className="no-padding-space">
                            <Space>
                                <Avatar icon={<UserOutlined />} />
                                <span>{username}</span>
                                <Button className="customButton" type="primary" onClick={handleLogout}>
                                    Logout
                                    <LogoutOutlined />
                                </Button>
                            </Space>
                        </div>
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
                            <CustomCard title="Available Beds" bordered={false}>
                                <Typography.Title level={2}>2</Typography.Title>
                            </CustomCard>
                        </Col>
                        <Col span={8}>
                            <CustomCard title="Payments Dues" bordered={false}>
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
                            <PlusOutlined style={{ color: "white" }} />
                            New Tenant
                        </Button>
                    </div>

                    <DrawerComponent
                        isOpen={drawerOpen}
                        onClose={toggleDrawer}
                        items={menuItems}
                    />
                </Content>
            </Layout>

            {isModalVisible && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        {/* <div className="custom-modal-header">
              </div> */}
                        <AddTenantForm onSubmit={handleSubmit} />
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;