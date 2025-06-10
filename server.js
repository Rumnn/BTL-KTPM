const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // ⬅️ Added for cross-origin requests
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Noraleduong@292004', // Consider using environment variables in production
  database: 'student_db'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to database.');
});

// GET method to fetch all students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching students: ', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
