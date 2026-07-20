import AppLayout from "@/components/layout/AppLayout";
import GlobalKnowledgeGraph from "@/components/workspace/GlobalKnowledgeGraph";

export default function KnowledgeGraphPage() {
  return (
    <AppLayout>

      <div className="space-y-8">

        <div>
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-widest
              text-blue-600
            "
          >
            Unified Knowledge Intelligence
          </p>

          <h1
            className="
              mt-2
              text-4xl
              font-bold
            "
          >
            Global Knowledge Graph
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-slate-500
            "
          >
            Explore entities and relationships
            discovered across all your uploaded
            documents in one unified knowledge
            network.
          </p>
        </div>

        <GlobalKnowledgeGraph />

      </div>

    </AppLayout>
  );
}