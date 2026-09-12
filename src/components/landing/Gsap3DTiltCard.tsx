import React, { useRef } from 'react';
import gsap from 'gsap';

interface Gsap3DTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number;
  perspective?: number;
  glowColor?: string;
}

export const Gsap3DTiltCard: React.FC<Gsap3DTiltCardProps> = ({
  children,
  className = '',
  maxRotation = 12,
  perspective = 1000,
  glowColor = 'rgba(216, 121, 67, 0.15)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: perspective,
      duration: 0.4,
      ease: 'power2.out',
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: x,
        y: y,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.5,
      });
    }
  };

  return (
    <div className="perspective-1000">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden transition-shadow duration-300 transform-gpu ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Dynamic Interactive Mouse Light Glow Overlay */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-0 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
        {children}
      </div>
    </div>
  );
};
