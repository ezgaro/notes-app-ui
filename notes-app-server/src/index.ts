import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching notes." });
  }
});

app.post("/api/notes", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(400).send("title and content fields required");
  }
});

// @ts-ignore
app.put("/api/notes/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content fields required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID has to be a valid number" });
  }

  try {
    const updateNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updateNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Note not found" });
  }
});
// @ts-ignore
app.delete("/api/notes/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID has to be a valid number" });
  }

  try {
    const deleteNote = await prisma.note.delete({
      where: { id },
    });
    res.json(deleteNote);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Note not found" });
  }
});

app.listen(5000, () => console.log("Server is running on port 5000"));
