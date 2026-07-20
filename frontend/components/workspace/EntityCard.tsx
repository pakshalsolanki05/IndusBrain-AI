"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

interface Entity {
  id: number;
  entity: string;
  entity_type: string;
  confidence: number;
}

interface Props {
  documentId: number;
}

export default function EntityCard({
  documentId,
}: Props) {

  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    loadEntities();
  }, [documentId]);

  async function loadEntities() {
    const response = await api.get(
      `/documents/${documentId}/entities`
    );

    setEntities(response.data);
  }

  const types = [
    "All",
    ...new Set(
      entities.map((e) => e.entity_type)
    ),
  ];

  const filtered = useMemo(() => {
    return entities.filter((entity) => {

      const matchesSearch =
        entity.entity
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        type === "All" ||
        entity.entity_type === type;

      return matchesSearch && matchesType;
    });
  }, [entities, search, type]);

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Extracted Entities
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
          {filtered.length} entities
        </span>

      </div>

      <div className="flex gap-4 mb-6">

        <input
          className="border rounded-lg px-4 py-2 flex-1"
          placeholder="Search entity..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          {types.map((t) => (
            <option key={t}>
              {t}
            </option>
          ))}
        </select>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">
              Entity
            </th>

            <th className="text-left">
              Type
            </th>

            <th className="text-left">
              Confidence
            </th>

          </tr>

        </thead>

        <tbody>

          {filtered.map((entity) => (

            <tr
              key={entity.id}
              className="border-b"
            >

              <td className="py-3">
                {entity.entity}
              </td>

              <td>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {entity.entity_type}
                </span>

              </td>

              <td>

                {(entity.confidence * 100).toFixed(0)}%

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}