import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const DashboardStudent = () => {
  const [upcomingChores, setUpcomingChores] = useState([]);
  const [completedChores, setCompletedChores] = useState([]);
  const [serviceHours, setServiceHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentDashboard = async () => {
      try {
        // Fetch upcoming assigned chores
        const upcomingResponse = await api.get('/students/me/chores/upcoming');
        setUpcomingChores(upcomingResponse.data);

        // Fetch completed chores
        const completedResponse = await api.get('/students/me/chores/completed');
        setCompletedChores(completedResponse.data);

        // Fetch service hours
        const profileResponse = await api.get('/students/me');
        setServiceHours(profileResponse.data.service_hours || 0);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDashboard();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="page-title">Student Dashboard</h1>

        {error && <div className="dashboard-error">{error}</div>}

        <div className="dashboard-summary">
          <div className="summary-card">
            <h2 className="summary-title">{upcomingChores.length}</h2>
            <p className="summary-label">Upcoming Chores</p>
          </div>

          <div className="summary-card">
            <h2 className="summary-title">{completedChores.length}</h2>
            <p className="summary-label">Completed Chores</p>
          </div>

          <div className="summary-card">
            <h2 className="summary-title">{serviceHours}</h2>
            <p className="summary-label">Service Hours</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/chores" className="btn btn-primary">Find New Chores</Link>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Upcoming Chores</h2>

          {upcomingChores.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any upcoming chores scheduled.</p>
              <Link to="/chores" className="btn btn-secondary">Find Chores to Help With</Link>
            </div>
          ) : (
            <div className="chore-list">
              {upcomingChores.map((chore) => (
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
                    <Link to={`/chores/${chore.id}`} className="btn btn-primary">View Details</Link>
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
              <p>You haven't completed any chores yet.</p>
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
                      <span className="chore-detail-label">Hours Earned:</span>
                      <span>{Math.round(chore.estimated_duration / 60 * 10) / 10}</span>
                    </div>

                    <div className="chore-detail">
                      <span className="chore-detail-label">For:</span>
                      <span>{chore.senior?.user?.first_name} {chore.senior?.user?.last_name}</span>
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
              <Link to="/history">View All Completed Chores</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardStudent;
