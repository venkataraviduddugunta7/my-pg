// src/components/Payment/PaymentManagement.jsx

import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Form, InputNumber, Select } from 'antd';

const { Option } = Select;

const PaymentManagement = ({ tenants }) => {
  const [paymentData, setPaymentData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Tenant Name',
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: 'Room Number',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: 'Payment Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Paid' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${amount}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showPaymentModal(record.tenantName, record.roomNumber)}
        >
          Add Payment
        </Button>
      ),
    },
  ];

  const showPaymentModal = (tenantName, roomNumber) => {
    form.setFieldsValue({ tenantName, roomNumber });
    setIsModalVisible(true);
  };

  const handleAddPayment = (values) => {
    setPaymentData((prevData) => [...prevData, { ...values, status: 'Paid' }]);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <h1>Payment Management</h1>
      <Table
        dataSource={paymentData}
        columns={columns}
        rowKey={(record) => `${record.tenantName}-${record.roomNumber}`}
      />

      <Modal
        title="Add Payment"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPayment}>
          <Form.Item
            label="Tenant Name"
            name="tenantName"
            rules={[{ required: true, message: 'Please select a tenant' }]}
          >
            <Select placeholder="Select Tenant">
              {tenants.map((tenant) => (
                <Option key={tenant.name} value={tenant.name}>
                  {tenant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Room Number"
            name="roomNumber"
            rules={[{ required: true, message: 'Please enter a room number' }]}
          >
            <InputNumber placeholder="Room Number" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please enter an amount' }]}
          >
            <InputNumber placeholder="Payment Amount" style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Payment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
