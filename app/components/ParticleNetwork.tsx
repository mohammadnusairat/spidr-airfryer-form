'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;  // Base position to return to
  baseY: number;
  angle: number;   // For sporadic movement
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = 60;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150; // Initial cluster radius

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          angle: Math.random() * Math.PI * 2
        });
      }

      particlesRef.current = particles;
      // Initialize mouse position to center
      mouseRef.current = { x: centerX, y: centerY };
    };

    // Update and draw particles
    const animate = () => {
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Add sporadic movement
        particle.angle += (Math.random() - 0.5) * 0.1;
        const sporadicX = Math.sin(particle.angle) * 0.5;
        const sporadicY = Math.cos(particle.angle) * 0.5;

        // Calculate target position (mouse position)
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const mouseDistance = Math.sqrt(dx * dx + dy * dy);
        
        // Only show particles within radius of mouse
        const mouseRadius = 200;
        const isInRange = mouseDistance < mouseRadius;

        if (isInRange) {
          // Move towards mouse position
          particle.vx = (dx / mouseDistance) * 0.5 + sporadicX;
          particle.vy = (dy / mouseDistance) * 0.5 + sporadicY;
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Limit speed
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > 1) {
            particle.vx = (particle.vx / speed);
            particle.vy = (particle.vy / speed);
          }

          // Draw connections near mouse with gradient
          if (mouseDistance < 160) {
            const opacity = (1 - mouseDistance / 160) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const particle2 = particles[j];
          const dx2 = particle2.x - particle.x;
          const dy2 = particle2.y - particle.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (distance2 < 100) {
            const opacity = (1 - distance2 / 100) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        }

          // Draw particle
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Add subtle white glow
          const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, 2
          );
          glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
          glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } // Close isInRange block
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Initialize and start animation
    initParticles();
    animate();
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
