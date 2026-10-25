import type { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import type { NoteTag } from "@/types/note";
import { OG_IMAGE, SITE_URL } from "@/lib/constants";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0];
  const isAll = filter === "all";

  const title = isAll ? "All notes | NoteHub" : `${filter} notes | NoteHub`;
  const description = isAll
    ? "Browse all your notes in NoteHub."
    : `Browse notes with the "${filter}" tag in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${filter}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? "all"} tag={tag} />
    </HydrationBoundary>
  );
}
