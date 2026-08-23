import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import termsData from '../data/terms.json';
import TermModal from '../components/TermModal';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function Map() {
  const fgRef = useRef();
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Transform termsData into graph data (nodes and links)
  const graphData = useMemo(() => {
    const nodes = termsData.map(t => ({
      id: t.id,
      name: t.acronym,
      fullName: t.term,
      val: t.childrenIds?.length > 0 ? (t.parentId === null ? 30 : 20) : 10,
      color: t.parentId === null ? '#ef4444' : (t.childrenIds?.length > 0 ? '#3b82f6' : '#10b981'),
      ...t
    }));

    const links = [];
    termsData.forEach(t => {
      if (t.parentId) {
        links.push({
          source: t.parentId,
          target: t.id,
          color: '#94a3b8'
        });
      }
    });

    return { nodes, links };
  }, []);

  const handleNodeClick = useCallback(node => {
    setSelectedTerm(node);
    
    // Auto-center and zoom into the clicked node
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2, 1000);
    }
  }, []);

  const handleZoomIn = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      fgRef.current.zoom(currentZoom * 1.5, 400);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      fgRef.current.zoom(currentZoom / 1.5, 400);
    }
  };

  const handleFit = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  };

  // Canvas custom node rendering to draw text
  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = Math.max(12 / globalScale, 4);
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    
    // Draw circle
    const nodeR = Math.sqrt(node.val) * 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeR, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Draw border
    ctx.lineWidth = 1 / globalScale;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Draw text
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + nodeR + 2, bckgDimensions[0], bckgDimensions[1]);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(label, node.x, node.y + nodeR + 2 + bckgDimensions[1] / 2);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl pointer-events-none max-w-xs">
        <h1 className="text-xl font-black text-white mb-1">Mạng lưới EV</h1>
        <p className="text-xs text-slate-300">
          Chạm vào các điểm để xem giải nghĩa thuật ngữ. Chạm và kéo để di chuyển bản đồ. Dùng hai ngón tay để thu phóng.
        </p>
      </div>

      <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleFit} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
          <Maximize className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 w-full" ref={containerRef}>
        {containerSize.width > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={containerSize.width}
            height={containerSize.height}
            graphData={graphData}
            nodeLabel="fullName"
            nodeColor="color"
            linkColor="color"
            linkWidth={1.5}
            nodeCanvasObject={paintNode}
            onNodeClick={handleNodeClick}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            cooldownTicks={100}
          />
        )}
      </div>

      {selectedTerm && (
        <TermModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
      )}
    </div>
  );
}
