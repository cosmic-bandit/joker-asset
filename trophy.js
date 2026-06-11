/*
 * Jokerbet — Header 3D Futbol Kupasi (v4 — responsive)
 * 3D model: "Football Trophy" by Ltomato (sketchfab.com/ltomato1477)
 * Lisans: CC-BY-4.0 — bu atif yorumu silinmemeli
 *
 * Davranis: Her ekranda gorunur.
 *           Dar ekranda (<700px) 44x44, genis ekranda 70x70.
 *           Boyut degisimine canli tepki verir (sokup kurmadan).
 */

(function () {
  "use strict";

  var GLB_URL = "https://cdn.jsdelivr.net/gh/cosmic-bandit/joker-asset@main/world_cup_trophy-sml.glb";
  var V = "0.158.0";
  var WRAP_ID = "trophy-canvas-wrap";
  var BREAKPOINT = 700;
  var SIZE_SMALL = 44;
  var SIZE_LARGE = 70;

  function waitForLogo(maxMs) {
    return new Promise(function (resolve) {
      var found = document.querySelector(".logo-container a.logo");
      if (found) { resolve(found.parentElement); return; }
      var giveUp = setTimeout(function () { if (obs) obs.disconnect(); resolve(null); }, maxMs || 15000);
      var obs = new MutationObserver(function () {
        var el = document.querySelector(".logo-container a.logo");
        if (el) { clearTimeout(giveUp); obs.disconnect(); resolve(el.parentElement); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  function alreadyMounted() {
    var existing = document.getElementById(WRAP_ID);
    return existing && document.body.contains(existing);
  }

  function boot() {
    if (alreadyMounted()) return;
    if (window.__jokerTrophyBooting) return;
    window.__jokerTrophyBooting = true;

    waitForLogo(15000).then(function (container) {
      if (!container || alreadyMounted()) {
        window.__jokerTrophyBooting = false;
        return;
      }

      var moduleCode = [
        "import * as THREE from 'https://cdn.jsdelivr.net/npm/three@" + V + "/+esm';",
        "import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@" + V + "/examples/jsm/loaders/GLTFLoader.js/+esm';",
        "import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@" + V + "/examples/jsm/loaders/DRACOLoader.js/+esm';",
        "import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@" + V + "/examples/jsm/environments/RoomEnvironment.js/+esm';",
        "",
        "try {",
        "  var WRAP_ID = '" + WRAP_ID + "';",
        "  var GLB_URL = '" + GLB_URL + "';",
        "  var V = '" + V + "';",
        "  var BREAKPOINT = " + BREAKPOINT + ";",
        "  var SIZE_SMALL = " + SIZE_SMALL + ";",
        "  var SIZE_LARGE = " + SIZE_LARGE + ";",
        "",
        "  function targetSize() {",
        "    return window.innerWidth < BREAKPOINT ? SIZE_SMALL : SIZE_LARGE;",
        "  }",
        "",
        "  var container = document.querySelector('.logo-container');",
        "  var logo = container && container.querySelector('a.logo');",
        "  if (!container || !logo) { window.__jokerTrophyBooting = false; }",
        "  else if (document.getElementById(WRAP_ID)) { window.__jokerTrophyBooting = false; }",
        "  else {",
        "    var SIZE = targetSize();",
        "    var wrap = document.createElement('div');",
        "    wrap.id = WRAP_ID;",
        "    wrap.style.cssText = 'width:' + SIZE + 'px;height:' + SIZE + 'px;display:flex;align-items:center;flex:0 0 auto;pointer-events:none;';",
        "    logo.insertAdjacentElement('afterend', wrap);",
        "",
        "    var scene = new THREE.Scene();",
        "    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);",
        "    camera.position.set(0, 0, 5);",
        "",
        "    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });",
        "    renderer.setSize(SIZE, SIZE);",
        "    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));",
        "    renderer.outputColorSpace = THREE.SRGBColorSpace;",
        "    renderer.toneMapping = THREE.ACESFilmicToneMapping;",
        "    renderer.toneMappingExposure = 1.3;",
        "    wrap.appendChild(renderer.domElement);",
        "",
        "    var pmrem = new THREE.PMREMGenerator(renderer);",
        "    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;",
        "",
        "    scene.add(new THREE.AmbientLight(0xffffff, 1.0));",
        "    var key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3,5,4); scene.add(key);",
        "    var rim = new THREE.DirectionalLight(0x01adfd, 1.2); rim.position.set(-4,2,-3); scene.add(rim);",
        "    var fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(0,-3,2); scene.add(fill);",
        "",
        "    var draco = new DRACOLoader();",
        "    draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@' + V + '/examples/jsm/libs/draco/');",
        "    var loader = new GLTFLoader();",
        "    loader.setDRACOLoader(draco);",
        "",
        "    var ANGULAR_SPEED = 0.72;",
        "    var raf = null;",
        "",
        "    loader.load(GLB_URL, function (gltf) {",
        "      try {",
        "        var model = gltf.scene;",
        "        var box = new THREE.Box3().setFromObject(model);",
        "        var size = box.getSize(new THREE.Vector3());",
        "        var center = box.getCenter(new THREE.Vector3());",
        "        var maxDim = Math.max(size.x, size.y, size.z);",
        "        var scale = 3.2 / maxDim;",
        "        model.scale.setScalar(scale);",
        "        model.position.sub(center.multiplyScalar(scale));",
        "",
        "        var pivot = new THREE.Group();",
        "        pivot.add(model);",
        "        scene.add(pivot);",
        "",
        "        var clock = new THREE.Clock();",
        "        (function animate(){",
        "          if (!document.body.contains(wrap)) {",
        "            if (raf) cancelAnimationFrame(raf);",
        "            renderer.dispose();",
        "            window.__jokerTrophyBooting = false;",
        "            return;",
        "          }",
        "          var want = targetSize();",
        "          if (want !== SIZE) {",
        "            SIZE = want;",
        "            wrap.style.width = SIZE + 'px';",
        "            wrap.style.height = SIZE + 'px';",
        "            renderer.setSize(SIZE, SIZE);",
        "          }",
        "          raf = requestAnimationFrame(animate);",
        "          var dt = clock.getDelta();",
        "          pivot.rotation.y += ANGULAR_SPEED * dt;",
        "          renderer.render(scene, camera);",
        "        })();",
        "      } catch (e) { window.__jokerTrophyBooting = false; }",
        "    }, undefined, function () { window.__jokerTrophyBooting = false; });",
        "  }",
        "} catch (e) { window.__jokerTrophyBooting = false; }"
      ].join("\n");

      var s = document.createElement("script");
      s.type = "module";
      s.textContent = moduleCode;
      document.body.appendChild(s);
    });
  }

  var recheckTimer = null;
  function recheck() {
    clearTimeout(recheckTimer);
    recheckTimer = setTimeout(function () {
      if (!alreadyMounted()) boot();
    }, 200);
  }
  window.addEventListener("resize", recheck);
  window.addEventListener("orientationchange", recheck);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();
