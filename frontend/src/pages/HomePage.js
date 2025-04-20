import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Connecting Generations Through Service</h1>
            <p className="hero-description">
              Student-Senior Connect brings together high school students and seniors in the community,
              creating meaningful relationships while helping with everyday tasks.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary hero-btn">Get Started</Link>
              <Link to="/about" className="btn btn-secondary hero-btn">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Sign Up</h3>
              <p className="step-description">
                Create an account as a student volunteer or a senior in need of assistance.
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Connect</h3>
              <p className="step-description">
                Seniors post tasks they need help with, and students can browse and accept tasks.
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Help Out</h3>
              <p className="step-description">
                Students complete tasks for seniors, building relationships while earning volunteer hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">Why Join Our Community?</h2>
              
              <div className="benefit-item">
                <h3 className="benefit-title">For Students</h3>
                <ul className="benefit-list">
                  <li>Earn volunteer hours for school or college applications</li>
                  <li>Develop valuable skills and experience</li>
                  <li>Build meaningful relationships with seniors</li>
                  <li>Make a positive impact in your community</li>
                </ul>
              </div>
              
              <div className="benefit-item">
                <h3 className="benefit-title">For Seniors</h3>
                <ul className="benefit-list">
                  <li>Get help with household chores and errands</li>
                  <li>Connect with energetic and enthusiastic young people</li>
                  <li>Share your wisdom and experiences</li>
                  <li>Remain more independent in your home</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Connect?</h2>
          <p className="cta-description">
            Join our community today and be part of a movement that brings generations together.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary cta-btn">Sign Up Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
