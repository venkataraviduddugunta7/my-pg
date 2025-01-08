// src/pages/Tenants.jsx

import React, { useState } from 'react';
import TenantList from './components/Tenant/TenantList';
import TenantForm from './components/Tenant/TenantForm';

const Tenants = () => {
  const [tenants, setTenants] = useState([
    { key: '1', name: 'John Doe', roomNumber: '101', contact: '1234567890' },
    { key: '2', name: 'Jane Smith', roomNumber: '102', contact: '9876543210' },
  ]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const handleAdd = () => {
    setSelectedTenant(null);
    setFormVisible(true);
  };

  const handleEdit = (key) => {
    const tenant = tenants.find((tenant) => tenant.key === key);
    setSelectedTenant(tenant);
    setFormVisible(true);
  };

  const handleDelete = (key) => {
    setTenants((prevTenants) => prevTenants.filter((tenant) => tenant.key !== key));
  };

  const handleSubmit = (formData) => {
    if (selectedTenant) {
      // Edit existing tenant
      setTenants((prevTenants) =>
        prevTenants.map((tenant) =>
          tenant.key === selectedTenant.key ? { ...tenant, ...formData } : tenant
        )
      );
    } else {
      // Add new tenant
      const newTenant = { ...formData, key: Date.now().toString() };
      setTenants((prevTenants) => [...prevTenants, newTenant]);
    }
    setFormVisible(false);
  };

  return (
    <div>
      <h1>Tenants Management</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: '16px' }}>
        Add Tenant
      </Button>
      <TenantList tenants={tenants} onEdit={handleEdit} onDelete={handleDelete} />
      {formVisible && (
        <TenantForm
          onSubmit={handleSubmit}
          initialValues={selectedTenant}
          onCancel={() => setFormVisible(false)}
        />
      )}
    </div>
  );
};

export default Tenants;
