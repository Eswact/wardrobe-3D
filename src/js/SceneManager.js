export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();

    this._initScene();
    this._initCamera();
    this._initRenderer();  // renderer must exist before controls
    this._initControls();
    this._initLights();
    this._initResizeHandler();
    this._startRenderLoop();
  }

  _initScene() {
    this.scene.background = new THREE.Color(0x1a1e2a);
    this.scene.fog = new THREE.FogExp2(0x1a1e2a, 0.012);
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camera.position.set(5, 9, -24);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    document.body.appendChild(this.renderer.domElement);
  }

  _initControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(5, 5, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 60;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.update();
  }

  _initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    this.scene.add(new THREE.HemisphereLight(0xdde8f0, 0x2a1a0a, 0.5));

    const key = new THREE.DirectionalLight(0xfff5e8, 1.4);
    key.position.set(12, 22, -18);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near   = 5;
    key.shadow.camera.far    = 80;
    key.shadow.camera.left   = -20;
    key.shadow.camera.right  =  25;
    key.shadow.camera.top    =  20;
    key.shadow.camera.bottom = -5;
    key.shadow.bias = -0.001;  // prevents shadow acne on flat surfaces
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x9ab8d8, 0.4);
    fill.position.set(-12, 8, -10);
    this.scene.add(fill);
  }

  _initResizeHandler() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _startRenderLoop() {
    const tick = () => {
      requestAnimationFrame(tick);
      TWEEN.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }
}
