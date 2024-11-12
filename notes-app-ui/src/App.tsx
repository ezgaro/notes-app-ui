import { useEffect, useState } from "react";
import "./App.css";

type Note = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  function handleNoteClick(note: Note) {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const newNote: Note = await response.json();
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
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
