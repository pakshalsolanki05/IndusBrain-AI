"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  Position,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

import dagre from "dagre";

import {
  Network,
  FileText,
  Boxes,
  GitBranch,
  Search,
  X,
} from "lucide-react";


interface GraphNodeData {
  label: string;
  type: string;
}

interface GraphEdgeData {
  relation?: string;
  confidence?: number;
  document_id?: number;
}

interface GraphStats {
  documents: number;
  entities: number;
  relationships: number;
}

interface GraphResponse {
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
  stats: GraphStats;
}


const NODE_WIDTH = 220;
const NODE_HEIGHT = 70;


function getNodeColor(type: string) {
  const normalizedType = type?.toLowerCase() || "";

  if (normalizedType === "person") {
    return "#dbeafe";
  }

  if (normalizedType === "organization") {
    return "#dcfce7";
  }

  if (
    normalizedType === "technology" ||
    normalizedType === "software"
  ) {
    return "#f3e8ff";
  }

  if (
    normalizedType === "ai model" ||
    normalizedType === "algorithm"
  ) {
    return "#fef3c7";
  }

  if (
    normalizedType === "project" ||
    normalizedType === "system"
  ) {
    return "#e0e7ff";
  }

  if (normalizedType === "dataset") {
    return "#cffafe";
  }

  if (normalizedType === "location") {
    return "#ffedd5";
  }

  if (
    normalizedType === "equipment" ||
    normalizedType === "machine" ||
    normalizedType === "component"
  ) {
    return "#fee2e2";
  }

  return "#f1f5f9";
}


