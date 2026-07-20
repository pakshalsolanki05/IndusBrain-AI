"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import KnowledgeGraph from "@/components/workspace/KnowledgeGraph";
import PdfViewer from "@/components/documents/PdfViewer";
import DocumentChat from "@/components/chat/DocumentChat";
import AnalysisSummary from "@/components/workspace/AnalysisSummary";
import EntityCard from "@/components/workspace/EntityCard";
import {
  FileText,
  FileType,
  BookOpen,
  HardDrive,
} from "lucide-react";

interface Document {
  id: number;
  filename: string;
  file_type: string;
  pages: number;
  words: number;
  characters: number;
  size_kb: string;
  preview: string;
}

interface Props {
  documentId: number;
}

export default function DocumentWorkspace({
  documentId,
}: Props) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  async function loadDocument() {
    try {
      const response = await api.get(`/documents/${documentId}`);
      setDocument(response.data);
    } catch (error) {
      console.error("Failed to load document:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-xl font-semibold dark:text-white">
          Loading document...
        </p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-xl font-semibold text-red-500">
          Document not found.
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "File Type",
      value: document.file_type,
      icon: FileType,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      title: "Pages",
      value: document.pages,
      icon: FileText,
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      title: "Words",
      value: document.words.toLocaleString(),
      icon: BookOpen,
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    {
      title: "Size",
      value: `${document.size_kb} KB`,
      icon: HardDrive,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
  ];

  return (
    <div className="space-y-8 transition-colors duration-300">

      {/* Hero */}

      <div
        className="
          rounded-3xl
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-blue-900
          p-8
          text-white
          shadow-xl
        "
      >
        <p className="text-sm uppercase tracking-widest text-blue-200">
          AI DOCUMENT WORKSPACE
        </p>

        <h1 className="mt-3 break-words text-4xl font-bold">
          {document.filename}
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300 leading-7">
          Explore, analyze and chat with this document using
          Retrieval-Augmented Generation (RAG) powered by
          IndusBrain AI.
        </p>
      </div>

      {/* Metadata */}

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-1
                hover:shadow-xl

                dark:border-slate-700
                dark:bg-slate-800
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </h2>

                </div>

                <div className={`rounded-2xl p-4 ${card.color}`}>
                  <Icon size={28} />
                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* Main Workspace */}

      <div className="space-y-6">

        <Tabs defaultValue="overview">

          <TabsList>

            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>

            <TabsTrigger value="chat">
              Chat
            </TabsTrigger>

            <TabsTrigger value="graph">
              Knowledge Graph
            </TabsTrigger>

            <TabsTrigger value="entities">
              Entities
            </TabsTrigger>

          </TabsList>

          <TabsContent value="overview">

            <AnalysisSummary
              documentId={document.id}
            />

          </TabsContent>

          <TabsContent value="chat">

            <div className="grid xl:grid-cols-2 gap-6">

              <div className="h-[850px]">
                <PdfViewer
                  filename={document.filename}
                />
              </div>

              <div className="h-[850px]">
                <DocumentChat
                  documentId={document.id}
                />
              </div>

            </div>

          </TabsContent>

          <TabsContent value="graph">

            <KnowledgeGraph
              documentId={document.id}
            />

          </TabsContent>

          <TabsContent value="entities">

            <EntityCard
              documentId={document.id}
            />


          </TabsContent>

        </Tabs>

      </div>

    </div>
  );
}