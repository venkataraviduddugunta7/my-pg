import React, { useState } from 'react';
import styled from '@emotion/styled';
import Backdrop from '@mui/material/Backdrop';

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.open ? "0" : "-100%")};
  width: 300px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  transition: right 0.3s ease-in-out;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MenuItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DrawerComponent = ({ isOpen, onClose, items }) => {
  return (
    <>
      <Backdrop
        open={isOpen}
        onClick={onClose}
        sx={{
          zIndex: 1000,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(5px)"
        }}
      />
      <DrawerContainer open={isOpen}>
        {items.map((item, index) => (
          <MenuItem key={index} onClick={() => alert(item.label)}>
            {item.label}
          </MenuItem>
        ))}
      </DrawerContainer>
    </>
  );
};

export default DrawerComponent;
