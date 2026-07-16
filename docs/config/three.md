# three

## 什么是 three.js

three.js 是一个基于 WebGL 的 JavaScript 库，用于创建 3D 图形。它提供了一个简单的 API，使开发人员能够在网页上创建复杂的 3D 场景。

## 安装 three.js

### pnpm 安装

```bash
pnpm install three
pnpm install @types/three
```

## 引入 three.js

```handlebars
import * as THREE from 'three';
```

- 场景(Scene)
- 相机(Camera)
- 渲染器(Renderer)
- 几何体(Geometry)
- 材质(Material)
- 网格(Grid)
- 动画(Animation)
- 交互(Interaction)

```ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 场景(Scene)
const scene = new THREE.Scene();
// 相机(Camera)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
// 相机位置的更改
camera.position.set(0, 0, 5);

// 创建环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 光源 这是平行光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

注意的是光源非必须元素;

// 动画混合器
let mixer = null;
// 加载模型
const loader = new GLTFLoader();
const clock = new THREE.Clock();
loader.load(
  // 资源 URL
  "https://threejs.org/manual/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
  // 加载完成后的回调函数
  function (gltf) {
    scene.add(gltf.scene);
    // 模型缩放
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    //模型运动、需要配合动画混合器还有时钟
    if (gltf.animations && gltf.animations.length > 0) {
      gltf.animations.forEach((clip) => {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(clip);
        action.play();
      });
    }
  },
);

// 渲染器(Renderer)
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 开启抗锯齿
  powerPreference: "high-performance", // 开启高性能模式
  alpha: true, // 开启透明背景
  canvas: document.getElementById("canvas") as HTMLCanvasElement, // 指定渲染到的 canvas 元素
  precision: "highp", // 高精度渲染
});
renderer.setSize(window.innerWidth, window.innerHeight); //这里设置的大小和相机的aspect比要一致

// 创建轨道
const controls = new OrbitControls(camera, renderer.domElement);

// 持续更新
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  const delta = clock.getDelta();
  // 更新动画混合器
  if (mixer) {
    mixer.update(delta);
  }
  renderer.render(scene, camera);
}
animate();
```
