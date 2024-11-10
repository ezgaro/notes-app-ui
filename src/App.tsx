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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotes([
      ...notes,
      { id: notes.length + 1, title: title, content: content },
    ]);
    setTitle("");
    setContent("");
  }

  return (
    <div className="app-container">
      <form className="note-form" onSubmit={handleSubmit}>
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
        <button type="submit">Add Note</button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" key={note.id}>
            <div className="notes-header">
              <button>&times;</button>
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
