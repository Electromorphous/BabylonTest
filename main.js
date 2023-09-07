import * as Babylon from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";

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
  if (mesh) {
    curMesh ? (curMesh.renderOutline = false) : {};
    mesh.renderOutline = true;
    mesh.outlineColor = new Babylon.Color3(255, 0, 0);
    mesh.outlineWidth = 0.02;
    mesh.forceSharedVertices();
    curMesh = mesh;
  }
};

const getMesh = () => {
  // cast ray
  const hit = scene.pick(scene.pointerX, scene.pointerY);
  if (hit.pickedMesh) return hit.pickedMesh;
  return null;
};

const renderMeshes = (scene) => {
  // generate terrain
  const terrain = new Babylon.CreateGroundFromHeightMap(
    "terrain",
    "/assets/heightmap.png",
    {
      subdivisions: 200,
      maxHeight: 0.9,
    },
    scene
  );
  terrain.position = new Babylon.Vector3(0, -1, 0);
  terrain.material = new Babylon.StandardMaterial();
  terrain.material.diffuseColor = new Babylon.Color3(0, 0.6, 0.1);
  terrain.material.specularColor = new Babylon.Color3(1, 1, 0.6);
  terrain.material.wireframe = true;

  // generate random spheres
  for (let i = 0; i < 4; i++) {
    const sphere = new Babylon.MeshBuilder.CreateSphere(
      `sphere${i}`,
      {
        diameter: Math.random() * 0.45 + 0.25,
      },
      scene
    );
    sphere.material = new Babylon.StandardMaterial();
    sphere.material.diffuseColor = new Babylon.Color3(
      Math.random(),
      Math.random(),
      Math.random()
    );
    sphere.position = new Babylon.Vector3(
      Math.random() * 1.1 - 0.5,
      Math.random() * 1.1 - 0.5,
      Math.random() * 1.1 - 0.5
    );
  }
  // generate random cubes
  for (let i = 0; i < 3; i++) {
    const cube = new Babylon.MeshBuilder.CreateBox(
      `cube${i}`,
      {
        size: Math.random() * 0.45 + 0.25,
      },
      scene
    );
    cube.material = new Babylon.StandardMaterial();
    cube.material.diffuseColor = new Babylon.Color3(
      Math.random(),
      Math.random(),
      Math.random()
    );
    cube.position = new Babylon.Vector3(
      Math.random() * 1.1 - 0.5,
      Math.random() * 1.1 - 0.5,
      Math.random() * 1.1 - 0.5
    );
  }

  // render model
  Babylon.SceneLoader.ImportMesh(
    "",
    "/assets/Cow/",
    "Cow.obj",
    scene,
    (meshes) => {
      meshes.forEach((mesh) => {
        mesh.scaling = new Babylon.Vector3(0.2, 0.2, 0.2);
        mesh.position = new Babylon.Vector3(0, -0.5, 0);
        mesh.rotation.y = Math.PI / 2;
      });
    }
  );
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
