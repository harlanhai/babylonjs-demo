import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { gsap } from "gsap";
import "@babylonjs/inspector";

const canvas = document.querySelector<HTMLCanvasElement>("#babylonView")!;

const createEngine = async () => {
  const engine = new BABYLON.WebGPUEngine(canvas, {
    adaptToDeviceRatio: true,
    powerPreference: "high-performance",
  });
  await engine.initAsync();
  return engine;
};

class GameScene extends BABYLON.Scene {
  constructor(engine: BABYLON.WebGPUEngine) {
    super(engine);
    // this.createDefaultCamera();
    this.createCamera();
    this.createLight();
    this.loadModel();
    this.createSkyBox();
    // this.createBox();
  }
  // create camera.
  createCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      "ArcRotateCamera",
      Math.PI / 4,
      Math.PI / 4,
      50,
      BABYLON.Vector3.Zero(),
      this
    );
    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI * 2;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 80;
    camera.panningDistanceLimit = 10;
    // Make the mouse draggable.
    camera.attachControl();
  }
  // create a light
  createLight() {
    const light = new BABYLON.HemisphericLight(
      "HemisphericLight",
      new BABYLON.Vector3(0, 1, 1),
      this
    );
    // Control light direction.
    const directionalLight = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(-4, -4, 4 * Math.PI),
      this
    );
    // Adjust light brightness.
    directionalLight.intensity = 3;
  }
  createSkyBox() {
    const skyBox = BABYLON.MeshBuilder.CreateBox("skybox", {
      size: 100,
      sideOrientation: BABYLON.Mesh.BACKSIDE,
    });
    const material = new BABYLON.BackgroundMaterial("skyboxMaterial", this);
    material.reflectionTexture = new BABYLON.CubeTexture(
      "/assets/textures/skybox",
      this,
      ["_px", "_py", "_pz", "_nx", "_ny", "_nz"].map((i) => `${i}.jpg`)
    );
    material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyBox.material = material;
  }
  // load model
  async loadModel() {
    await BABYLON.AppendSceneAsync("/assets/models/robo_obj_pose4.glb", this);
    const glow = new BABYLON.GlowLayer("glow", this);
    glow.intensity = 1;
    gsap.to(glow, {
      intensity: 3,
      repeat: -1,
      ease: "linear",
      yoyo: true,
      duration: 1,
    });
  }
  // create a box.
  createBox() {
    const box = BABYLON.MeshBuilder.CreateBox(
      "box",
      {
        size: 2,
      },
      this
    );
  }
}

const engine = await createEngine();
const scene = new GameScene(engine);
// scene.debugLayer.show({
//   // embedMode: true,
// });
engine.runRenderLoop(() => {
  scene.render();
});
