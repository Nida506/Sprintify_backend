Sprintify - Real-Time Project Management App

https://github.com/Nida506/Sprintify
Sprintify is a web-based project management platform designed for teams and organizations to collaborate effectively. Built using the MERN Stack (MongoDB, Express.js, React.js, Node.js), Sprintify offers seamless task tracking, team communication, file sharing, and live meetings — all from a single dashboard.

Key Features
✅ User Authentication (JWT-based secure login and registration)
✅ Team Collaboration (Create and manage teams and projects)
✅ Task Management (Assign, update, and track tasks with deadlines and priorities)
✅ File Attachments (Upload and share relevant files with tasks)
✅ Real-Time Chat (Socket.IO powered group and private chat system)
✅ Meeting Scheduler (Schedule and join meetings with WebRTC)
✅ Dashboard Overview (See project status, recent activities, and team contributions)
✅ Notifications (Real-time alerts for task updates, messages, and meetings)

Tech Stack
Frontend: React.js, Tailwind CSS, Axios
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)
Auth: JWT, bcrypt
Real-Time: Socket.IO, WebSockets
Meetings: WebRTC, Simple-Peer (for P2P video)
Dev Tools: Postman, Nodemon, ESLint, Prettier
Project Structure

Sprintify/
├── client/                  # Frontend - React.js
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                  # Backend - Node.js & Express
│   ├── config/              # MongoDB config
│   ├── controllers/         # Route logic
│   ├── middleware/          # Auth and error handlers
│   ├── models/       


Installation
Clone the application:
   git clone https://github.com/yourusername/sprintify.git
Install necessary dependencies for the application:
   cd client && npm install
   cd ../server && npm install
Create a .env file and copy the contents from .env.example:
   MONGO_URI=mongodb://localhost:27017/sprintify
   JWT_SECRET_KEY=random_string
Start the application:
   Backend: npm run dev (from /server)
   Frontend: npm start (from /client)

To run the project using Docker:
• Install Docker and start the Docker daemon
• Create a .env.development file and set:
   LOCAL_MONGODB=mongodb://mongodb:27017/sprintify
• Run: docker-compose up


Demo
Demo link coming soon...

Usage Guide
👉 Register a new user or login using valid credentials.
👉 Create or join a project.
👉 Add and assign tasks with deadlines and priorities.
👉 Collaborate using the integrated chat system.
👉 Schedule and start meetings directly from the dashboard.
👉 Upload files and monitor team progress on the dashboard.

Future Enhancements
🌟 Task suggestions using user history
🌟 Mobile app version (React Native)
🌟 Google Calendar integration
🌟 Drag-and-drop task board (Kanban-style)
🌟 Multi-language support

Contributing
All contributions are welcome! Fork this repo, create a new branch, commit your changes, and open a pull request.
