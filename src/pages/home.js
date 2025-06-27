import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './home.css';

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
  'profHistoire.webp': profHistoire,
  'profFrancais.webp': profFrancais,
  'profPhysique.webp': profPhysique,
  'profBio.avif': profBio,
  'profJava.jpg': profJava,
  'profPhilo.webp': profPhilo,
};

function Home() {
  const navigate = useNavigate();

  const [currentTeacherIndex, setCurrentTeacherIndex] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    priceRange: [20, 50],
    visio: false,
    presentiel: false,
    devoirs: false,
    subject: '',
    tags: [],
    minRating: 0
  });
  const [showMatch, setShowMatch] = useState(false);

  const allTags = [
    "Exigeant", "Bienveillant", "Souple", "Structuré", "Tolérant", "Motivant"
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/teachers')
      .then(res => res.json())
      .then(data => {
        setTeachers(data);
        setFilteredTeachers(data);
      });
  }, []);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleApplyFilters = () => {
    const filtered = teachers.filter(teacher => {
      if (filters.city && !teacher.location.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      if (
        teacher.hourlyRate < filters.priceRange[0] ||
        teacher.hourlyRate > filters.priceRange[1]
      ) {
        return false;
      }
      if (filters.visio && !(teacher.tags || []).includes("Visio")) {
        return false;
      }
      if (filters.presentiel && !(teacher.tags || []).includes("Présentiel")) {
        return false;
      }
      if (filters.devoirs && !(teacher.tags || []).includes("Devoirs")) {
        return false;
      }
      if (filters.subject && !(teacher.subjects || []).includes(filters.subject)) {
        return false;
      }
      if (filters.tags.length > 0 && !filters.tags.every(tag => (teacher.tags || []).includes(tag))) {
        return false;
      }
      if (filters.minRating && teacher.rating < filters.minRating) {
        return false;
      }
      return true;
    });
    setFilteredTeachers(filtered);
    setCurrentTeacherIndex(0);
  };

  const handleAccept = async () => {
    if (currentTeacher.likedYou) {
      try {
        await fetch('http://localhost:5000/api/student/1/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId: currentTeacher.id })
        });
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du match', error);
      }
      setShowMatch(true);
    }
    if (currentTeacherIndex < filteredTeachers.length - 1) {
      setCurrentTeacherIndex(currentTeacherIndex + 1);
    }
  };

  const handleReject = () => {
    if (currentTeacherIndex < filteredTeachers.length - 1) {
      setCurrentTeacherIndex(currentTeacherIndex + 1);
    }
  };

  if (filteredTeachers.length === 0) return <div>Pas de prof trouvé avec ces filtres.</div>;

  const currentTeacher = filteredTeachers[currentTeacherIndex];
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="profile-card">
          <div className="photo-section">
            <img 
              src={imageMap[currentTeacher.image]} 
              alt={`${currentTeacher.profession}`} 
              className="home-image" 
            />
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
              <span className="rating-text">{currentTeacher.rating}/5</span>
            </div>
            <div className="action-buttons">
              <button className="button reject-button" onClick={handleReject}>
                <i className="fas fa-times"></i>
              </button>
              <button className="button accept-button" onClick={handleAccept}>
                <i className="fas fa-check"></i>
              </button>
            </div>
            <div className="tags-section">
              {currentTeacher.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <i className={`fas ${
                    tag === "Visio" ? "fa-video" :
                    tag === "Présentiel" ? "fa-user" :
                    tag === "Devoirs" ? "fa-book" :
                    tag === "Non-Devoirs" ? "fa-book-open" :
                    tag === "Fréquent" ? "fa-clock" :
                    tag === "Occasionnel" ? "fa-calendar-alt" :
                    tag === "Exigeant" ? "fa-tasks" :
                    tag === "Bienveillant" ? "fa-heart" :
                    tag === "Souple" ? "fa-feather" :
                    tag === "Structuré" ? "fa-list" :
                    tag === "Tolérant" ? "fa-hand-holding-heart" :
                    tag === "Motivant" ? "fa-fire" :
                    "fa-user-tag"
                  }`}></i>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="info-section">
            <div className="info-content">
              <div className="profile-info">
                <h1>{currentTeacher.firstName} {currentTeacher.lastName}</h1>
                <div className="profile-details">
                  <p><span className="label">Âge:</span> {currentTeacher.age} ans</p>
                  <p><span className="label">Profession:</span> {currentTeacher.profession}</p>
                  <p><span className="label">Niveau:</span> {currentTeacher.education}</p>
                  <p><span className="label">Expérience:</span> {currentTeacher.experience}</p>
                  <p><span className="label">Tarif:</span> {currentTeacher.hourlyRate}€/heure</p>
                  <p><span className="label">Disponibilité:</span> {currentTeacher.availability}</p>
                  <p><span className="label">Localisation:</span> {currentTeacher.location}</p>
                  <p><span className="label">Description:</span> {currentTeacher.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="filters-container">
          <div className="filters-section">
            <h2>Filtres</h2>
            <div className="filter-group">
              <label>Ville</label>
              <input 
                type="text" 
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Entrez une ville"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Prix par heure: {filters.priceRange[0]}€ - {filters.priceRange[1]}€</label>
              <div className="range-inputs">
                <input 
                  type="range"
                  min="20"
                  max="50"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                  className="range-input"
                />
                <input 
                  type="range"
                  min="20"
                  max="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="range-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Mode d'enseignement</label>
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={filters.visio}
                    onChange={(e) => handleFilterChange('visio', e.target.checked)}
                  />
                  Visio
                </label>
                <label>
                  <input 
                    type="checkbox"
                    checked={filters.presentiel}
                    onChange={(e) => handleFilterChange('presentiel', e.target.checked)}
                  />
                  Présentiel
                </label>
              </div>
            </div>

            <div className="filter-group">
              <label>Devoirs</label>
              <div className="checkbox-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={filters.devoirs}
                    onChange={(e) => handleFilterChange('devoirs', e.target.checked)}
                  />
                  Avec devoirs
                </label>
              </div>
            </div>

            <div className="filter-group">
              <label>Matière</label>
              <select 
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="filter-select"
              >
                <option value="">Toutes les matières</option>
                <option value="Anglais">Anglais</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Histoire">Histoire</option>
                <option value="Français">Français</option>
                <option value="Physique">Physique</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Tags</label>
              <div className="checkbox-group">
                {allTags.map(tag => (
                  <label key={tag}>
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                        } else {
                          setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
                        }
                      }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Note minimale : {filters.minRating} ⭐</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={e => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                className="range-input"
              />
            </div>

            <button
              className="apply-filters-btn"
              onClick={handleApplyFilters}
            >
              Appliquer
            </button>
          </div>
        </div>

        {showMatch && (
          <div className="custom-alert">
            <div className="custom-alert-content">
              <span role="img" aria-label="match">🎉</span>
              Match ! {currentTeacher.firstName} {currentTeacher.lastName} vous a aussi liké !
              <button onClick={() => {
                setShowMatch(false);
                navigate('/messages');
              }}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
