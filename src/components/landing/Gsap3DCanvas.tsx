import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Gsap3DCanvasProps {
  className?: string;
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  pulsePhase: number;
}

export const Gsap3DCanvas: React.FC<Gsap3DCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - width / 2) / (width / 2);
      const y = (e.clientY - rect.top - height / 2) / (height / 2);
      
      // Smoothly update target with GSAP
      gsap.to(mouseRef.current, {
        targetX: x * 0.8,
        targetY: y * 0.8,
        duration: 1.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Create 3D Nodes
    const nodeCount = 55;
    const nodes: Node3D[] = [];
    const colors = ['#d87943', '#527575', '#e78a53', '#94a3b8', '#38bdf8'];

    for (let i = 0; i < nodeCount; i++) {
      const bx = (Math.random() - 0.5) * 1400;
      const by = (Math.random() - 0.5) * 900;
      const bz = (Math.random() - 0.5) * 800;
      nodes.push({
        x: bx,
        y: by,
        z: bz,
        baseX: bx,
        baseY: by,
        baseZ: bz,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const fov = 400;
    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse positions
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      rotationAngle += 0.002;

      const cosRot = Math.cos(rotationAngle + mouseRef.current.x * 0.5);
      const sinRot = Math.sin(rotationAngle + mouseRef.current.x * 0.5);
      const camY = mouseRef.current.y * 120;

      const projectedNodes: { x: number; y: number; scale: number; color: string; size: number }[] = [];

      // Update & project 3D points
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // 3D rotation around Y-axis
        const rx = node.baseX * cosRot - node.baseZ * sinRot;
        const rz = node.baseX * sinRot + node.baseZ * cosRot + 300;
        const ry = node.baseY + camY;

        if (rz > 0) {
          const scale = fov / (fov + rz);
          const px = rx * scale + width / 2;
          const py = ry * scale + height / 2;

          projectedNodes.push({
            x: px,
            y: py,
            scale,
            color: node.color,
            size: node.size * scale,
          });

          // Draw node dot with glow
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, node.size * scale), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = Math.min(1, Math.max(0.15, scale * 1.2));
          ctx.fill();
        }
      }

      // Draw connecting lines between nearby projected nodes
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = alpha;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
};
