import React, { useEffect, useRef } from 'react';

export const CarCanvas = ({
  carColor,
  equipped,
  width = 240,
  height = 160,
  animateWheels = false,
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let wheelAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let paintHex = '#2563EB';
      if (equipped?.carPaint && equipped.carPaint !== 'default') {
        if (equipped.carPaint === 'paint_purple') paintHex = '#9333EA';
        else if (equipped.carPaint === 'paint_gold') paintHex = '#F59E0B';
        else if (equipped.carPaint === 'paint_red') paintHex = '#DC2626';
        else if (equipped.carPaint === 'paint_green') paintHex = '#16A34A';
        else if (equipped.carPaint === 'paint_blue') paintHex = '#2563EB';
      } else {
        if (carColor === 'red') paintHex = '#DC2626';
        if (carColor === 'green') paintHex = '#16A34A';
        if (carColor === 'blue') paintHex = '#2563EB';
      }

      let rimHex = '#94A3B8';
      if (equipped?.wheelColor === 'wheel_gold') rimHex = '#EAB308';
      if (equipped?.wheelColor === 'wheel_neon') rimHex = '#06B6D4';

      const cx = width / 2 + 15;
      const cy = height / 2 + 18;

      // 1. Car Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 28, 85, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();

      // 2. Car Body Base
      ctx.fillStyle = paintHex;
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy + 15);
      ctx.lineTo(cx + 80, cy + 15);
      ctx.quadraticCurveTo(cx + 92, cy + 10, cx + 88, cy - 5);
      ctx.quadraticCurveTo(cx + 50, cy - 10, cx + 25, cy - 25);
      ctx.lineTo(cx - 30, cy - 25);
      ctx.quadraticCurveTo(cx - 65, cy - 20, cx - 85, cy - 5);
      ctx.quadraticCurveTo(cx - 90, cy + 10, cx - 80, cy + 15);
      ctx.closePath();
      ctx.fill();

      // Shine Gradient
      const shineGrad = ctx.createLinearGradient(cx - 80, cy - 25, cx + 80, cy + 15);
      shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      shineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      shineGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      ctx.fillStyle = shineGrad;
      ctx.fill();

      // Cockpit / Windshield
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.moveTo(cx + 25, cy - 22);
      ctx.lineTo(cx - 15, cy - 22);
      ctx.lineTo(cx - 30, cy - 8);
      ctx.lineTo(cx + 20, cy - 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.beginPath();
      ctx.moveTo(cx + 22, cy - 20);
      ctx.lineTo(cx - 10, cy - 20);
      ctx.lineTo(cx - 20, cy - 10);
      ctx.lineTo(cx + 15, cy - 10);
      ctx.closePath();
      ctx.fill();

      // Driver on Car Body (Enlarged)
      const carDriverX = cx - 5;
      const carDriverY = cy - 22;
      drawDriverHead(ctx, carDriverX, carDriverY, 1.2, equipped);

      // Decal on Side
      if (equipped?.decal && equipped.decal !== 'decal_none') {
        if (equipped.decal === 'decal_stripes') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(cx - 30, cy - 2, 70, 3);
        } else if (equipped.decal === 'decal_lightning') {
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.moveTo(cx + 10, cy - 6);
          ctx.lineTo(cx, cy + 2);
          ctx.lineTo(cx + 4, cy + 2);
          ctx.lineTo(cx - 5, cy + 8);
          ctx.lineTo(cx + 5, cy);
          ctx.lineTo(cx + 1, cy);
          ctx.closePath();
          ctx.fill();
        } else if (equipped.decal === 'decal_flames') {
          ctx.fillStyle = '#F97316';
          ctx.beginPath();
          ctx.moveTo(cx - 40, cy + 2);
          ctx.quadraticCurveTo(cx - 20, cy - 5, cx, cy + 2);
          ctx.quadraticCurveTo(cx - 20, cy + 8, cx - 40, cy + 2);
          ctx.fill();
        }
      }

      // Wheels
      const drawWheel = (wx, wy) => {
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(wx, wy, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rimHex;
        ctx.beginPath();
        ctx.arc(wx, wy, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        for (let a = 0; a < 4; a++) {
          const angle = wheelAngle + (a * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(wx, wy);
          ctx.lineTo(wx + Math.cos(angle) * 9, wy + Math.sin(angle) * 9);
          ctx.stroke();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(wx, wy, 3, 0, Math.PI * 2);
        ctx.fill();
      };

      drawWheel(cx - 50, cy + 18);
      drawWheel(cx + 50, cy + 18);

      ctx.restore();

      // 3. Prominent DRIVER SPOTLIGHT PORTRAIT (Enlarged head zoom in top-left)
      const spotlightX = 40;
      const spotlightY = 42;
      const spotlightRadius = 32;

      ctx.save();
      // Circle background badge
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(spotlightX, spotlightY, spotlightRadius + 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00F5D4';
      ctx.beginPath();
      ctx.arc(spotlightX, spotlightY, spotlightRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FF0080';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Clip inner driver avatar
      ctx.beginPath();
      ctx.arc(spotlightX, spotlightY, spotlightRadius - 1, 0, Math.PI * 2);
      ctx.clip();

      // Soft backdrop gradient
      const bgGrad = ctx.createLinearGradient(spotlightX, spotlightY - spotlightRadius, spotlightX, spotlightY + spotlightRadius);
      bgGrad.addColorStop(0, '#1E1B4B');
      bgGrad.addColorStop(1, '#312E81');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(spotlightX - spotlightRadius, spotlightY - spotlightRadius, spotlightRadius * 2, spotlightRadius * 2);

      // Draw Big Prominent Head in Spotlight
      drawDriverHead(ctx, spotlightX, spotlightY + 8, 2.2, equipped);

      ctx.restore();

      // Label below spotlight
      ctx.fillStyle = '#00F5D4';
      ctx.font = '900 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DRIVER HEAD', spotlightX, spotlightY + spotlightRadius + 12);

      if (animateWheels) {
        wheelAngle += 0.15;
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [carColor, equipped, width, height, animateWheels]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`inline-block ${className}`}
    />
  );
};

// Helper function to draw scalable driver head with all cosmetics
function drawDriverHead(ctx, x, y, scale = 1, equipped = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Outfit Shoulders
  let outfitColor = '#3B82F6';
  if (equipped?.outfit === 'outfit_neon') outfitColor = '#10B981';
  if (equipped?.outfit === 'outfit_gold') outfitColor = '#EAB308';
  ctx.fillStyle = outfitColor;
  ctx.beginPath();
  ctx.arc(0, 10, 10, Math.PI, 0);
  ctx.fill();

  // 1. LAYER ONE: Hair Back / Side Volumes (Drawn BEHIND skin face so it forms a halo frame around head)
  if (equipped?.hairstyle) {
    if (equipped.hairstyle === 'hair_curly_afro_puffs') {
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(-8, -5, 6, 0, Math.PI * 2);
      ctx.arc(8, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(-7.5, -4, 2.5, 2.5);
      ctx.fillRect(5, -4, 2.5, 2.5);
    } else if (equipped.hairstyle === 'hair_wavy_flow') {
      ctx.fillStyle = '#7C2D12';
      ctx.beginPath();
      ctx.arc(0, -3, 11, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-11, -3, 4, 12);
      ctx.fillRect(7, -3, 4, 12);
    } else if (equipped.hairstyle === 'hair_high_ponytail') {
      ctx.fillStyle = '#1E1B4B';
      ctx.beginPath();
      ctx.arc(-9, -6, 5.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (equipped.hairstyle === 'hair_afro_crown') {
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(0, -3, 13, 0, Math.PI * 2);
      ctx.fill();
    } else if (equipped.hairstyle === 'hair_braids_beads') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-10.5, -2, 3.5, 12);
      ctx.fillRect(7, -2, 3.5, 12);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-11, 9, 4, 2.5);
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(6.5, 9, 4, 2.5);
    } else if (equipped.hairstyle === 'hair_dreads_locs') {
      ctx.fillStyle = '#292524';
      ctx.fillRect(-10.5, -2, 4, 12);
      ctx.fillRect(6.5, -2, 4, 12);
    }
  }

  // 2. LAYER TWO: Skin Face Circle
  let skinHex = '#E0A96D';
  if (equipped?.skinTone === 'skin_light_glow') skinHex = '#FDE047';
  if (equipped?.skinTone === 'skin_medium_warm') skinHex = '#E0A96D';
  if (equipped?.skinTone === 'skin_deep_bronze') skinHex = '#8D5B4C';
  if (equipped?.skinTone === 'skin_rich_espresso') skinHex = '#4A2E2B';
  if (equipped?.skinTone === 'skin_sun_kissed') skinHex = '#633927';

  ctx.fillStyle = skinHex;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  // 3. LAYER THREE: Top Forehead Hairline / Spikes
  if (equipped?.hairstyle) {
    if (equipped.hairstyle === 'hair_short_fade') {
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, -2, 9.2, Math.PI * 1.15, Math.PI * 1.85);
      ctx.fill();
    } else if (equipped.hairstyle === 'hair_spiky_turbo') {
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.moveTo(-8, -4);
      ctx.lineTo(-6, -14);
      ctx.lineTo(-2, -6);
      ctx.lineTo(0, -16);
      ctx.lineTo(2, -6);
      ctx.lineTo(6, -13);
      ctx.lineTo(8, -4);
      ctx.closePath();
      ctx.fill();
    } else if (
      equipped.hairstyle === 'hair_afro_crown' ||
      equipped.hairstyle === 'hair_high_ponytail' ||
      equipped.hairstyle === 'hair_dreads_locs' ||
      equipped.hairstyle === 'hair_wavy_flow'
    ) {
      let hairCapColor = '#1E293B';
      if (equipped.hairstyle === 'hair_high_ponytail') hairCapColor = '#1E1B4B';
      if (equipped.hairstyle === 'hair_dreads_locs') hairCapColor = '#292524';
      if (equipped.hairstyle === 'hair_wavy_flow') hairCapColor = '#7C2D12';
      ctx.fillStyle = hairCapColor;
      ctx.beginPath();
      ctx.arc(0, -2, 9.2, Math.PI * 1.2, Math.PI * 1.8);
      ctx.fill();
    }
  }

  // 4. LAYER FOUR: Hats (Positioned cleanly on top of head y <= -4)
  if (equipped?.hat && equipped.hat !== 'none' && equipped.hat !== 'hat_none') {
    if (equipped.hat === 'hat_default') {
      // Racer Cap
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(0, -4, 9.5, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(0, -5, 11, 2.5);
    } else if (equipped.hat === 'hat_crown') {
      // Golden Crown
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.moveTo(-9, -7);
      ctx.lineTo(-9, -15);
      ctx.lineTo(-3, -9);
      ctx.lineTo(0, -17);
      ctx.lineTo(3, -9);
      ctx.lineTo(9, -15);
      ctx.lineTo(9, -7);
      ctx.closePath();
      ctx.fill();
    } else if (equipped.hat === 'hat_helmet') {
      // Speed Helmet Shell (Sits above eyes)
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.arc(0, -4, 10, Math.PI * 1.05, Math.PI * 1.95);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-7, -6, 14, 2.5);
    } else if (equipped.hat === 'hat_wizard') {
      // Wizard Hat
      ctx.fillStyle = '#8B5CF6';
      ctx.beginPath();
      ctx.moveTo(-10, -6);
      ctx.lineTo(0, -22);
      ctx.lineTo(10, -6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-11, -6, 22, 2.5);
    }
  }

  // 5. LAYER FIVE: Eyes & Smile (Always drawn ON TOP of face, hairline, and hat brims)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(-3, -1, 1.2, 0, Math.PI * 2);
  ctx.arc(3, -1, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 2, 4, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // 6. LAYER SIX: Glasses (Drawn over eyes)
  if (equipped?.glasses && equipped.glasses !== 'glasses_none') {
    if (equipped.glasses === 'glasses_shades') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-7, -3, 14, 4);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(-6, -2, 5, 2);
      ctx.fillRect(1, -2, 5, 2);
    } else if (equipped.glasses === 'glasses_smart') {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-7, -4, 6, 5);
      ctx.strokeRect(1, -4, 6, 5);
      ctx.beginPath();
      ctx.moveTo(-1, -2);
      ctx.lineTo(1, -2);
      ctx.stroke();
    }
  }

  ctx.restore();
}
