import React, { useEffect, useRef } from 'react';
export const BackgroundEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    // Handle window resize
    window.addEventListener('resize', setCanvasSize);
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Color variations: blue, purple, cyan
        const colors = ['rgba(65, 105, 225,', 'rgba(138, 43, 226,', 'rgba(64, 224, 208,'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${this.opacity})`;
        ctx.fill();
      }
    }
    // Create particles
    const particles: Particle[] = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw and connect particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        // Connect particles with lines if close enough
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  return <div className="absolute inset-0 overflow-hidden">
      {/* Animated particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Gradient orbs */}
      <div className="absolute top-[10%] left-[15%] h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" style={{
      animationDuration: '8s'
    }} />
      <div className="absolute top-[40%] right-[10%] h-[250px] w-[250px] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" style={{
      animationDuration: '12s',
      animationDelay: '2s'
    }} />
      <div className="absolute bottom-[15%] left-[25%] h-[200px] w-[200px] rounded-full bg-indigo-500/20 blur-[80px] animate-pulse" style={{
      animationDuration: '10s',
      animationDelay: '1s'
    }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] 
        [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] 
        [background-size:50px_50px]" />
    </div>;
};