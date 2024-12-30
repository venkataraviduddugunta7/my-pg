import React from 'react';
import { Skeleton } from 'antd';

const CustomSkeleton = ({ loading = true, children, ...props }) => (
  <>
    {loading ? <Skeleton active {...props} /> : children}
  </>
);

export default CustomSkeleton;
