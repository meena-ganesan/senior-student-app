# Senior-Student Volunteer Connection

A platform that connects high school students with seniors to help with daily chores, fostering intergenerational relationships while providing valuable volunteer opportunities.

## Project Overview

This application enables high school students to volunteer their time helping seniors with everyday tasks, while seniors can request assistance with chores they find difficult to manage. The platform facilitates registration, matching, scheduling, and feedback processes.

## Features

### For Students:
- Create profiles showcasing skills and availability
- Browse and accept chore requests from seniors
- Track service hours for school credit
- Receive ratings and feedback

### For Seniors:
- Create profiles detailing assistance needs
- Post specific chore requests with details and timing
- Review and approve student volunteers
- Provide feedback after completed tasks

### Core Functionality:
- User registration and profile management
- Chore posting and matching system
- Scheduling and confirmation workflow
- Service hour tracking
- Rating and feedback system

## Tech Stack

### Backend:
- FastAPI (Python)
- SQLite database
- SQLAlchemy ORM
- Poetry for dependency management
- pytest for testing

### Frontend:
- React
- React Router
- Axios for API communication
- CSS for styling (no Tailwind)
- Playwright for end-to-end testing

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 14+

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install fastapi uvicorn sqlalchemy pydantic bcrypt==3.2.2 python-jose passlib python-multipart
   ```

4. Start the server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
senior-student-app/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── tests/
│   └── pyproject.toml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.js
│   ├── package.json
│   └── e2e-tests/
└── README.md
```

## Testing

### Backend Tests
```
cd backend
poetry run pytest
```

### Frontend Tests
```
cd frontend
npm test
```

### End-to-End Tests
```
cd frontend
npm run e2e
```

## Development Workflow

The application follows the workflow outlined in our Mermaid chart:

1. User registration (students and seniors)
2. Profile creation and approval
3. Seniors post chore requests
4. System matches with appropriate students
5. Students accept chores
6. Confirmation sent to both parties
7. Chore completion and verification
8. Rating and feedback
9. Service hours tracking

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created to help foster intergenerational connections and provide meaningful volunteer opportunities for students.
