const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); 

app.get('/api/teachers', (req, res) => {
  const dataPath = path.join(__dirname, '../src/data/users.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(data.teachers);
});

app.get('/api/student', (req, res) => {
  const dataPath = path.join(__dirname, '../src/data/students.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json({
    student: data.students[0],
    matches: data.matches
  });
});

app.get('/api/teacher/:id', (req, res) => {
  const dataPath = path.join(__dirname, '../src/data/users.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const teacherId = parseInt(req.params.id, 10);
  const teacher = data.teachers.find(t => t.id === teacherId);
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404).json({ error: 'Professeur non trouvé' });
  }
});

app.post('/api/student/:studentId/match', (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  const { teacherId } = req.body;

  if (!teacherId) {
    return res.status(400).json({ error: 'teacherId requis' });
  }

  const dataPath = path.join(__dirname, '../src/data/students.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  let matchEntry = data.matches.find(m => m.studentId === studentId);
  if (!matchEntry) {
    matchEntry = { studentId, matchedTeachers: [] };
    data.matches.push(matchEntry);
  }

  if (!matchEntry.matchedTeachers.some(m => m.teacherId === teacherId)) {
    matchEntry.matchedTeachers.push({
      teacherId,
      matchDate: new Date().toISOString(),
      status: "active"
    });
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  res.json({ success: true, matches: matchEntry.matchedTeachers });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});