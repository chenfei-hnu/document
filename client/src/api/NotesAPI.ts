import API from './APIUtils';
import { IModel, INote } from '../types';

const encode = encodeURIComponent;

type Notes = {
  notes: Array<INote>;
} & {
  totalCount: number;
};

type Note = {
  note: INote;
};


function omitSlug(note: {
  slug: string;
  name?: string;
  content?: string;
}) {
  return Object.assign({}, note, { slug: undefined });
}

export function getNotes() {
  return API.get<Notes>(`/notes`);
}

export function getNotesByCreator(username: string) {
  return API.get<Notes>(
    `/notes?creator=${encode(username)}`,
  );
}
export function getNotesByModel(slug: string) {
  return API.get<Notes>(
    `/notes?model=${encode(slug)}`,
  );
}

export function deleteNotes(slug: string) {
  return API.delete<null>(`/notes/${slug}`);
}


export function getNote(slug: string) {
  return API.get<Note>(`/notes/${slug}`);
}

export function updateNote(note: {
  slug: string;
  name: string;
  content?: string;
}) {
  return API.put<Note>(`/notes/${note.slug}`, {
    note: omitSlug(note),
  });
}


export function createNote(slug: string, note: { name: string }) {
  return API.post<Note>(`/models/${slug}/notes`, { note });
}
