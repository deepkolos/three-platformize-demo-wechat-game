import {
  AmbientLight,
  AnimationAction,
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  LoopOnce,
  PerspectiveCamera,
  PLATFORM,
  Scene,
  sRGBEncoding,
  WebGL1Renderer,
} from 'three-platformize';
import { OrbitControls } from 'three-platformize/examples/jsm/controls/OrbitControls';
import { WechatGamePlatform } from 'three-platformize/src/WechatGamePlatform';

import {
  GLTF,
  GLTFLoader,
} from 'three-platformize/examples/jsm/loaders/GLTFLoader';

const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();

function Main() {
  const canvas = wx.createCanvas();
  PLATFORM.set(new WechatGamePlatform(canvas));

  const renderer = new WebGL1Renderer({
    // @ts-ignore
    canvas,
    antialias: true,
    alpha: false,
  });
  const camera = new PerspectiveCamera(
    75,
    windowWidth / windowHeight,
    0.1,
    100,
  );
  const scene = new Scene();
  const controls = new OrbitControls(camera, renderer.domElement);
  const gltfLoader = new GLTFLoader();
  const clock = new Clock();
  let mixer: AnimationMixer;

  controls.enableDamping = true;
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(windowWidth, windowHeight);
  renderer.outputEncoding = sRGBEncoding;

  scene.add(new AmbientLight(0xffffff, 1));
  scene.add(new DirectionalLight(0xffffff, 1));
  scene.position.z = -3;
  scene.background = new Color(0xffffff);

  camera.position.z = 10;

  gltfLoader
    .loadAsync(
      'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
    )
    .then((gltf: GLTF) => {
      gltf.scene.position.z = 2.5;
      gltf.scene.position.y = -2;

      // init animtion
      const states = [
        'Idle',
        'Walking',
        'Running',
        'Dance',
        'Death',
        'Sitting',
        'Standing',
      ];
      const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
      mixer = new AnimationMixer(gltf.scene);
      const actions: { [k: string]: AnimationAction } = {};
      for (let i = 0; i < gltf.animations.length; i++) {
        const clip = gltf.animations[i];
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;
        if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
          action.clampWhenFinished = true;
          action.loop = LoopOnce;
        }
      }

      const activeAction = actions['Walking'];
      activeAction.play();
      scene.add(gltf.scene);
    });

  const render = () => {
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
}

Main();
