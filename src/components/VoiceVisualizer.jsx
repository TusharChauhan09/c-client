import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

/**
 * Voice Visualizer Component
 * Displays animated bars when voice conversation is active
 */
export default function VoiceVisualizer({ isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set bar color (blue with opacity)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';

      const bars = 50;
      const barWidth = width / bars;

      // Draw animated bars
      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * height * 0.8;
        ctx.fillRect(
          i * barWidth,
          height - barHeight,
          barWidth - 2,
          barHeight
        );
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-32 bg-accent/20 rounded-lg overflow-hidden border border-accent/30"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={128}
        className="w-full h-full"
      />
    </motion.div>
  );
}
