import React, { useRef, useEffect } from 'react';
import { DestinationId } from '../../types/mission';

interface TrajectoryCanvasProps {
  destinationId: DestinationId;
  progressPct: number; // 0 to 100
  isSimulating?: boolean;
  className?: string;
}

export const TrajectoryCanvas: React.FC<TrajectoryCanvasProps> = ({
  destinationId,
  progressPct,
  isSimulating = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let tick = 0;

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep space background with subtle starry depth
      ctx.fillStyle = '#05080D';
      ctx.fillRect(0, 0, width, height);

      // Orbital technical grid & concentric distance rings
      const centerX = width * 0.48;
      const centerY = height * 0.52;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let r = 80; r <= 360; r += 70) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Heliocentric Sun at left/focal center
      const sunX = width * 0.16;
      const sunY = height * 0.5;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 35);
      sunGlow.addColorStop(0, 'rgba(255, 230, 100, 0.9)');
      sunGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.3)');
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 9, 0, Math.PI * 2);
      ctx.fill();

      // Earth Orbit (Blue circular arc)
      const earthOrbitR = 140;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(sunX, sunY, earthOrbitR, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();

      // Target Orbit (Red/Amber circular arc)
      const targetOrbitR = destinationId === 'lunar_orbit' ? 165 : destinationId === 'mars' ? 260 : 340;
      ctx.strokeStyle = destinationId === 'mars' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)';
      ctx.beginPath();
      ctx.arc(sunX, sunY, targetOrbitR, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Earth Position
      const earthAngle = -Math.PI * 0.18;
      const earthX = sunX + Math.cos(earthAngle) * earthOrbitR;
      const earthY = sunY + Math.sin(earthAngle) * earthOrbitR;

      // Target Position (ahead in orbital phase)
      const targetAngle = Math.PI * 0.22;
      const targetX = sunX + Math.cos(targetAngle) * targetOrbitR;
      const targetY = sunY + Math.sin(targetAngle) * targetOrbitR;

      // Draw Hohmann Transfer Ellipse / Trajectory
      // Control points for a realistic Keplerian elliptical arc
      const cp1X = earthX + 90;
      const cp1Y = earthY + 20;
      const cp2X = targetX - 40;
      const cp2Y = targetY - 60;

      // Full planned trajectory curve (dashed cyan)
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(earthX, earthY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flown Trajectory Curve (solid glowing cyan up to progress)
      const t = Math.min(1, Math.max(0, progressPct / 100));

      // Cubic Bezier interpolation helper
      const getBezierPoint = (p: number) => {
        const u = 1 - p;
        const tt = p * p;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * p;

        const x = uuu * earthX + 3 * uu * p * cp1X + 3 * u * tt * cp2X + ttt * targetX;
        const y = uuu * earthY + 3 * uu * p * cp1Y + 3 * u * tt * cp2Y + ttt * targetY;
        return { x, y };
      };

      if (t > 0) {
        ctx.strokeStyle = '#00D2FF';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(0, 210, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(earthX, earthY);
        const steps = Math.floor(t * 60);
        for (let i = 1; i <= steps; i++) {
          const pt = getBezierPoint(i / 60);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Earth Graphic
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(earthX, earthY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E0F2FE';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Earth label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px IBM Plex Mono';
      ctx.fillText('EARTH (LAUNCH ORIGIN)', earthX - 45, earthY - 14);

      // Target Body Graphic
      const targetColor = destinationId === 'mars' ? '#EF4444' : destinationId === 'lunar_orbit' ? '#94A3B8' : '#F59E0B';
      ctx.fillStyle = targetColor;
      ctx.beginPath();
      ctx.arc(targetX, targetY, destinationId === 'mars' ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FECACA';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const targetLabel = destinationId === 'mars' ? 'MARS (TARGET CORRIDOR)' : destinationId === 'lunar_orbit' ? 'MOON (CISLUNAR)' : 'ASTEROID 101955';
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px IBM Plex Mono';
      ctx.fillText(targetLabel, targetX - 50, targetY + 22);

      // Spacecraft Current Position Marker
      const shipPos = getBezierPoint(t);

      // Pulse ring around spacecraft
      const pulseR = 9 + Math.sin(tick * 0.08) * 3;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(shipPos.x, shipPos.y, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      // Spacecraft Icon Core
      ctx.fillStyle = '#F2F5F7';
      ctx.beginPath();
      ctx.arc(shipPos.x, shipPos.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry HUD overlay at ship pos
      ctx.fillStyle = '#00D2FF';
      ctx.font = 'bold 9px IBM Plex Mono';
      ctx.fillText(`SC-01 [${Math.round(progressPct)}%]`, shipPos.x + 12, shipPos.y - 6);

      // Coordinate axes markers in corners
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      ctx.fillStyle = 'rgba(141, 154, 166, 0.7)';
      ctx.font = '9px IBM Plex Mono';
      ctx.fillText('HELIOCENTRIC FRAME // J2000 EQUATORIAL', 20, 25);
      ctx.fillText(`TRANSFER TRAJECTORY: ${destinationId.toUpperCase()}`, 20, height - 18);

      if (isSimulating) {
        animFrame = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [destinationId, progressPct, isSimulating]);

  return (
    <div className={`relative overflow-hidden bg-space-950 border border-space-border ${className}`}>
      {/* Corner bracket styling */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />

      <canvas
        ref={canvasRef}
        width={720}
        height={460}
        className="w-full h-full object-contain block"
      />
    </div>
  );
};
