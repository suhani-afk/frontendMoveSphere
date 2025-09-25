import React, { useState } from 'react';
import '../styles/style.css';
import EditPage from './Edit';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  // State for modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null); // null for add, object for edit

  // Data states
  const [inventory, setInventory] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [storage, setStorage] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSave = (data) => {
    if (activeTab === 'inventory') setInventory([...inventory, data]);
    else if (activeTab === 'fleet') setFleet([...fleet, data]);
    else if (activeTab === 'storage') setStorage([...storage, data]);
  };

  const handleEdit = (item, index) => {
    setEditData({ ...item, index });
    setIsEditOpen(true);
  };

  const renderTable = (data, fields) => {
    return (
      <table className="table">
        <thead>
          <tr>
            {fields.map((f, idx) => (
              <th key={idx}>{f}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {fields.map((f, idx) => (
                <td key={idx}>{row[f.toLowerCase()]}</td>
              ))}
              <td>
                <button className="btn btn-primary" onClick={() => handleEdit(row, i)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <section className="section">
      <h2>Company dashboard</h2>
      <p className="muted">
        Connect a Google Sheet or use the in-app table to track inventory, fleet, and storage.
      </p>

      <div className="tabs">
        {['inventory', 'fleet', 'storage'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={() => { setEditData(null); setIsEditOpen(true); }}>
          Add {activeTab === 'inventory' ? 'Item' : activeTab === 'fleet' ? 'Vehicle' : 'Allocation'}
        </button>
      </div>

      {/* Tables */}
      {activeTab === 'inventory' && renderTable(inventory, ['Item', 'Qty', 'Location'])}
      {activeTab === 'fleet' && renderTable(fleet, ['Type', 'ID', 'Status'])}
      {activeTab === 'storage' && renderTable(storage, ['Facility', 'Capacity', 'Used'])}

      {/* Edit Modal */}
      <EditPage
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        editData={editData}
      />
    </section>
  );
};

export default CompanyDashboard;
