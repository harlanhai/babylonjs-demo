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
scene.debugLayer.show({
  // embedMode: true,
});
engine.runRenderLoop(() => {
  scene.render();
});