function getLayoutedElements(
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[]
) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: 130,
    nodesep: 80,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(
      edge.source,
      edge.target
    );
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const position = dagreGraph.node(
      node.id
    );

    return {
      ...node,

      targetPosition: Position.Left,
      sourcePosition: Position.Right,

      position: {
        x:
          position.x -
          NODE_WIDTH / 2,

        y:
          position.y -
          NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}


export default function GlobalKnowledgeGraph() {
  const [nodes, setNodes] = useState<
    Node<GraphNodeData>[]
  >([]);

  const [edges, setEdges] = useState<
    Edge<GraphEdgeData>[]
  >([]);

  const [stats, setStats] =
    useState<GraphStats>({
      documents: 0,
      entities: 0,
      relationships: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    selectedNode,
    setSelectedNode,
  ] = useState<
    Node<GraphNodeData> | null
  >(null);


  useEffect(() => {
    loadGraph();
  }, []);


  async function loadGraph() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<GraphResponse>(
          "/knowledge-graph/"
        );

      const graphData =
        getLayoutedElements(
          response.data.nodes,
          response.data.edges
        );

      setNodes(graphData.nodes);

      setEdges(
        graphData.edges.map(
          (edge) => ({
            ...edge,

            type: "smoothstep",

            animated: true,

            markerEnd: {
              type:
                MarkerType.ArrowClosed,
            },

            labelStyle: {
              fontSize: 12,
              fontWeight: 600,
            },
          })
        )
      );

      setStats(
        response.data.stats
      );
    } catch (error) {
      console.error(
        "Failed to load global knowledge graph:",
        error
      );

      setError(
        "Failed to load the global knowledge graph."
      );
    } finally {
      setLoading(false);
    }
  }


  const filteredNodes =
    useMemo(() => {
      if (!search.trim()) {
        return nodes;
      }

      const query =
        search.toLowerCase();

      return nodes.map((node) => {
        const matches =
          node.data.label
            .toLowerCase()
            .includes(query) ||
          node.data.type
            .toLowerCase()
            .includes(query);

        return {
          ...node,

          style: {
            ...node.style,

            opacity:
              matches
                ? 1
                : 0.2,
          },
        };
      });
    }, [nodes, search]);


  const connectedRelationships =
    useMemo(() => {
      if (!selectedNode) {
        return [];
      }

      return edges.filter(
        (edge) =>
          edge.source ===
            selectedNode.id ||
          edge.target ===
            selectedNode.id
      );
    }, [selectedNode, edges]);


  const handleNodeClick =
    useCallback(
      (
        _: React.MouseEvent,
        node: Node<GraphNodeData>
      ) => {
        setSelectedNode(node);
      },
      []
    );


  if (loading) {
    return (
      <div
        className="
          flex
          h-[650px]
          items-center
          justify-center
          rounded-2xl
          border
          bg-white
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <p className="text-lg font-semibold">
          Building Global Knowledge Graph...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
          text-red-700
        "
      >
        {error}
      </div>
    );
  }


  const statCards = [
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
    },

    {
      title: "Entities",
      value: stats.entities,
      icon: Boxes,
    },

    {
      title: "Relationships",
      value:
        stats.relationships,
      icon: GitBranch,
    },
  ];


  return (
    <div className="space-y-6">

      {/* Statistics */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-3
        "
      >
        {statCards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <div
                key={card.title}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm

                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        text-slate-500
                      "
                    >
                      {card.title}
                    </p>

                    <p
                      className="
                        mt-2
                        text-3xl
                        font-bold
                        text-slate-900

                        dark:text-white
                      "
                    >
                      {card.value}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-blue-50
                      p-3
                      text-blue-600

                      dark:bg-blue-950
                      dark:text-blue-300
                    "
                  >
                    <Icon size={26} />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>


      {/* Search */}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-4
          py-3

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <Search
          size={20}
          className="text-slate-400"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search entities or entity types..."
          className="
            w-full
            bg-transparent
            outline-none

            dark:text-white
          "
        />
      </div>


      {/* Graph */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
        "
        style={{
          height: 720,
        }}
      >
        {nodes.length === 0 ? (
          <div
            className="
              flex
              h-full
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <Network
              size={48}
              className="
                mb-4
                text-slate-400
              "
            />

            <h3
              className="
                text-xl
                font-semibold
              "
            >
              No Knowledge Graph Data
            </h3>

            <p
              className="
                mt-2
                max-w-md
                text-slate-500
              "
            >
              Upload and analyze documents
              to build your global
              Knowledge Graph.
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            fitView
            fitViewOptions={{
              padding: 0.2,
            }}
            onNodeClick={
              handleNodeClick
            }
          >
            <MiniMap
              nodeColor={(node) =>
                getNodeColor(
                  node.data?.type ||
                    ""
                )
              }
            />

            <Controls />

            <Background />
          </ReactFlow>
        )}


        {/* Node Details Panel */}

        {selectedNode && (
          <div
            className="
              absolute
              right-4
              top-4
              z-10
              w-80
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-xl

              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Selected Entity
                </p>

                <h3
                  className="
                    mt-2
                    break-words
                    text-lg
                    font-bold

                    dark:text-white
                  "
                >
                  {
                    selectedNode
                      .data
                      .label
                  }
                </h3>
              </div>

              <button
                onClick={() =>
                  setSelectedNode(
                    null
                  )
                }
                className="
                  rounded-lg
                  p-1
                  hover:bg-slate-100

                  dark:hover:bg-slate-800
                "
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5">
              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Entity Type
              </p>

              <span
                className="
                  mt-2
                  inline-flex
                  rounded-full
                  bg-blue-100
                  px-3
                  py-1
                  text-sm
                  font-medium
                  text-blue-700
                "
              >
                {
                  selectedNode
                    .data
                    .type
                }
              </span>
            </div>

            <div className="mt-5">
              <p
                className="
                  font-semibold

                  dark:text-white
                "
              >
                Connected Relationships
              </p>

              {connectedRelationships
                .length === 0 ? (
                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  No relationships found.
                </p>
              ) : (
                <div
                  className="
                    mt-3
                    max-h-64
                    space-y-3
                    overflow-y-auto
                  "
                >
                  {connectedRelationships.map(
                    (edge) => {
                      const otherNodeId =
                        edge.source ===
                        selectedNode.id
                          ? edge.target
                          : edge.source;

                      const otherNode =
                        nodes.find(
                          (node) =>
                            node.id ===
                            otherNodeId
                        );

                      return (
                        <div
                          key={
                            edge.id
                          }
                          className="
                            rounded-xl
                            bg-slate-50
                            p-3

                            dark:bg-slate-800
                          "
                        >
                          <p
                            className="
                              text-sm
                              font-medium

                              dark:text-white
                            "
                          >
                            {edge.label}
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-slate-500
                            "
                          >
                            {otherNode
                              ?.data
                              .label ||
                              "Unknown entity"}
                          </p>

                          {edge.data
                            ?.confidence !==
                            undefined && (
                            <p
                              className="
                                mt-2
                                text-xs
                                text-slate-400
                              "
                            >
                              Confidence:{" "}
                              {Math.round(
                                edge
                                  .data
                                  .confidence *
                                  100
                              )}
                              %
                            </p>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}