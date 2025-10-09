import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import { Query } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  return (
    <ul className={css.list}>
      {/* Набір елементів списку нотаток */}
      <li className={css.listItem}>
        <h2 className={css.title}>Note title</h2>
        <p className={css.content}>Note content</p>
        <div className={css.footer}>
          <span className={css.tag}>Note tag</span>
          <button className={css.button}>Delete</button>
        </div>
      </li>
    </ul>
  );
};

export default NoteList;
