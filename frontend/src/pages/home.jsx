import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/notes";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    setIsLoading(true);
    api
      .get("/api/notes/")
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .then((data) => {
        setNotes(data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err);
        setIsLoading(false);
      });
  };

  const deleteNote = (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    api
      .delete(`api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted successfully");
          getNotes();
        } else {
          alert("Failed to delete note");
        }
      })
      .catch((err) => alert(err));
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleCreateNote = () => {
    navigate("/editor");
  };

  const handleSearch = () => {
    navigate("/search");
  };

  if (isLoading) {
    return (
      <div className="home">
        <div className="home__loading">
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home__container">
        <header className="home__header">
          <h1>Notes</h1>
          <div className="home__actions">
            <button className="home__search-btn" onClick={handleSearch}>
              <span>🔍</span>
              <span>Search</span>
            </button>
            <button className="home__create-btn" onClick={handleCreateNote}>
              <span>+</span>
              <span>New Note</span>
            </button>
            <button className="home__logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {notes.length === 0 ? (
          <div className="home__empty">
            <img src="/images/empty-notes.svg" alt="No notes" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="home__notes-grid">
            {notes.map((note, index) => (
              <Note
                note={note}
                onDelete={deleteNote}
                key={note.id}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
