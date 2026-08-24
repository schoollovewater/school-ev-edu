import { useState, useCallback, useMemo } from 'react';
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
import termsData from '../data/terms.json';
import TermModal from '../components/TermModal';

// Custom Node for the block diagram look
const CustomNode = ({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-slate-300 min-w-[140px] text-center">
      <Handle type="target" position={targetPosition} className="w-2 h-2 !bg-slate-400" />
      <div className="font-bold text-slate-800 text-sm">{data.label}</div>
      {data.subLabel && <div className="text-[10px] text-slate-500 mt-1 leading-tight">{data.subLabel}</div>}
      <Handle type="source" position={sourcePosition} className="w-2 h-2 !bg-slate-400" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const getEdgeColor = (type) => {
  switch (type) {
    case 'ethernet': return '#3b82f6'; // blue
    case 'info-can': return '#0ea5e9'; // light blue
    case 'pt-can': return '#ef4444'; // red
    case 'ch-can': return '#ef4444'; // red
    case 'hv-can': return '#f97316'; // orange
    case 'body-can': return '#eab308'; // yellow
    case 'adas-can': return '#8b5cf6'; // purple
    case 'lin': 
    case 'adas-lin':
    case 'vcu-lin':
    case 'bcm-lin':
    case 'apm-lin':
    case 'ccu-lin': return '#22c55e'; // green
    case 'gmsl': return '#1e293b'; // dark slate
    default: return '#94a3b8'; // gray
  }
};

const getCustomLayout = (nodes) => {
  const anchors = {
    center: { x: 0, y: 0 },
    info: { x: 0, y: -400 },
    adas: { x: -800, y: 0 },
    powertrain: { x: 0, y: 400 },
    body: { x: 800, y: 0 },
    chassis: { x: -400, y: 400 },
    thermal: { x: 400, y: 400 },
  };

  const domainCounters = {
    info: 0,
    adas: 0,
    powertrain: 0,
    body: 0,
    chassis: 0,
    center: 0,
    thermal: 0
  };

  const layoutedNodes = nodes.map((node) => {
    let domain = node.data.fullTerm.domain || 'center';
    if (!anchors[domain]) {
      domain = 'center'; // Robust fallback
    }
    const isGateway = node.id === 'xgw';
    
    let x = anchors[domain].x;
    let y = anchors[domain].y;

    if (!isGateway) {
      // Calculate grid offset based on domain counter
      const count = domainCounters[domain]++;
      const cols = domain === 'adas' || domain === 'body' ? 3 : 4;
      const row = Math.floor(count / cols);
      const col = count % cols;
      
      const xOffset = (col - (cols - 1) / 2) * 180;
      const yOffset = (row + 1) * 100; // Start below the anchor

      x += xOffset;
      y += yOffset;

      // Adjust handles based on domain to make connections look better
      if (domain === 'adas') {
        node.targetPosition = Position.Right;
        node.sourcePosition = Position.Left;
      } else if (domain === 'body') {
        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;
      } else if (domain === 'info') {
        node.targetPosition = Position.Bottom;
        node.sourcePosition = Position.Top;
      }
    }

    return {
      ...node,
      position: { x, y }
    };
  });

  return layoutedNodes;
};

export default function Map() {
  const [selectedTerm, setSelectedTerm] = useState(null);

  const initialElements = useMemo(() => {
    const rawNodes = termsData.map((t) => ({
      id: t.id,
      type: 'custom',
      data: { label: t.acronym, subLabel: t.term, fullTerm: t },
      position: { x: 0, y: 0 },
    }));

    const layoutedNodes = getCustomLayout(rawNodes);

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

    return { nodes: layoutedNodes, edges: initialEdges };
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
      <div className="absolute top-4 left-4 z-10 p-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-md pointer-events-none">
        <h1 className="text-sm font-bold text-slate-800 mb-2">Sơ đồ Kiến trúc E/E</h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-medium text-slate-600">
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-blue-500 block"></span> Ethernet</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-red-500 block"></span> PT/CH CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-yellow-500 block"></span> Body CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-sky-500 block"></span> Info CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-purple-500 block"></span> ADAS CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-green-500 block"></span> LIN Bus</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-orange-500 block"></span> HV CAN</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1 bg-slate-800 block"></span> GMSL</div>
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
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.05}
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls className="!mb-20 !mr-4 bg-white rounded-lg shadow-lg border border-slate-200" />
        </ReactFlow>
      </div>

      {selectedTerm && (
        <TermModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
      )}
    </div>
  );
}
