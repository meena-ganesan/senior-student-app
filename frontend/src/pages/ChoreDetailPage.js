import React from 'react';
import { useParams } from 'react-router-dom';
import './AuthPages.css';

function ChoreDetailPage() {
  const { id } = useParams();
  
  return (
    <div className="page-container">
      <h1>Chore Details</h1>
      <p>Viewing chore with ID: {id}</p>
      <p>This page is under construction.</p>
    </div>
  );
}

export default ChoreDetailPage;
