import { useState } from "react";
import "./App.css";

type Note = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: "note 1", content: "content 1" },
    { id: 2, title: "note 2", content: "content 2" },
    { id: 3, title: "note 3", content: "content 3" },
    { id: 4, title: "note 4", content: "content 4" },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  function handleNoteClick(note: Note) {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    setNotes([
      ...notes,
      { id: notes.length + 1, title: title, content: content },
    ]);
    setTitle("");
    setContent("");
  }

  function handleUpdateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedNote) {
      return;
    }

    const updateNote: Note = {
      id: selectedNote.id,
      title: selectedNote.title,
      content: selectedNote.content,
    };

    const updatedNotesList = notes.map((note) =>
      selectedNote && note.id === selectedNote.id ? updateNote : note
    );
    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  function handleCancel() {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  function deleteNote(e: React.MouseEvent, noteId: number) {
    //Necessary when dealing with multiple onClick events on a note
    e.stopPropagation();
    const updatedNotes = notes.filter((note) => noteId !== note.id);
    setNotes(updatedNotes);
  }

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(e) =>
          selectedNote ? handleUpdateNote(e) : handleAddNote(e)
        }
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={10}
          required
        ></textarea>
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            className="note-item"
            key={note.id}
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button onClick={(e) => deleteNote(e, note.id)}>&times;</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
