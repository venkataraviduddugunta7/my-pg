import React from 'react';
import PaymentManagement from '../components/Payment/PaymentManagement';

const Payments = () => {
  const tenants = [
    { name: 'John Doe', roomNumber: '101' },
    { name: 'Jane Smith', roomNumber: '102' },
    { name: 'Sam Wilson', roomNumber: '201' },
  ];

  return (
    <div>
      <PaymentManagement tenants={tenants} />
    </div>
  );
};

export default Payments;
