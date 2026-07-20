"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from "reactflow";

import dagre from "dagre";

import {
  Search,
  Network,
  GitBranch,
  X,
} from "lucide-react";

import "reactflow/dist/style.css";


interface Relationship {
  id: number;
  source: string;
  source_type?: string;
  relation: string;
  target: string;
  target_type?: string;
  confidence?: number;
}


interface Props {
  documentId: number;
}


interface SelectedNode {
  name: string;
  type: string;
}


const NODE_WIDTH = 190;
const NODE_HEIGHT = 60;


/*
|--------------------------------------------------------------------------
| Node Colors
|--------------------------------------------------------------------------
*/

function getNodeStyle(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("person")) {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "2px solid #86efac",
    };
  }

  if (
    normalizedType.includes("organization") ||
    normalizedType.includes("company")
  ) {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "2px solid #93c5fd",
    };
  }

  if (
    normalizedType.includes("technology") ||
    normalizedType.includes("software")
  ) {
    return {
      background: "#f3e8ff",
      color: "#7e22ce",
      border: "2px solid #d8b4fe",
    };
  }

  if (
    normalizedType.includes("product") ||
    normalizedType.includes("model")
  ) {
    return {
      background: "#ffedd5",
      color: "#c2410c",
      border: "2px solid #fdba74",
    };
  }

  if (normalizedType.includes("location")) {
    return {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "2px solid #fca5a5",
    };
  }

  if (normalizedType.includes("date")) {
    return {
      background: "#f1f5f9",
      color: "#475569",
      border: "2px solid #cbd5e1",
    };
  }

  return {
    background: "#f8fafc",
    color: "#334155",
    border: "2px solid #cbd5e1",
  };
}


/*
|--------------------------------------------------------------------------
| Dagre Automatic Layout
|--------------------------------------------------------------------------
*/

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[]
) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    ranksep: 130,
    nodesep: 80,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(
      edge.source,
      edge.target
    );
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,

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


