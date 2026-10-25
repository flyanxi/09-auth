import type { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import { OG_IMAGE, SITE_URL } from "@/lib/constants";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description =
      note.content.length > 0
        ? note.content.slice(0, 100)
        : `Note with the "${note.tag}" tag in NoteHub.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${id}`,
        images: [OG_IMAGE],
      },
    };
  } catch {
    return {
      title: "Note | NoteHub",
      description: "Note details in NoteHub.",
    };
  }
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
