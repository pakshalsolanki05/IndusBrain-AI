import AppLayout from "@/components/layout/AppLayout";
import DocumentWorkspace from "@/components/documents/DocumentWorkspace";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DocumentPage({
  params,
}: Props) {

  const { id } = await params;

  return (
    <AppLayout>
      <DocumentWorkspace
        documentId={Number(id)}
      />
    </AppLayout>
  );
}