import axios from "axios";
import type { Note } from "../types/note";

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

const NoteService = axios.create({
  baseURL: "https://notehub-public.goit.study/api/notes",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

interface FetchNotesResponse {
  results: Note[];
  total_pages: number;
}

interface FetchNotesParams {
  search: string;
  page?: number;
  perPage?: number;
}

interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async ({
  search = "",
  page = 1,
  perPage = 10,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params = { search, page, per_page: perPage };
  const { data } = await NoteService.get<FetchNotesResponse>("", { params });
  return data;
};

export const createNote = async (newNote: CreateNoteParams) => {
  const { data } = await NoteService.post<Note>("", newNote);
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await NoteService.delete<Note>(`/${noteId}`);
  return data;
};

// export const updateNote = async ()
