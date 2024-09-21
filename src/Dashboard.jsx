import React, { useState } from 'react';
import { Layout, Menu, Table, Card, Typography, Row, Col, Button, Input } from 'antd';
import { UserOutlined, HomeOutlined, DollarOutlined, BellOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import './styles.css';
import CustomCard from './CustomCard';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const tenants = [
    { key: '1', name: 'John Doe', room: '101', paymentStatus: 'Paid', joiningDate: '2024-09-01' },
    { key: '2', name: 'Jane Smith', room: '102', paymentStatus: 'Due', joiningDate: '2024-09-15' },
    { key: '3', name: 'Mike Johnson', room: '103', paymentStatus: 'Paid', joiningDate: '2024-09-05' },
];

const Dashboard = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sider (Menu) */}
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

            {/* Main Content */}
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Title level={3} style={{ margin: '16px', textAlign: 'center' }}>My Dashboard</Title>
                </Header>
                <Content style={{ margin: '16px' }}>
                    {/* Summary Cards */}
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <CustomCard title="Total Tenants" bordered={false}>
                                <Typography.Title level={2}>{tenants.length}</Typography.Title>
                            </CustomCard>
                        </Col>
                        <Col span={8}>
                            <CustomCard title="Rooms Available" bordered={false}>
                                <Typography.Title level={2}>2</Typography.Title> {/* Example data */}
                            </CustomCard>
                        </Col>
                        <Col span={8}>
                            <CustomCard title="Payments Due" bordered={false}>
                                <Typography.Title level={2}>1</Typography.Title> {/* Example data */}
                            </CustomCard>
                        </Col>
                    </Row>

                    {/* Tenants Table */}
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

                    {/* Add New Tenant Button */}
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Button type="primary" size="large" style={{borderRadius:"8px"}}>
                            Add New Tenant
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;