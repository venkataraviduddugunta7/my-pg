import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard';

const Dashboard = () => {
  const stats = {
    totalTenants: 50,
    availableRooms: 10,
    totalRevenue: 125000,
    paymentReminders: 5,
    occupancyRate: 83,
  };

  const notifications = [
    'Payment due for Room 101',
    'New booking request for Room 202',
    'Tenant John Doe moved out today',
  ];

  return (
    <div>
      <Dashboard stats={stats} notifications={notifications} />
    </div>
  );
};

export default Dashboard;
