import { FileText } from "lucide-react";
import { Document } from "@/types/document";

interface Props {
  document: Document;
}

export default function DocumentCard({ document }: Props) {
  return (
    <div className="border rounded-xl p-5 shadow hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div className="flex gap-3">

          <FileText className="text-blue-600" size={30} />

          <div>

            <h2 className="font-bold">
              {document.filename}
            </h2>

            <p className="text-sm text-gray-500">
              {document.file_type}
            </p>

          </div>

        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Chat
        </button>

      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 text-sm">

        <div>
          <strong>Pages</strong>
          <br />
          {document.pages}
        </div>

        <div>
          <strong>Words</strong>
          <br />
          {document.words}
        </div>

        <div>
          <strong>Characters</strong>
          <br />
          {document.characters}
        </div>

        <div>
          <strong>Size</strong>
          <br />
          {document.size_kb} KB
        </div>

      </div>

    </div>
  );
}