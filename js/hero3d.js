/* =========================================================
   Hero 3D scene (Three.js) - floating wooden objects
   ========================================================= */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero-section');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  /* ---- Procedural wood texture ---- */
  function woodTexture(base, dark, rings) {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < rings; i++) {
      g.strokeStyle = dark;
      g.globalAlpha = 0.08 + Math.random() * 0.18;
      g.lineWidth = 1 + Math.random() * 4;
      g.beginPath();
      const y0 = (i / rings) * 512;
      g.moveTo(0, y0);
      for (let x = 0; x <= 512; x += 16) {
        g.lineTo(x, y0 + Math.sin(x * 0.012 + i) * 10 + Math.sin(x * 0.05 + i * 2) * 3);
      }
      g.stroke();
    }
    // knots
    g.globalAlpha = 0.25;
    for (let k = 0; k < 3; k++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      for (let r = 4; r < 34; r += 5) {
        g.beginPath();
        g.ellipse(x, y, r * 1.6, r, 0, 0, Math.PI * 2);
        g.stroke();
      }
    }
    g.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  const walnutTex = woodTexture('#6b3f22', '#2b160a', 60);
  const oakTex = woodTexture('#c98b52', '#6b3f1d', 50);
  const beechTex = woodTexture('#e2b27c', '#8a5a2e', 45);

  const mat = (tex) => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.05 });

  /* ---- Lights ---- */
  scene.add(new THREE.AmbientLight(0xffe8d0, 0.75));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.1);
  key.position.set(5, 8, 10);
  scene.add(key);
  const rim = new THREE.PointLight(0xffa860, 1.2, 40);
  rim.position.set(-8, -4, 6);
  scene.add(rim);

  /* ---- Objects ---- */
  const group = new THREE.Group();
  scene.add(group);
  const objects = [];

  function add(mesh, x, y, z, s) {
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(s);
    mesh.userData = {
      base: new THREE.Vector3(x, y, z),
      speed: 0.3 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      rot: new THREE.Vector3((Math.random() - .5) * .01, (Math.random() - .5) * .014, (Math.random() - .5) * .008)
    };
    mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    group.add(mesh);
    objects.push(mesh);
  }

  // Wood slice (log cross-section)
  function woodSlice() {
    const g = new THREE.Group();
    const bark = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.35, 48), mat(walnutTex));
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.92, 48), new THREE.MeshStandardMaterial({ map: ringTex(), roughness: .6 }));
    face.rotation.x = -Math.PI / 2; face.position.y = 0.176;
    const face2 = face.clone(); face2.rotation.x = Math.PI / 2; face2.position.y = -0.176;
    g.add(bark, face, face2);
    return g;
  }
  function ringTex() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#e4b27a'; g.fillRect(0, 0, 256, 256);
    for (let r = 4; r < 128; r += 6 + Math.random() * 4) {
      g.strokeStyle = 'rgba(120,70,30,' + (0.25 + Math.random() * .35) + ')';
      g.lineWidth = 1 + Math.random() * 2.5;
      g.beginPath(); g.arc(128 + Math.random() * 2, 128 + Math.random() * 2, r, 0, Math.PI * 2); g.stroke();
    }
    return new THREE.CanvasTexture(c);
  }

  // Bowl (lathe)
  function bowl() {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new THREE.Vector2(0.25 + Math.sin(t * Math.PI * 0.5) * 0.95, t * 0.9 - 0.45));
    }
    for (let i = 12; i >= 0; i--) {
      const t = i / 12;
      pts.push(new THREE.Vector2(0.2 + Math.sin(t * Math.PI * 0.5) * 0.85, t * 0.85 - 0.35));
    }
    const m = mat(oakTex); m.side = THREE.DoubleSide;
    return new THREE.Mesh(new THREE.LatheGeometry(pts, 48), m);
  }

  // Vase (lathe)
  function vase() {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector2(0.35 + Math.sin(t * Math.PI) * 0.45 - t * 0.12, t * 2 - 1));
    }
    return new THREE.Mesh(new THREE.LatheGeometry(pts, 40), mat(walnutTex));
  }

  // Spoon
  function spoon() {
    const g = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(beechTex));
    head.scale.set(1, 0.35, 1.4);
    const m = head.material; m.side = THREE.DoubleSide;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 2, 12), mat(beechTex));
    handle.rotation.x = Math.PI / 2; handle.position.z = 1.4;
    g.add(head, handle);
    return g;
  }

  // Cubes / blocks
  const block = () => new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat(oakTex));
  const plank = () => new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 0.8), mat(beechTex));
  const ball = () => new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), mat(walnutTex));
  const torus = () => new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.18, 20, 48), mat(oakTex));

  const wide = () => window.innerWidth > 992;
  function populate() {
    add(woodSlice(), -7.5, 3.4, -2, 1.1);
    add(bowl(), 7.2, -3.6, -1, 1.2);
    add(vase(), -6.6, -3.2, 0, 0.9);
    add(spoon(), 1.2, 4.6, -3, 0.9);
    add(block(), 3.4, -5, -4, 0.8);
    add(plank(), -2.4, -5.2, -3, 0.9);
    add(ball(), 8, 3.6, -3, 0.7);
    add(torus(), -1.2, 3.4, -5, 0.8);
    add(block(), -9.5, 0.2, -5, 0.55);
    add(woodSlice(), 0.2, -1.2, -8, 0.8);
  }
  populate();

  /* ---- Sawdust particles ---- */
  const pCount = 380;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffe0bb, size: 0.06, transparent: true, opacity: 0.7 }));
  scene.add(particles);

  /* ---- Interaction ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Push objects closer to the edges on mobile, and zoom out a bit
    camera.position.z = wide() ? 14 : 18;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(hero);

  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    objects.forEach((o) => {
      const d = o.userData;
      o.position.y = d.base.y + Math.sin(t * d.speed + d.phase) * 0.45;
      o.position.x = d.base.x + Math.cos(t * d.speed * 0.7 + d.phase) * 0.2;
      o.rotation.x += d.rot.x; o.rotation.y += d.rot.y; o.rotation.z += d.rot.z;
    });
    group.rotation.y = mouse.x * 0.18;
    group.rotation.x = mouse.y * 0.1;

    const arr = particles.geometry.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      arr[i * 3 + 1] -= 0.006 + (i % 5) * 0.001;
      arr[i * 3] += Math.sin(t + i) * 0.002;
      if (arr[i * 3 + 1] < -9) arr[i * 3 + 1] = 9;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = mouse.x * 0.05;

    renderer.render(scene, camera);
  }
  loop();
})();
