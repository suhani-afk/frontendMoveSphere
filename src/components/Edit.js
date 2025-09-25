import React, { useState } from 'react';
import '../styles/style.css';

const EditPage = ({ isOpen, onClose, onSave, editData }) => {
  // editData can be empty (add) or contain existing info (update)
  const [name, setName] = useState(editData?.name || '');
  const [type, setType] = useState(editData?.type || 'Warehouse');
  const [location, setLocation] = useState(editData?.location || '');
  const [capacity, setCapacity] = useState(editData?.capacity || '');
  const [price, setPrice] = useState(editData?.price || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, type, location, capacity, price };
    onSave(data);
    onClose();
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>{editData ? 'Edit Entry' : 'Add New Entry'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />

          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Warehouse">Warehouse</option>
            <option value="Harbour">Harbour</option>
            <option value="Depot">Depot</option>
          </select>

          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Address"
            required
          />

          <label>Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Capacity in units"
            required
          />

          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per unit"
            required
          />

          <div className="edit-modal-buttons">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
