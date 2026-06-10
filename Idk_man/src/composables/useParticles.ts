// useParticles.ts
export const useParticles = () => {
const spawnParticles = (e: MouseEvent, count: number, spread: number) => {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: any[] = [];
  const x = e.clientX;
  const y = e.clientY;

  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * spread,
      vy: (Math.random() - 0.5) * spread,
      alpha: 1,
      size: Math.random() * 4 + 2,
      color: `hsl(${Math.random() * 60 + 80}, 100%, 60%)`,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.alpha -= 0.03;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (particles.some((p) => p.alpha > 0)) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  };
  animate();
};
let hoverInterval: any = null;
let hoverX = 0;
let hoverY = 0;

const updateHoverPos = (e: MouseEvent) => {
  hoverX = e.clientX;
  hoverY = e.clientY;
};

const startHoverParticles = () => {
  hoverInterval = setInterval(() => {
    spawnParticles({ clientX: hoverX, clientY: hoverY } as MouseEvent, 3, 2);
  }, 100);
};

const stopHoverParticles = () => {
  clearInterval(hoverInterval);
};
return { spawnParticles, updateHoverPos, startHoverParticles, stopHoverParticles };
};
