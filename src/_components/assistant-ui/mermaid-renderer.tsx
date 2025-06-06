"use client";

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export default function MermaidRenderer({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [uniqueId] = useState(() => `mermaid-${Math.random().toString(36).substring(2, 11)}`);
  
  useEffect(() => {
    if (!ref.current) return;
    
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
    });
    
    const renderChart = async () => {
      if (!ref.current) return;
      
      try {
        // Clean the chart text (sometimes it comes with extra backticks or newlines)
        const cleanChart = chart.replace(/^```mermaid\n?/, '').replace(/```$/, '').trim();
        
        // Render the chart
        const { svg } = await mermaid.render(uniqueId, cleanChart);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Error rendering mermaid chart:', error);
        if (ref.current) {
          ref.current.innerHTML = `<pre className="text-red-500">Error rendering Mermaid diagram</pre>`;
        }
      }
    };
    
    renderChart();
  }, [chart, uniqueId]);

  return <div className="mermaid-container my-4 overflow-auto" ref={ref} />;
} 