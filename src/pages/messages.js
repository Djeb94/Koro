import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './messages.css';

import profAnglais from '../images/profAnglais.webp';
import profMaths from '../images/profMaths.jpg';
import profHistoire from '../images/profHistoire.jpg';
import profFrancais from '../images/profFrancais.webp';
import profPhysique from '../images/profPhysique.jpg';
import profBio from '../images/profBio.avif';
import profJava from '../images/profJava.jpg';
import profPhilo from '../images/profPhilo.webp';

const imageMap = {
  'profAnglais.webp': profAnglais,
  'profMaths.webp': profMaths,
  'profHistoire.jpg': profHistoire,
  'profFrancais.webp': profFrancais,
  'profPhysique.jpg': profPhysique,
  'profBio.avif': profBio,
  'profJava.jpg': profJava,
  'profPhilo.webp': profPhilo,
};

function Messages() {
  const [student, setStudent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/student')
      .then(res => res.json())
      .then(data => {
        setStudent(data.student);
        setMatches(data.matches || []);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data));
  }, []);

  const getTeacherById = (id) => teachers.find(t => t.id === id);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content-messages">
        <h1 className="messages-title">Messagerie</h1>
        {matches.length === 0 ? (
          <p className="no-messages">pas de discussions</p>
        ) : (
          <ul className="messages-list">
            {matches.flatMap(matchEntry =>
              (matchEntry.matchedTeachers || []).map((match, idx, arr) => {
                const teacher = getTeacherById(match.teacherId);
                if (!teacher) return null;
                return (
                  <React.Fragment key={teacher.id}>
                    <li className="message-item">
                      <img
                        src={imageMap[teacher.image]}
                        alt={teacher.firstName + ' ' + teacher.lastName}
                        className="profile-pic"
                      />
                      <span className="teacher-name">
                        {teacher.firstName} {teacher.lastName}
                      </span>
                    </li>
                    {idx < arr.length - 1 && <hr className="message-separator" />}
                  </React.Fragment>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Messages;