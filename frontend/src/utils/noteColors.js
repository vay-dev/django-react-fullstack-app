// Note Color Logic
// Each note gets assigned a color based on its index or category

export const NOTE_COLORS = {
  pink: '#FFC0CB',
  red: '#FF4444',
  green: '#90EE90',
  yellow: '#FFD700',
  blue: '#87CEEB',
  purple: '#DDA0DD'
};

export const COLOR_NAMES = Object.keys(NOTE_COLORS);

/**
 * Get color for a note based on its index in the list
 * Colors cycle through: pink -> red -> green -> yellow -> blue -> purple
 * @param {number} index - The index of the note in the list
 * @returns {string} - Color name
 */
export const getNoteColorByIndex = (index) => {
  return COLOR_NAMES[index % COLOR_NAMES.length];
};

/**
 * Get color based on category or custom logic
 * You can extend this to support category-based colors
 * @param {Object} note - The note object
 * @param {number} index - The index fallback
 * @returns {string} - Color name
 */
export const getNoteColor = (note, index) => {
  // If note has a color property, use it
  if (note.color && COLOR_NAMES.includes(note.color)) {
    return note.color;
  }

  // If note has a category, map category to color
  if (note.category) {
    const categoryColorMap = {
      'Book Review': 'pink',
      'Work': 'red',
      'Fitness': 'green',
      'Budget': 'yellow',
      'Learning': 'blue',
      'Ideas': 'purple'
    };

    if (categoryColorMap[note.category]) {
      return categoryColorMap[note.category];
    }
  }

  // Fallback to index-based color
  return getNoteColorByIndex(index);
};

/**
 * Get hex color value
 * @param {string} colorName - Color name
 * @returns {string} - Hex color value
 */
export const getColorHex = (colorName) => {
  return NOTE_COLORS[colorName] || NOTE_COLORS.pink;
};