import * as Babylon from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";

export const renderMeshes = (scene) => {
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