export default function KnowledgeGraph({
  documentId,
}: Props) {

  const [nodes, setNodes] =
    useState<Node[]>([]);

  const [edges, setEdges] =
    useState<Edge[]>([]);

  const [relationships, setRelationships] =
    useState<Relationship[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedNode, setSelectedNode] =
    useState<SelectedNode | null>(null);


  /*
  |--------------------------------------------------------------------------
  | Load Graph
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    async function loadGraph() {

      try {

        setLoading(true);

        const response =
          await api.get(
            `/documents/${documentId}/relationships`
          );

        const data: Relationship[] =
          response.data;

        setRelationships(data);


        const nodeMap =
          new Map<string, Node>();

        const edgeList: Edge[] = [];


        data.forEach(
          (relationship, index) => {

            /*
            -------------------------------
            Source Node
            -------------------------------
            */

            if (
              !nodeMap.has(
                relationship.source
              )
            ) {

              const sourceType =
                relationship.source_type ||
                "Entity";

              nodeMap.set(
                relationship.source,
                {
                  id: relationship.source,

                  data: {
                    label:
                      relationship.source,

                    entityType:
                      sourceType,
                  },

                  position: {
                    x: 0,
                    y: 0,
                  },

                  style: {
                    ...getNodeStyle(
                      sourceType
                    ),

                    width:
                      NODE_WIDTH,

                    minHeight:
                      NODE_HEIGHT,

                    borderRadius:
                      14,

                    padding:
                      12,

                    fontWeight:
                      600,

                    fontSize:
                      13,

                    textAlign:
                      "center",

                    boxShadow:
                      "0 4px 12px rgba(15,23,42,0.08)",
                  },
                }
              );

            }


            /*
            -------------------------------
            Target Node
            -------------------------------
            */

            if (
              !nodeMap.has(
                relationship.target
              )
            ) {

              const targetType =
                relationship.target_type ||
                "Entity";

              nodeMap.set(
                relationship.target,
                {
                  id: relationship.target,

                  data: {
                    label:
                      relationship.target,

                    entityType:
                      targetType,
                  },

                  position: {
                    x: 0,
                    y: 0,
                  },

                  style: {
                    ...getNodeStyle(
                      targetType
                    ),

                    width:
                      NODE_WIDTH,

                    minHeight:
                      NODE_HEIGHT,

                    borderRadius:
                      14,

                    padding:
                      12,

                    fontWeight:
                      600,

                    fontSize:
                      13,

                    textAlign:
                      "center",

                    boxShadow:
                      "0 4px 12px rgba(15,23,42,0.08)",
                  },
                }
              );

            }


            /*
            -------------------------------
            Relationship Edge
            -------------------------------
            */

            const confidence =
              relationship.confidence ??
              1;

            edgeList.push({

              id:
                `edge-${relationship.id}-${index}`,

              source:
                relationship.source,

              target:
                relationship.target,

              label:
                relationship.relation,

              animated:
                confidence >= 0.9,

              markerEnd: {
                type:
                  MarkerType.ArrowClosed,
              },

              style: {
                strokeWidth:
                  confidence >= 0.9
                    ? 2.5
                    : confidence >= 0.7
                    ? 2
                    : 1.5,
              },

              labelStyle: {
                fontSize: 11,
                fontWeight: 600,
              },

              labelBgStyle: {
                fillOpacity: 0.9,
              },

            });

          }
        );


        /*
        -------------------------------
        Apply Dagre Layout
        -------------------------------
        */

        const layout =
          getLayoutedElements(
            [
              ...nodeMap.values()
            ],
            edgeList
          );


        setNodes(
          layout.nodes
        );

        setEdges(
          layout.edges
        );


      } catch (error) {

        console.error(
          "Failed to load knowledge graph:",
          error
        );

        setNodes([]);
        setEdges([]);
        setRelationships([]);

      } finally {

        setLoading(false);

      }

    }


    loadGraph();

  }, [documentId]);


  /*
  |--------------------------------------------------------------------------
  | Search Matching Nodes
  |--------------------------------------------------------------------------
  */

  const searchResults =
    useMemo(() => {

      if (!search.trim()) {
        return [];
      }

      const query =
        search
          .trim()
          .toLowerCase();

      return nodes.filter(
        (node) =>

          String(
            node.data?.label || ""
          )
            .toLowerCase()
            .includes(query)

      );

    }, [search, nodes]);


  /*
  |--------------------------------------------------------------------------
  | Selected Node Relationships
  |--------------------------------------------------------------------------
  */

  const connectedRelationships =
    useMemo(() => {

      if (!selectedNode) {
        return [];
      }

      return relationships.filter(
        (relationship) =>

          relationship.source ===
            selectedNode.name ||

          relationship.target ===
            selectedNode.name

      );

    }, [
      selectedNode,
      relationships,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-800
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-slate-900

            dark:text-white
          "
        >
          Knowledge Graph
        </h2>

        <p
          className="
            mt-3
            text-slate-500

            dark:text-slate-400
          "
        >
          Loading AI knowledge graph...
        </p>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Empty Graph
  |--------------------------------------------------------------------------
  */

  if (
    nodes.length === 0
  ) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-800
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Network
            size={28}
            className="
              text-blue-600
            "
          />

          <h2
            className="
              text-2xl
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            Knowledge Graph
          </h2>

        </div>

        <p
          className="
            mt-4
            text-slate-500

            dark:text-slate-400
          "
        >
          No relationships were found
          for this document.
        </p>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <ReactFlowProvider>

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-800
        "
      >

        {/* Header */}

        <div
          className="
            border-b
            border-slate-200
            p-6

            dark:border-slate-700
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Network
                  size={28}
                  className="
                    text-blue-600
                  "
                />

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Knowledge Graph
                </h2>

              </div>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Explore entities and
                semantic relationships
                extracted by IndusBrain AI.
              </p>

            </div>


            {/* Search */}

            <div
              className="
                relative
                w-full
                lg:w-80
              "
            >

              <Search
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                value={search}

                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }

                placeholder="Search entity..."

                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-3
                  pl-10
                  pr-4
                  text-sm
                  outline-none

                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100

                  dark:border-slate-600
                  dark:bg-slate-900
                  dark:text-white
                "
              />

            </div>

          </div>


          {/* Stats */}

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-4

              md:grid-cols-3
            "
          >

            <div
              className="
                rounded-xl
                bg-slate-50
                p-4

                dark:bg-slate-900
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Entities
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-slate-900

                  dark:text-white
                "
              >
                {nodes.length}
              </p>

            </div>


            <div
              className="
                rounded-xl
                bg-slate-50
                p-4

                dark:bg-slate-900
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Relationships
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-slate-900

                  dark:text-white
                "
              >
                {edges.length}
              </p>

            </div>


            <div
              className="
                col-span-2
                rounded-xl
                bg-slate-50
                p-4

                md:col-span-1

                dark:bg-slate-900
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Search Matches
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-slate-900

                  dark:text-white
                "
              >
                {
                  search.trim()
                    ? searchResults.length
                    : "—"
                }
              </p>

            </div>

          </div>

        </div>


        {/* Graph Area */}

        <div
          className="
            relative
            h-[700px]
            bg-slate-50

            dark:bg-slate-950
          "
        >

          <ReactFlow

            nodes={nodes}

            edges={edges}

            fitView

            fitViewOptions={{
              padding: 0.25,
            }}

            minZoom={0.15}

            maxZoom={2}

            onNodeClick={(
              _event,
              node
            ) => {

              setSelectedNode({

                name:
                  String(
                    node.data?.label ||
                    node.id
                  ),

                type:
                  String(
                    node.data
                      ?.entityType ||
                    "Entity"
                  ),

              });

            }}

          >

            <MiniMap
              pannable
              zoomable
            />

            <Controls />

            <Background
              gap={22}
              size={1}
            />

          </ReactFlow>


          {/* Search Results */}

          {search.trim() &&
            searchResults.length > 0 && (

              <div
                className="
                  absolute
                  right-4
                  top-4
                  z-10
                  max-h-60
                  w-72
                  overflow-y-auto
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-3
                  shadow-xl

                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >

                <p
                  className="
                    mb-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Search Results
                </p>

                {searchResults.map(
                  (node) => (

                    <button
                      key={
                        node.id
                      }

                      onClick={() =>

                        setSelectedNode({

                          name:
                            String(
                              node.data
                                ?.label ||
                              node.id
                            ),

                          type:
                            String(
                              node.data
                                ?.entityType ||
                              "Entity"
                            ),

                        })

                      }

                      className="
                        block
                        w-full
                        rounded-lg
                        px-3
                        py-2
                        text-left
                        text-sm
                        font-medium
                        text-slate-700

                        hover:bg-slate-100

                        dark:text-slate-200
                        dark:hover:bg-slate-700
                      "
                    >

                      {
                        String(
                          node.data
                            ?.label ||
                          node.id
                        )
                      }

                    </button>

                  )
                )}

              </div>

            )}


          {/* Selected Node Panel */}

          {selectedNode && (

            <div
              className="
                absolute
                bottom-4
                right-4
                z-20
                w-80
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-2xl

                dark:border-slate-700
                dark:bg-slate-800
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-blue-600
                    "
                  >
                    {
                      selectedNode.type
                    }
                  </p>

                  <h3
                    className="
                      mt-1
                      text-lg
                      font-bold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    {
                      selectedNode.name
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
                    text-slate-400

                    hover:bg-slate-100
                    hover:text-slate-700

                    dark:hover:bg-slate-700
                  "
                >

                  <X size={18} />

                </button>

              </div>


              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-700

                  dark:text-slate-200
                "
              >

                <GitBranch
                  size={17}
                />

                Connected Relationships

              </div>


              <div
                className="
                  mt-3
                  max-h-48
                  space-y-2
                  overflow-y-auto
                "
              >

                {
                  connectedRelationships
                    .map(
                      (
                        relationship
                      ) => (

                        <div
                          key={
                            relationship.id
                          }

                          className="
                            rounded-lg
                            bg-slate-50
                            p-3
                            text-xs
                            text-slate-600

                            dark:bg-slate-900
                            dark:text-slate-300
                          "
                        >

                          <div
                            className="
                              font-semibold
                            "
                          >

                            {
                              relationship
                                .source
                            }

                            {" → "}

                            {
                              relationship
                                .target
                            }

                          </div>

                          <div
                            className="
                              mt-1
                              text-slate-500
                            "
                          >

                            {
                              relationship
                                .relation
                            }

                            {
                              relationship
                                .confidence !==
                                undefined && (

                                  <span>
                                    {" • "}
                                    {Math.round(
                                      relationship
                                        .confidence *
                                        100
                                    )}
                                    %
                                  </span>

                                )
                            }

                          </div>

                        </div>

                      )
                    )
                }

              </div>

            </div>

          )}

        </div>

      </div>

    </ReactFlowProvider>

  );

}