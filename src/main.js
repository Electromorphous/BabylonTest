import * as Babylon from "@babylonjs/core";
import { renderMeshes } from "./render";

let curMesh = null;

const canvas = document.getElementById("renderCanvas");

const engine = new Babylon.Engine(canvas, true, { stencil: true });

const createScene = () => {
  const scene = new Babylon.Scene(engine);
  scene.ambientColor = new Babylon.Color3(1, 1, 1);

  scene.createDefaultCameraOrLight(true, false, true);
  // scene.createDefaultCamera(true, false, true);

  // render all the meshes
  renderMeshes(scene);

  // initialise ray casting function for event listener
  scene.onPointerDown = handleHover;

  return scene;
};

const handleHover = () => {
  const mesh = getMesh();
  curMesh ? (curMesh.renderOutline = false) : {};
  if (mesh) {
    mesh.renderOutline = true;
    mesh.outlineColor = new Babylon.Color3(255, 0, 0);
    mesh.outlineWidth = 0.02;
    mesh.forceSharedVertices();
    curMesh = mesh;
  } else {
    curMesh = null;
  }
};

const getMesh = () => {
  // cast ray
  const hit = scene.pick(scene.pointerX, scene.pointerY);
  if (hit.pickedMesh) return hit.pickedMesh;
  return null;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
