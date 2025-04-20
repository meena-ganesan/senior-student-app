import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const DashboardSenior = () => {
  const [pendingChores, setPendingChores] = useState([]);
  const [scheduledChores, setScheduledChores] = useState([]);
  const [completedChores, setCompletedChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_needed: '',
    estimated_duration: 60,
    special_instructions: ''
  });

  useEffect(() => {
    const fetchSeniorDashboard = async () => {
      try {
        // Fetch pending chores (no student assigned yet)
        const pendingResponse = await api.get('/seniors/me/chores/pending');
        setPendingChores(pendingResponse.data);

        // Fetch scheduled chores (student assigned, not completed)
        const scheduledResponse = await api.get('/seniors/me/chores/scheduled');
        setScheduledChores(scheduledResponse.data);

        // Fetch completed chores
        const completedResponse = await api.get('/seniors/me/chores/completed');
        setCompletedChores(completedResponse.data);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeniorDashboard();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get senior ID from profile
      const profileResponse = await api.get('/seniors/me');
      const seniorId = profileResponse.data.id;

      // Create the chore
      const choreData = {
        ...formData,
        senior_id: seniorId
      };

      await api.post('/chores/', choreData);

      // Refresh the pending chores list
      const pendingResponse = await api.get('/seniors/me/chores/pending');
      setPendingChores(pendingResponse.data);

      // Reset form
      setFormData({
        title: '',
        description: '',
        date_needed: '',
        estimated_duration: 60,
        special_instructions: ''
      });

      // Hide form
      setShowCreateForm(false);
    } catch (error) {
      setError('Failed to create chore request');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="page-title">Senior Dashboard</h1>

        {error && <div className="dashboard-error">{error}</div>}

        <div className="dashboard-summary">
          <div className="summary-card">
            <h2 className="summary-title">{pendingChores.length}</h2>
            <p className="summary-label">Pending Requests</p>
          </div>

          <div className="summary-card">
            <h2 className="summary-title">{scheduledChores.length}</h2>
            <p className="summary-label">Scheduled Chores</p>
          </div>

          <div className="summary-card">
            <h2 className="summary-title">{completedChores.length}</h2>
            <p className="summary-label">Completed Chores</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Request New Assistance'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-chore-form">
            <h2>Request New Assistance</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Task Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Yard Cleanup, Grocery Shopping, Computer Help"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe what you need help with in detail"
                  required
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="date_needed" className="form-label">When Needed*</label>
                <input
                  type="datetime-local"
                  id="date_needed"
                  name="date_needed"
                  className="form-input"
                  value={formData.date_needed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="estimated_duration" className="form-label">Estimated Duration (minutes)*</label>
                <input
                  type="number"
                  id="estimated_duration"
                  name="estimated_duration"
                  className="form-input"
                  value={formData.estimated_duration}
                  onChange={handleChange}
                  min="15"
                  max="240"
                  step="15"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="special_instructions" className="form-label">Special Instructions</label>
                <textarea
                  id="special_instructions"
                  name="special_instructions"
                  className="form-input"
                  value={formData.special_instructions}
                  onChange={handleChange}
                  placeholder="Any special instructions or details the student should know"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        )}

        <div className="dashboard-section">
          <h2 className="section-title">Scheduled Assistance</h2>

          {scheduledChores.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any scheduled assistance yet.</p>
            </div>
          ) : (
            <div className="chore-list">
              {scheduledChores.map((chore) => (
                <div key={chore.id} className="chore-card">
                  <h3 className="chore-title">{chore.title}</h3>

                  <div className="chore-details">
                    <div className="chore-detail">
                      <span className="chore-detail-label">When:</span>
                      <span>{formatDate(chore.date_needed)}</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Duration:</span>
                      <span>{Math.floor(chore.estimated_duration / 60)} hr {chore.estimated_duration % 60} min</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Student:</span>
                      <span>{chore.student?.user?.first_name} {chore.student?.user?.last_name}</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Status:</span>
                      <span className={`status-badge status-${chore.status.toLowerCase()}`}>
                        {chore.status}
                      </span>
                    </div>
                  </div>

                  <div className="chore-actions">
                    <Link to={`/chores/${chore.id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Pending Requests</h2>

          {pendingChores.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any pending assistance requests.</p>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(true)}
              >
                Request Assistance
              </button>
            </div>
          ) : (
            <div className="chore-list">
              {pendingChores.map((chore) => (
                <div key={chore.id} className="chore-card">
                  <h3 className="chore-title">{chore.title}</h3>

                  <div className="chore-details">
                    <div className="chore-detail">
                      <span className="chore-detail-label">When:</span>
                      <span>{formatDate(chore.date_needed)}</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Duration:</span>
                      <span>{Math.floor(chore.estimated_duration / 60)} hr {chore.estimated_duration % 60} min</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Status:</span>
                      <span className={`status-badge status-${chore.status.toLowerCase()}`}>
                        {chore.status}
                      </span>
                    </div>
                  </div>

                  <div className="chore-actions">
                    <Link to={`/chores/${chore.id}`} className="btn btn-secondary">Edit</Link>
                    <button className="btn btn-tertiary">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Recently Completed</h2>

          {completedChores.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any completed assistance yet.</p>
            </div>
          ) : (
            <div className="chore-list">
              {completedChores.slice(0, 3).map((chore) => (
                <div key={chore.id} className="chore-card completed-chore">
                  <h3 className="chore-title">{chore.title}</h3>

                  <div className="chore-details">
                    <div className="chore-detail">
                      <span className="chore-detail-label">Completed:</span>
                      <span>{formatDate(chore.completed_at)}</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Duration:</span>
                      <span>{Math.floor(chore.estimated_duration / 60)} hr {chore.estimated_duration % 60} min</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">Student:</span>
                      <span>{chore.student?.user?.first_name} {chore.student?.user?.last_name}</span>
                    </div>
                  </div>

                  <div className="chore-actions">
                    <Link to={`/chores/${chore.id}`} className="btn btn-secondary">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {completedChores.length > 3 && (
            <div className="view-all-link">
              <Link to="/history">View All Completed Tasks</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardSenior;
