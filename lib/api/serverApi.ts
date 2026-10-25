import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CheckSessionResponse {
  success: boolean;
}

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: { Cookie: await getCookieHeader() },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: await getCookieHeader() },
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: await getCookieHeader() },
  });
  return data;
};

// Returns the full response: proxy needs its set-cookie headers
export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  return api.get<CheckSessionResponse>("/auth/session", {
    headers: { Cookie: await getCookieHeader() },
  });
};
