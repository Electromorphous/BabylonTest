import * as Babylon from "@babylonjs/core";
import { renderMeshes } from "./render";

// global variable for hovered mesh
let selectedMesh = null;
let prevMaterial = null;

// declare all materials
let hideFrontFaceMat;
let quantisedLightMat;
let fresnel1;
let fresnel2;

let selectedShader = "1";

const handleHover = () => {
  // get the mesh which was hovered
  const mesh = getMesh();

  // remove shader of previous mesh
  if (selectedMesh) selectedMesh.material = prevMaterial;

  if (mesh) {
    prevMaterial = mesh.material;
    if (selectedShader === "1") mesh.material = hideFrontFaceMat;
    if (selectedShader === "2") mesh.material = quantisedLightMat;
    if (selectedShader === "3") mesh.material = fresnel1;
    if (selectedShader === "4") mesh.material = fresnel2;
  } else {
    prevMaterial = null;
  }
  selectedMesh = mesh;
};

const handleSelectChange = (e) => {
  const val = e.target.value;

  selectedShader = val;
};

const getMesh = () => {
  // cast ray
  const hit = scene.pick(scene.pointerX, scene.pointerY);
  if (hit.pickedMesh) return hit.pickedMesh;
  return null;
};

// boilerplate Babylon code
const canvas = document.getElementById("renderCanvas");

const engine = new Babylon.Engine(canvas);

const createScene = async () => {
  const scene = new Babylon.Scene(engine);
  scene.ambientColor = new Babylon.Color3(1, 1, 1);

  scene.createDefaultCameraOrLight(true, false, true);
  // scene.createDefaultCamera(true, false, true);

  // load all materials from Node Material Editor
  // https://nme.babylonjs.com/#8AKJ1U#3
  hideFrontFaceMat = await Babylon.NodeMaterial.ParseFromSnippetAsync(
    "8AKJ1U#3"
  );
  hideFrontFaceMat.depthFunction = Babylon.Constants.ALWAYS;
  hideFrontFaceMat.disableDepthWrite = true;
  hideFrontFaceMat.alphaMode = Babylon.Constants.ALPHA_ADD;

  quantisedLightMat = await Babylon.NodeMaterial.ParseFromSnippetAsync(
    "R57SN6#1"
  );
  quantisedLightMat.depthFunction = Babylon.Constants.ALWAYS;
  quantisedLightMat.disableDepthWrite = true;
  quantisedLightMat.alphaMode = Babylon.Constants.ALPHA_ADD;

  fresnel1 = await Babylon.NodeMaterial.ParseFromSnippetAsync("EKLXRR#1");
  fresnel1.depthFunction = Babylon.Constants.ALWAYS;
  fresnel1.disableDepthWrite = true;
  fresnel1.alphaMode = Babylon.Constants.ALPHA_ADD;

  fresnel2 = await Babylon.NodeMaterial.ParseFromSnippetAsync("TCVT9W#4");
  fresnel2.depthFunction = Babylon.Constants.ALWAYS;
  fresnel2.disableDepthWrite = true;
  fresnel2.alphaMode = Babylon.Constants.ALPHA_ADD;

  renderMeshes(scene);

  // initialise ray casting function for event listener
  scene.onPointerMove = handleHover;

  return scene;
};

const scene = await createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

// setting up GUI function calls
document.getElementById("outlineType").onchange = handleSelectChange;
