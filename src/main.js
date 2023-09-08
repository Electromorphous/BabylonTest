import * as Babylon from "@babylonjs/core";
import { renderMeshes } from "./render";

// global variable for hovered mesh
let selectedMesh = null;
let prevMaterial = null;

// declare all materials
let hideFrontFaceMat;
let quantisedLightMat;
let fresenelMat;
let fresnelWithEdgesMat;

// defining all outline drawing functions
const hideFrontFaceFunc = async (mesh) => {
  // remove shader of previous mesh
  if (selectedMesh) selectedMesh.material = prevMaterial;

  // draw shader on new mesh if it exists
  if (mesh) {
    prevMaterial = mesh.material;
    mesh.material = hideFrontFaceMat;
    selectedMesh = mesh;
  } else {
    selectedMesh = mesh;
    prevMaterial = mesh;
  }
};

let selectedOutlineShader = 1;

const handleHover = () => {
  // get the mesh which was hovered
  const mesh = getMesh();

  console.log(selectedOutlineShader);

  // call whichever outline drawing function is active
  if (selectedOutlineShader == 1) hideFrontFaceFunc(mesh);
};

const handleSelectChange = (e) => {
  const val = e.target.value;

  selectedOutlineShader = val;
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
  // https://nme.babylonjs.com/#8AKJ1U#1
  hideFrontFaceMat = await Babylon.NodeMaterial.ParseFromSnippetAsync(
    "8AKJ1U#2"
  );
  hideFrontFaceMat.depthFunction = Babylon.Constants.ALWAYS;
  hideFrontFaceMat.disableDepthWrite = true;
  hideFrontFaceMat.alphaMode = Babylon.Constants.ALPHA_ADD;

  renderMeshes(scene);

  // initialise ray casting function for event listener
  scene.onPointerDown = handleHover;

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
