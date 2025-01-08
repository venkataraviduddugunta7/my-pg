// src/pages/Rooms.jsx

import React, { useState } from 'react';
import { Button } from 'antd';
import RoomList from './components/Room/RoomList';
import RoomForm from './components/Room/RoomForm';

const Rooms = () => {
  const [rooms, setRooms] = useState([
    { key: '1', roomNumber: '101', availableBeds: 2, totalBeds: 4, price: 2500 },
    { key: '2', roomNumber: '102', availableBeds: 0, totalBeds: 3, price: 3000 },
  ]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const handleAdd = () => {
    setSelectedRoom(null);
    setFormVisible(true);
  };

  const handleEdit = (key) => {
    const room = rooms.find((room) => room.key === key);
    setSelectedRoom(room);
    setFormVisible(true);
  };

  const handleDelete = (key) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.key !== key));
  };

  const handleSubmit = (formData) => {
    if (selectedRoom) {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.key === selectedRoom.key ? { ...room, ...formData } : room
        )
      );
    } else {
      const newRoom = { ...formData, key: Date.now().toString() };
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    }
    setFormVisible(false);
  };

  return (
    <div>
      <h1>Room Management</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: '16px' }}>
        Add Room
      </Button>
      <RoomList rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />
      {formVisible && (
        <RoomForm
          onSubmit={handleSubmit}
          initialValues={selectedRoom}
          onCancel={() => setFormVisible(false)}
        />
      )}
    </div>
  );
};

export default Rooms;
