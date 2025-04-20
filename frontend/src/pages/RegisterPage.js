import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // Student specific fields
    schoolName: '',
    grade: '',
    skills: '',
    parentConsent: false,
    // Senior specific fields
    needs: '',
    mobilityStatus: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, error, setError } = useAuth();
  const navigate = useNavigate();



  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const validateStep2 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setErrorMessage('');

    if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const validateStep3 = () => {
    const requiredFields = [
      'firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode'
    ];

    if (userType === 'student') {
      requiredFields.push('schoolName', 'grade', 'skills');
      if (!formData.parentConsent) {
        setErrorMessage('Parent consent is required for students');
        return false;
      }
    } else if (userType === 'senior') {
      requiredFields.push('needs', 'mobilityStatus', 'emergencyContactName', 'emergencyContactPhone');
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(`Please fill in all required fields`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setError('');

    if (!validateStep3()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for backend
      const userData = {
        email: formData.email,
        password: formData.password,
        user_type: userType,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      };

      // Add student-specific fields if user is a student
      if (userType === 'student' && formData.schoolName && formData.grade && formData.skills) {
        userData.student_profile = {
          school_name: formData.schoolName,
          grade: parseInt(formData.grade),
          skills: formData.skills,
          parent_consent: formData.parentConsent || false
        };
      }

      // Add senior-specific fields if user is a senior
      if (userType === 'senior' && formData.needs && formData.mobilityStatus) {
        userData.senior_profile = {
          needs: formData.needs,
          mobility_status: formData.mobilityStatus,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone
        };
      }

      console.log('Registering user with data:', userData);

      try {
        // Register user
        const result = await register(userData);
        console.log('Registration successful:', result);

        // Profile is automatically created on the backend

        // Redirect to login
        navigate('/login');
      } catch (registerError) {
        console.error('Registration error:', registerError);
        throw registerError;
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h1 className="auth-title">Create an Account</h1>

          {(errorMessage || error) && (
            <div className="error-message">
              {errorMessage || error}
            </div>
          )}

          {step === 1 && (
            <div className="user-type-selector">
              <h2>I am a:</h2>
              <div className="user-type-options">
                <div
                  className={`user-type-option ${userType === 'student' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('student')}
                >
                  <h3>Student</h3>
                  <p>High school student looking to volunteer</p>
                </div>

                <div
                  className={`user-type-option ${userType === 'senior' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('senior')}
                >
                  <h3>Senior</h3>
                  <p>Senior looking for assistance with tasks</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address*</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">City*</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state" className="form-label">State*</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="form-input"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode" className="form-label">Zip Code*</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="form-input"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {userType === 'student' && (
                <>
                  <div className="form-group">
                    <label htmlFor="schoolName" className="form-label">School Name*</label>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      className="form-input"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="grade" className="form-label">Grade*</label>
                    <select
                      id="grade"
                      name="grade"
                      className="form-input"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="skills" className="form-label">Skills/Interests*</label>
                    <textarea
                      id="skills"
                      name="skills"
                      className="form-input"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="List skills or interests (e.g., gardening, technology, cleaning)"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="parentConsent"
                      name="parentConsent"
                      checked={formData.parentConsent}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="parentConsent" className="checkbox-label">
                      I have parental consent to volunteer*
                    </label>
                  </div>
                </>
              )}

              {userType === 'senior' && (
                <>
                  <div className="form-group">
                    <label htmlFor="needs" className="form-label">Assistance Needs*</label>
                    <textarea
                      id="needs"
                      name="needs"
                      className="form-input"
                      value={formData.needs}
                      onChange={handleChange}
                      placeholder="Describe what kind of assistance you typically need"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobilityStatus" className="form-label">Mobility Status*</label>
                    <select
                      id="mobilityStatus"
                      name="mobilityStatus"
                      className="form-input"
                      value={formData.mobilityStatus}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Mobility Status</option>
                      <option value="fully_mobile">Fully Mobile</option>
                      <option value="some_assistance">Need Some Assistance</option>
                      <option value="wheelchair">Wheelchair User</option>
                      <option value="limited_mobility">Limited Mobility</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="emergencyContactName" className="form-label">Emergency Contact Name*</label>
                    <input
                      type="text"
                      id="emergencyContactName"
                      name="emergencyContactName"
                      className="form-input"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="emergencyContactPhone" className="form-label">Emergency Contact Phone*</label>
                    <input
                      type="tel"
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      className="form-input"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className="auth-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="auth-links">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
