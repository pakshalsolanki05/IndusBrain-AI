"use client";

interface Props {
  document: any;
  onOpen: () => void;
  onDelete: () => void;
}

export default function DocumentCard({
  document,
  onOpen,
  onDelete,
}: Props) {

  return (

    <div className="rounded-xl bg-white shadow border p-6">

      <h2 className="text-2xl font-semibold">
        📄 {document.filename}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <div>
          <p className="text-gray-500">Type</p>
          <p>{document.file_type}</p>
        </div>

        <div>
          <p className="text-gray-500">Pages</p>
          <p>{document.pages}</p>
        </div>

        <div>
          <p className="text-gray-500">Words</p>
          <p>{document.words}</p>
        </div>

        <div>
          <p className="text-gray-500">Size</p>
          <p>{document.size_kb} KB</p>
        </div>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={onOpen}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white"
        >
          Open
        </button>

        <button
          onClick={onDelete}
          className="px-5 py-2 rounded-lg bg-red-600 text-white"
        >
          Delete
        </button>

      </div>

    </div>

  );

}