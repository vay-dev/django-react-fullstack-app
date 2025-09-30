import React from "react";
import { useNavigate } from "react-router-dom";
import { getNoteColor } from "../utils/noteColors";

const Note = ({ note, onDelete, index }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");
  const colorName = getNoteColor(note, index);

  const handleClick = () => {
    navigate(`/note/${note.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    onDelete(note.id);
  };

  return (
    <div
      className={`note-card note-card--${colorName}`}
      onClick={handleClick}
      style={{ '--note-color': `var(--color-${colorName})` }}
    >
      <div className="note-card__header">
        {note.category && (
          <span className="note-card__category">{note.category}</span>
        )}
      </div>

      <h3 className="note-card__title">{note.title}</h3>
      <p className="note-card__content">{note.content}</p>

      <div className="note-card__footer">
        <span className="note-card__date">
          <span>📅</span> {formattedDate}
        </span>
        <div className="note-card__actions">
          <button
            className="note-card__icon-btn note-card__icon-btn--delete"
            onClick={handleDelete}
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Note;
