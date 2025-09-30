import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { getNoteColor, getColorHex } from "../utils/noteColors";

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNote();
  }, [id]);

  const getNote = () => {
    setIsLoading(true);
    api
      .get(`/api/notes/${id}/`)
      .then((res) => {
        setNote(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert("Failed to load note");
        console.error(err);
        setIsLoading(false);
        navigate("/");
      });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted successfully");
          navigate("/");
        } else {
          alert("Failed to delete note");
        }
      })
      .catch((err) => {
        alert("Error deleting note");
        console.error(err);
      });
  };

  const handleEdit = () => {
    navigate(`/editor/${id}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="note-view">
        <div className="note-view__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="note-view">
        <div className="note-view__container">
          <p>Note not found</p>
        </div>
      </div>
    );
  }

  const colorName = getNoteColor(note, 0);
  const colorHex = getColorHex(colorName);
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const updatedDate = new Date(note.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="note-view">
      <div className="note-view__container">
        <header className="note-view__header">
          <button className="note-view__back-btn" onClick={handleBack}>
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="note-view__actions">
            <button className="note-view__edit-btn" onClick={handleEdit}>
              <span>✏️</span>
              <span>Edit</span>
            </button>
            <button className="note-view__delete-btn" onClick={handleDelete}>
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </header>

        <div
          className="note-view__content"
          style={{ "--note-color": colorHex }}
        >
          {note.category && (
            <span className="note-view__category">{note.category}</span>
          )}

          <h1 className="note-view__title">{note.title}</h1>

          <div className="note-view__meta">
            <div className="note-view__meta-item">
              <span>📅</span>
              <span>Created: {formattedDate}</span>
            </div>
            {note.updated_at && note.updated_at !== note.created_at && (
              <div className="note-view__meta-item">
                <span>🔄</span>
                <span>Updated: {updatedDate}</span>
              </div>
            )}
          </div>

          <div className="note-view__body">{note.content}</div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;