export class TextureGenerator {
  static generateTextures(scene) {
    if (scene.textures.exists('track_ground')) return;

    // 1. Sand / Beach Grass Ground Texture
    const trackCanvas = scene.textures.createCanvas('track_ground', 512, 512);
    if (trackCanvas) {
      const ctx = trackCanvas.context;
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#EAB308';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, 2, 2);
      }
      trackCanvas.refresh();
    }

    // 2. Road Asphalt Texture
    const roadCanvas = scene.textures.createCanvas('road_asphalt', 256, 256);
    if (roadCanvas) {
      const ctx = roadCanvas.context;
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 300; i++) {
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 2);
      }
      roadCanvas.refresh();
    }

    // 3. Palm Tree Sprite
    const palmCanvas = scene.textures.createCanvas('palm_tree', 80, 120);
    if (palmCanvas) {
      const ctx = palmCanvas.context;
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(40, 120);
      ctx.quadraticCurveTo(35, 60, 40, 40);
      ctx.stroke();

      const leafColors = ['#15803D', '#16A34A', '#22C55E'];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.fillStyle = leafColors[i % 3];
        ctx.beginPath();
        ctx.ellipse(
          40 + Math.cos(angle) * 20,
          35 + Math.sin(angle) * 12,
          25,
          10,
          angle,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      palmCanvas.refresh();
    }

    // 4. Checkpoint Gate Arch
    const checkCanvas = scene.textures.createCanvas('checkpoint_arch', 180, 120);
    if (checkCanvas) {
      const ctx = checkCanvas.context;
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(10, 30, 20, 90);
      ctx.fillRect(150, 30, 20, 90);

      ctx.fillStyle = '#0284C7';
      ctx.fillRect(5, 5, 170, 35);
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 4;
      ctx.strokeRect(5, 5, 170, 35);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MATH CHECKPOINT', 90, 28);
      checkCanvas.refresh();
    }

    // 5. Finish Line Arch
    const finishCanvas = scene.textures.createCanvas('finish_arch', 200, 130);
    if (finishCanvas) {
      const ctx = finishCanvas.context;
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(10, 30, 20, 100);
      ctx.fillRect(170, 30, 20, 100);

      ctx.fillStyle = '#DC2626';
      ctx.fillRect(5, 5, 190, 40);

      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 10; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(15 + c * 17, 10 + r * 15, 17, 15);
          }
        }
      }

      ctx.fillStyle = '#FACC15';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FINISH LINE', 100, 32);
      finishCanvas.refresh();
    }

    // 6. Gold Coin
    const coinCanvas = scene.textures.createCanvas('gold_coin', 32, 32);
    if (coinCanvas) {
      const ctx = coinCanvas.context;
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(16, 16, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#CA8A04';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('$', 16, 21);
      coinCanvas.refresh();
    }

    // 7. Nitro Flame
    const nitroCanvas = scene.textures.createCanvas('nitro_flame', 32, 48);
    if (nitroCanvas) {
      const ctx = nitroCanvas.context;
      const grad = ctx.createLinearGradient(16, 0, 16, 48);
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(0.5, '#F97316');
      grad.addColorStop(1, '#EF4444');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(16, 48);
      ctx.quadraticCurveTo(0, 24, 16, 0);
      ctx.quadraticCurveTo(32, 24, 16, 48);
      ctx.fill();
      nitroCanvas.refresh();
    }

    // 8. Boost Pad
    const padCanvas = scene.textures.createCanvas('boost_pad', 64, 40);
    if (padCanvas) {
      const ctx = padCanvas.context;
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, 0, 64, 40);

      ctx.fillStyle = '#34D399';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(32, 5 + i * 11);
        ctx.lineTo(12, 18 + i * 11);
        ctx.lineTo(52, 18 + i * 11);
        ctx.closePath();
        ctx.fill();
      }
      padCanvas.refresh();
    }
  }

  static createPlayerCarTexture(
    scene,
    key,
    paintHex,
    decalId,
    wheelColor
  ) {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }

    const canvas = scene.textures.createCanvas(key, 60, 100);
    if (!canvas) return;
    const ctx = canvas.context;

    const cx = 30;
    const cy = 50;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(cx - 24, cy - 42, 48, 84, 12);
    ctx.fill();

    let rimColor = '#94A3B8';
    if (wheelColor === 'wheel_gold') rimColor = '#EAB308';
    if (wheelColor === 'wheel_neon') rimColor = '#06B6D4';

    const drawTire = (tx, ty) => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(tx - 6, ty - 10, 12, 20);
      ctx.fillStyle = rimColor;
      ctx.fillRect(tx - 3, ty - 6, 6, 12);
    };

    drawTire(cx - 22, cy - 28);
    drawTire(cx + 22, cy - 28);
    drawTire(cx - 22, cy + 28);
    drawTire(cx + 22, cy + 28);

    ctx.fillStyle = paintHex;
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy + 38);
    ctx.lineTo(cx + 18, cy + 38);
    ctx.quadraticCurveTo(cx + 22, cy + 10, cx + 20, cy - 20);
    ctx.quadraticCurveTo(cx + 18, cy - 38, cx, cy - 42);
    ctx.quadraticCurveTo(cx - 18, cy - 38, cx - 20, cy - 20);
    ctx.quadraticCurveTo(cx - 22, cy + 10, cx - 18, cy + 38);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(cx - 14, cy - 20, 28, 28, 6);
    ctx.fill();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(cx - 11, cy - 18, 22, 10, 4);
    ctx.fill();

    if (decalId === 'decal_stripes') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx - 8, cy - 40, 4, 76);
      ctx.fillRect(cx + 4, cy - 40, 4, 76);
    } else if (decalId === 'decal_lightning') {
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 35);
      ctx.lineTo(cx - 6, cy - 25);
      ctx.lineTo(cx - 1, cy - 25);
      ctx.lineTo(cx - 7, cy - 10);
      ctx.lineTo(cx + 4, cy - 22);
      ctx.lineTo(cx - 1, cy - 22);
      ctx.closePath();
      ctx.fill();
    } else if (decalId === 'decal_flames') {
      ctx.fillStyle = '#F97316';
      ctx.fillRect(cx - 18, cy - 10, 4, 30);
      ctx.fillRect(cx + 14, cy - 10, 4, 30);
    }

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 22, cy + 34, 44, 6);

    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(cx - 16, cy - 41, 6, 4);
    ctx.fillRect(cx + 10, cy - 41, 6, 4);

    canvas.refresh();
  }

  static createAICarTexture(scene, key, hexColor) {
    if (scene.textures.exists(key)) return;

    const canvas = scene.textures.createCanvas(key, 60, 100);
    if (!canvas) return;
    const ctx = canvas.context;

    const cx = 30;
    const cy = 50;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(cx - 24, cy - 42, 48, 84, 12);
    ctx.fill();

    const drawTire = (tx, ty) => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(tx - 6, ty - 10, 12, 20);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(tx - 3, ty - 6, 6, 12);
    };

    drawTire(cx - 22, cy - 28);
    drawTire(cx + 22, cy - 28);
    drawTire(cx - 22, cy + 28);
    drawTire(cx + 22, cy + 28);

    ctx.fillStyle = hexColor;
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy + 38);
    ctx.lineTo(cx + 18, cy + 38);
    ctx.quadraticCurveTo(cx + 22, cy + 10, cx + 20, cy - 20);
    ctx.quadraticCurveTo(cx + 18, cy - 38, cx, cy - 42);
    ctx.quadraticCurveTo(cx - 18, cy - 38, cx - 20, cy - 20);
    ctx.quadraticCurveTo(cx - 22, cy + 10, cx - 18, cy + 38);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(cx - 14, cy - 20, 28, 28, 6);
    ctx.fill();

    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.roundRect(cx - 11, cy - 18, 22, 10, 4);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 22, cy + 34, 44, 6);

    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(cx - 16, cy - 41, 6, 4);
    ctx.fillRect(cx + 10, cy - 41, 6, 4);

    canvas.refresh();
  }
}
