import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/notes";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "all",
    "Book Review",
    "Work",
    "Fitness",
    "Budget",
    "Learning",
    "Ideas",
    "Personal",
    "Other"
  ];

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [searchQuery, selectedCategory, allNotes]);

  const getNotes = () => {
    setIsLoading(true);
    api
      .get("/api/notes/")
      .then((res) => {
        setAllNotes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert("Failed to load notes");
        console.error(err);
        setIsLoading(false);
      });
  };

  const filterNotes = () => {
    let filtered = [...allNotes];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.category && note.category.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((note) => note.category === selectedCategory);
    }

    setFilteredNotes(filtered);
  };

  const deleteNote = (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted successfully");
          getNotes();
        } else {
          alert("Failed to delete note");
        }
      })
      .catch((err) => {
        alert("Error deleting note");
        console.error(err);
      });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="search-page">
        <div className="search-page__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-page__container">
        <header className="search-page__header">
          <button className="search-page__back-btn" onClick={handleBack}>
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="search-page__search-bar">
            <span className="search-page__search-icon">🔍</span>
            <input
              type="text"
              className="search-page__input"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>
        </header>

        <div className="search-page__filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`search-page__filter-btn ${
                selectedCategory === category
                  ? "search-page__filter-btn--active"
                  : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>

        <div className="search-page__results">
          <h2>
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : selectedCategory === "all"
              ? "All Notes"
              : `${selectedCategory} Notes`}{" "}
            ({filteredNotes.length})
          </h2>

          {filteredNotes.length === 0 ? (
            <div className="search-page__empty">
              <img src="/images/search-empty.svg" alt="No results" />
              <p>
                {searchQuery
                  ? "No notes found matching your search"
                  : "No notes in this category"}
              </p>
            </div>
          ) : (
            <div className="search-page__results-grid">
              {filteredNotes.map((note, index) => (
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
    </div>
  );
};

export default SearchPage;