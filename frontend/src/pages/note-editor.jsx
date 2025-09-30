import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { COLOR_NAMES, getColorHex } from "../utils/noteColors";

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    color: "pink",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadNote();
    }
  }, [id]);

  const loadNote = () => {
    setIsLoading(true);
    api
      .get(`/api/notes/${id}/`)
      .then((res) => {
        setFormData({
          title: res.data.title || "",
          content: res.data.content || "",
          category: res.data.category || "",
          color: res.data.color || "pink",
        });
        setIsLoading(false);
      })
      .catch((err) => {
        alert("Failed to load note");
        console.error(err);
        setIsLoading(false);
        navigate("/");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      color: color,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      alert("Content is required");
      return;
    }

    setIsSaving(true);

    const apiCall = isEditMode
      ? api.put(`/api/notes/${id}/edit/`, formData)
      : api.post("/api/notes/", formData);

    apiCall
      .then((res) => {
        alert(
          isEditMode
            ? "Note updated successfully!"
            : "Note created successfully!"
        );
        navigate(isEditMode ? `/note/${id}` : "/");
      })
      .catch((err) => {
        alert("Failed to save note");
        console.error(err);
        setIsSaving(false);
      });
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/note/${id}`);
    } else {
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="note-editor">
        <div className="note-editor__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="note-editor__container">
        <header className="note-editor__header">
          <button className="note-editor__back-btn" onClick={handleCancel}>
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="note-editor__actions">
            <button
              className="note-editor__cancel-btn"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="note-editor__save-btn"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              <span>💾</span>
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </header>

        <form className="note-editor__form" onSubmit={handleSubmit}>
          <div className="note-editor__field">
            <label className="note-editor__label" htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="note-editor__input"
              placeholder="Enter note title..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="note-editor__field">
            <label className="note-editor__label" htmlFor="category">
              Category (Optional)
            </label>
            <select
              id="category"
              name="category"
              className="note-editor__select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Book Review">Book Review</option>
              <option value="Work">Work</option>
              <option value="Fitness">Fitness</option>
              <option value="Budget">Budget</option>
              <option value="Learning">Learning</option>
              <option value="Ideas">Ideas</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="note-editor__field">
            <label className="note-editor__label">Color</label>
            <div className="note-editor__color-preview">
              {COLOR_NAMES.map((colorName) => (
                <div
                  key={colorName}
                  className={`note-editor__color-swatch ${
                    formData.color === colorName
                      ? "note-editor__color-swatch--selected"
                      : ""
                  }`}
                  style={{ backgroundColor: getColorHex(colorName) }}
                  onClick={() => handleColorSelect(colorName)}
                  title={colorName}
                />
              ))}
            </div>
          </div>

          <div className="note-editor__field">
            <label className="note-editor__label" htmlFor="content">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              className="note-editor__textarea"
              placeholder="Write your note here..."
              value={formData.content}
              onChange={handleChange}
              required
            />
            <div className="note-editor__char-count">
              {formData.content.length} characters
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;
