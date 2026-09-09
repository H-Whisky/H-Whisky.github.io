/**
 * corgi3d.js — Q版低多边形 3D 柯基（Three.js 纯代码建模）
 * 由 chatbot.js 动态加载并挂载到悬浮按钮的 <canvas> 上。
 * 设计：面向观众的"柯基坐姿大头像"风格，含摇耳/眨眼/呼吸/兴奋蹦跳/说话点头动画。
 * 加载失败不影响页面 —— chatbot.js 会回退到原来的 2D SVG。
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const COLORS = {
  fur: 0xf2a448,      // 主毛色 暖橙
  furLight: 0xffb96a, // 亮部
  cream: 0xfff1de,    // 白毛/奶油
  dark: 0x40281a,     // 眼鼻
  blush: 0xf7a9a2,    // 耳内粉
  tongue: 0xff8f8f,
  collar: 0xe05f26,   // 项圈 深橙
  tag: 0xf7c948      // 金牌
};

const HEAD_CY = 2.05; // 头部球心绝对高度

function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.72,
    metalness: opts.metalness ?? 0.03,
    flatShading: false
  });
}

export async function mountCorgi3D(canvas, hooks = {}) {
  // 解析 DOM 尺寸
  const width = canvas.clientWidth || 130;
  const height = canvas.clientHeight || 150;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 20);
  camera.position.set(0, 1.7, 4.2);
  camera.lookAt(0, 1.25, 0);

  // ---------- 灯光 ----------
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc4a27e, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(2.5, 4.5, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd9b0, 0.5);
  rim.position.set(-3, 2, -2.5);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);

  // ---------- 地面阴影 ----------
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 40),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.012;
  scene.add(shadow);

  // ---------- 身体（柯基大面包） ----------
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), makeMat(COLORS.fur));
  body.scale.set(1.32, 1.0, 0.95);
  body.position.y = 1.0;
  root.add(body);

  // 胸前白毛 + 白色肚皮（前侧补一块扁白面，经典柯基特征）
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 24), makeMat(COLORS.cream));
  chest.scale.set(1.28, 0.92, 0.5);
  chest.position.set(0, 0.98, 0.82);
  root.add(chest);
  // 臀部小圆包（柯基没有尾巴，只有毛绒绒的屁股）
  const butt = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 18), makeMat(COLORS.furLight));
  butt.scale.set(1.0, 0.8, 0.62);
  butt.position.set(0, 0.62, -0.82);
  root.add(butt);

  // ---------- 四只小短腿（前腿可见 + 后腿暗示） ----------
  const legGeo = new THREE.CylinderGeometry(0.15, 0.17, 0.55, 14);
  const sockGeo = new THREE.SphereGeometry(0.17, 18, 14);
  const legMat = makeMat(COLORS.fur);
  const sockMat = makeMat(COLORS.cream);
  const legs = [[-0.62, 0.3], [0.62, 0.3], [-0.52, -0.18], [0.52, -0.18]];
  const legMeshes = [];
  legs.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.28, z);
    leg.rotation.x = z > 0 ? 0.16 : -0.1;
    const sock = new THREE.Mesh(sockGeo, sockMat);
    sock.scale.set(1, 0.62, 1.15);
    sock.position.set(x, 0.035, z + (z > 0 ? 0.12 : -0.06));
    root.add(leg);
    root.add(sock);
    legMeshes.push(leg);
  });

  // ---------- 头部（独立 pivot 便于点头） ----------
  const headPivot = new THREE.Group();
  headPivot.position.y = HEAD_CY;
  root.add(headPivot);
  const H = (y) => y - HEAD_CY; // 世界坐标 -> 头部局部坐标

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.68, 40, 28), makeMat(COLORS.fur));
  head.scale.set(1.06, 1.0, 0.95);
  head.position.set(0, H(2.05), 0.05);
  headPivot.add(head);

  // 口鼻白毛
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 18), makeMat(COLORS.cream));
  muzzle.scale.set(1.06, 0.82, 1.0);
  muzzle.position.set(0, H(1.78), 0.82);
  headPivot.add(muzzle);

  // 额头白纹
  const blaze = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), makeMat(COLORS.cream));
  blaze.scale.set(0.4, 1.25, 0.55);
  blaze.position.set(0, H(2.42), 0.5);
  headPivot.add(blaze);

  // 鼻子
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), makeMat(COLORS.dark, { roughness: 0.4 }));
  nose.position.set(0, H(1.74), 1.06);
  headPivot.add(nose);

  // 舌头
  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), makeMat(COLORS.tongue));
  tongue.scale.set(1.0, 0.55, 0.6);
  tongue.position.set(0, H(1.6), 1.02);
  tongue.rotation.x = 0.3;
  headPivot.add(tongue);

  // 耳朵（大三角，独立 pivot 便于转动）
  const earGeo = new THREE.ConeGeometry(0.28, 0.95, 5);
  earGeo.translate(0, 0.475, 0);
  const earInnerGeo = new THREE.ConeGeometry(0.15, 0.66, 5);
  earInnerGeo.translate(0, 0.33, 0);
  const earMat = makeMat(COLORS.fur);
  const earInnerMat = makeMat(COLORS.blush);
  const ears = [];
  [-1, 1].forEach((side) => {
    const ear = new THREE.Group();
    ear.position.set(side * 0.48, H(2.86), 0.02);
    ear.rotation.z = side * 0.42;
    const outer = new THREE.Mesh(earGeo, earMat);
    const inner = new THREE.Mesh(earInnerGeo, earInnerMat);
    inner.position.set(0, 0.02, 0.06);
    ear.add(outer);
    ear.add(inner);
    headPivot.add(ear);
    ears.push({ ear, side, baseRotZ: side * 0.42 });
  });

  // 眼睛 + 高光
  const eyeGroup = new THREE.Group();
  const eyeMat = makeMat(COLORS.dark, { roughness: 0.25 });
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyes = [];
  [-1, 1].forEach((side) => {
    const eye = new THREE.Group();
    eye.position.set(side * 0.25, H(2.28), 0.72);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), eyeMat);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), sparkMat);
    spark.position.set(side * -0.03, 0.035, 0.075);
    eye.add(ball);
    eye.add(spark);
    eyeGroup.add(eye);
    eyes.push(eye);
  });
  headPivot.add(eyeGroup);

  // 腮红（半透明扁球）
  const blushMat = new THREE.MeshBasicMaterial({
    color: 0xff9a8a, transparent: true, opacity: 0.28
  });
  [-1, 1].forEach((side) => {
    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), blushMat);
    blush.scale.set(1.25, 0.6, 0.5);
    blush.position.set(side * 0.5, H(2.02), 0.62);
    headPivot.add(blush);
  });

  // ---------- 项圈 + 金牌 ----------
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.06, 12, 40),
    makeMat(COLORS.collar, { roughness: 0.5 })
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 1.72, 0.02);
  root.add(collar);
  const tag = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16),
    makeMat(COLORS.tag, { metalness: 0.7, roughness: 0.3 })
  );
  tag.rotation.x = Math.PI / 2;
  tag.position.set(0, 1.58, 0.62);
  root.add(tag);

  // ================= 动画状态 =================
  let mood = 'idle';          // idle | excited | talk
  let moodUntil = 0;          // excited 维持到的时间点
  let blinkUntil = 0;
  let blinkState = 1;
  const clock = new THREE.Clock();

  const setMood = (m) => {
    mood = m === 'excited' ? 'excited' : (m === 'talk' ? 'talk' : 'idle');
    if (m === 'excited') moodUntil = clock.elapsedTime + 1.6;
  };

  function animate() {
    const t = clock.elapsedTime;

    // 情绪衰减：excited 倒计时结束回 idle
    if (mood === 'excited' && t > moodUntil) mood = 'idle';

    const excited = mood === 'excited';
    const talking = mood === 'talk';
    const bounceAmp = excited ? 0.14 : talking ? 0.05 : 0.025;
    const bounceSpeed = excited ? 9 : talking ? 5.5 : 2.2;
    const bob = Math.abs(Math.sin(t * bounceSpeed)) * bounceAmp;
    root.position.y = bob;
    shadow.scale.x = 1 - bob * 0.35;
    shadow.scale.z = 1 - bob * 0.35;
    shadow.material.opacity = 0.16 - bob * 0.06;

    // 整体摇摆 + 呼吸
    const breath = 1 + Math.sin(t * 2.1) * 0.012 * (excited ? 2 : 1);
    root.scale.setScalar(breath);
    root.rotation.z = Math.sin(t * 1.4) * 0.028 + (excited ? Math.sin(t * 11) * 0.03 : 0);

    // 点头（说话时更明显）
    const nod = (excited ? Math.sin(t * 11) * 0.06 : Math.sin(t * (talking ? 5.5 : 1.7)) * (talking ? 0.045 : 0.02));
    headPivot.rotation.x = nod;
    headPivot.rotation.z = excited ? Math.sin(t * 13) * 0.05 : Math.sin(t * 2.3) * 0.02;

    // 耳朵轻摇 / 兴奋竖耳抖动
    ears.forEach(({ ear, side, baseRotZ }) => {
      const twitch = Math.sin(t * (excited ? 16 : 5) + side) * (excited ? 0.14 : 0.045);
      ear.rotation.z = baseRotZ + twitch;
      ear.rotation.x = Math.sin(t * 1.3 + side * 2) * 0.06;
    });

    // 眨眼
    if (t > blinkUntil) {
      blinkUntil = t + 2.2 + Math.random() * 2.6;
    }
    const d = blinkUntil - t;
    if (d < 0.14) {
      blinkState = Math.abs(Math.sin((0.14 - d) * 30)); // 快速两段眨眼
      if (d < 0.07) blinkState = 1 - blinkState;
    }
    eyes.forEach((eye) => { eye.scale.y = Math.max(0.08, blinkState); });

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  // ================= 尺寸自适应 =================
  const onResize = () => {
    const w = canvas.clientWidth || 130;
    const h = canvas.clientHeight || 150;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(canvas);
  window.addEventListener('resize', onResize);

  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    if (ro) ro.disconnect();
    window.removeEventListener('resize', onResize);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const m = Array.isArray(o.material) ? o.material : [o.material];
        m.forEach((mm) => mm.dispose());
      }
    });
    renderer.dispose();
  };

  // 首帧前的极短预热：确保相机尺寸正确
  onResize();
  hooks.onReady && hooks.onReady();

  return { setMood, dispose };
}
