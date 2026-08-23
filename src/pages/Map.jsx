import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import termsData from '../data/terms.json';
import TermModal from '../components/TermModal';

// Custom Node for the block diagram look
const CustomNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-slate-300 min-w-[120px] text-center">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400" />
      <div className="font-bold text-slate-800 text-sm">{data.label}</div>
      {data.subLabel && <div className="text-[10px] text-slate-500 mt-1 leading-tight">{data.subLabel}</div>}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const getEdgeColor = (type) => {
  switch (type) {
    case 'ethernet': return '#eab308'; // yellow
    case 'can': return '#0ea5e9'; // blue
    case 'pt_can': return '#ef4444'; // red
    case 'ch_can': return '#ef4444'; // red
    case 'body_can': return '#eab308'; // yellow
    case 'info_can': return '#0ea5e9'; // blue
    case 'lin': return '#22c55e'; // green
    case 'lvds': return '#1e293b'; // dark
    default: return '#94a3b8'; // gray
  }
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 60 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - 150 / 2,
        y: nodeWithPosition.y - 60 / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function Map() {
  const [selectedTerm, setSelectedTerm] = useState(null);

  const initialElements = useMemo(() => {
    const initialNodes = termsData.map((t) => ({
      id: t.id,
      type: 'custom',
      data: { label: t.acronym, subLabel: t.term, fullTerm: t },
      position: { x: 0, y: 0 },
    }));

    const initialEdges = termsData
      .filter((t) => t.parentId)
      .map((t) => ({
        id: `e-${t.parentId}-${t.id}`,
        source: t.parentId,
        target: t.id,
        type: 'step', // Orthogonal edges
        animated: false,
        style: { stroke: getEdgeColor(t.edgeType), strokeWidth: 2 },
      }));

    return getLayoutedElements(initialNodes, initialEdges, 'TB');
  }, []);

  const [nodes, setNodes] = useNodesState(initialElements.nodes);
  const [edges, setEdges] = useEdgesState(initialElements.edges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    if (node.data && node.data.fullTerm) {
      setSelectedTerm(node.data.fullTerm);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 relative">
      <div className="absolute top-4 left-4 z-10 p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm pointer-events-none">
        <h1 className="text-sm font-bold text-slate-800 mb-1">Kiến trúc E/E Ô tô điện</h1>
        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-red-500 block"></span> Powertrain / Chassis CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-yellow-500 block"></span> Body CAN / Ethernet</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-blue-500 block"></span> Info CAN / ADAS CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-green-500 block"></span> LIN Bus</div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.1}
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls className="!mb-20 !mr-4" />
        </ReactFlow>
      </div>

      {selectedTerm && (
        <TermModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
      )}
    </div>
  );
}
