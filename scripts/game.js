const game = new (function () {
  const game = this;

  const MOUSE_BUTTON = ["left", "middle", "right"];

  let scene,
    renderer,
    camera,
    config = {
      mouse_lock: false,
    },
    keys = {},
    mouse = {
      position: { x: 0, y: 0 },
      speed: { x: 0, y: 0 },
      locked: false,
      keys: {
        left: false,
        middle: false,
        right: false,
        wheel: 0,
      },
    },
    events = {
      keydown: null,
      keypress: null,
      keyup: null,
      mousedown: null,
      mouseup: null,
    };

  const v = (this.v = (x, y, z) => {
    return new THREE.Vector3(x, y, z);
  });

  game.on = (event_name, processor) => {
    events[event_name] = processor;
  };

  const call_event = (evt, args) => {
    if (events[evt]) {
      events[evt](args);
    }
  };

  const addCube = (this.addCube = (conf) => {
    let cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ color: conf.color })
    );
    cube.position.copy(conf.position);
    scene.add(cube);
    return cube;
  });

  game.getCamera = () => {
    return camera;
  };

  const animate = (this.animate = () => {
    call_event("keydown", keys);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });

  this.init = (settings) => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (settings.keys_capture) {
      window.addEventListener("keydown", (e) => {
        // e.preventDefault();
        if (!keys[e.code]) {
          keys[e.code] = true;
          call_event("keypress", keys);
        }
      });
      window.addEventListener("keyup", (e) => {
        // e.preventDefault();
        keys[e.code] = false;
        call_event("keyup", keys);
      });
    }

    if (settings.mouse_capture) {
      if (settings.mouse_lock) {
        config.mouse_lock = true;
        document.addEventListener("pointerlockchange", (e) => {
          mouse.locked = !!document.pointerLockElement;
        });
      }

      window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      window.addEventListener("mousedown", (e) => {
        e.preventDefault();
        mouse.keys[MOUSE_BUTTON[e.button]] = true;
        call_event("mousedown", mouse);
        if (config.mouse_lock && !mouse.locked) {
          document.body.requestPointerLock();
        }
      });

      window.addEventListener("mouseup", (e) => {
        e.preventDefault();
        mouse.keys[MOUSE_BUTTON[e.button]] = false;
        call_event("mouseup", mouse);
      });

      window.addEventListener("mousemove", (e) => {
        e.preventDefault();
        mouse.position.x = e.screenX;
        mouse.position.y = e.screenY;
        mouse.speed.z = e.movementX;
        mouse.speed.y = e.movementY;
        call_event("mousemove", mouse);
      });
    }

    document.body.appendChild(renderer.domElement);
    animate();
  };
})();
