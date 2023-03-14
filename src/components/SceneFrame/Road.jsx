import { useRef } from "react";
import { Clone, useGLTF, useTexture } from "@react-three/drei";
import { Color, RepeatWrapping } from "three";
import { useFrame } from "@react-three/fiber";
export const Road = ({ weather }) => {
  const { nodes } = useGLTF("/scene.glb");
  const { road: roadMesh, landscape: landscapeMesh, foliage: foliageMesh, poteaux: postMesh, rock: rockMesh } = nodes;
  const landscapeRoad = useRef();
  const [textureLandscape, textureRoad, textureFoliage, texturePost, textureRock] = useTexture(
    [
      "/texture/van-landscape.webp",
      "/texture/van-road.webp",
      "/texture/van-landscape-foliage.webp",
      "/texture/van-landscape-pan.webp",
      "/texture/van-landscape-rock.webp",
    ],
    ([textureLandscape, textureRoad]) => {
      textureLandscape.flipY = textureRoad.flipY = textureFoliage.flipY = texturePost.flipY = textureRock.flipY = false;
      textureLandscape.anisotropy = textureRoad.anisotropy = 16;
      textureLandscape.wrapS = textureLandscape.wrapT = RepeatWrapping;
      textureRoad.wrapS = textureRoad.wrapT = RepeatWrapping;
    }
  );

  useFrame(({ clock }) => {
    textureRoad.offset.x -= 0.015;
    const speed = clock.getElapsedTime() * 1.0;
    landscapeRoad.current.rotation.x = -speed;
  });

  const layerMaterialData = {
    textureMode: null,
    fresnelColor: null,
    fresnelPower: null,
    fresnelIntensity: null,
  };

  switch (weather) {
    case "sunny":
      layerMaterialData.textureMode = "add";
      layerMaterialData.fresnelColor = "#adadad";
      layerMaterialData.fresnelPower = 0.25;
      layerMaterialData.fresnelIntensity = 2;
      break;
    case "sunset":
      layerMaterialData.textureMode = "softlight";
      layerMaterialData.fresnelColor = "#adadad";
      layerMaterialData.fresnelPower = 0.25;
      layerMaterialData.fresnelIntensity = 2;
      break;
    case "night":
      layerMaterialData.textureMode = "softlight";
      layerMaterialData.fresnelColor = "#adadad";
      layerMaterialData.fresnelPower = 0.25;
      layerMaterialData.fresnelIntensity = 2;
      break;
    case "rainy":
      layerMaterialData.textureMode = "softlight";
      layerMaterialData.fresnelColor = "#adadad";
      layerMaterialData.fresnelPower = 0.25;
      layerMaterialData.fresnelIntensity = 2;
      break;
  }

  {
    /* <MeshReflectorMaterial
            map={textureRoad}
            normalMap={textureRoadNormalMap}
            normalScale={[0.8, -0.05]}
            roughnessMap={textureRoadRoughnessMap}
            envMapIntensity={100}
            toneMapped={false}
            blur={[800, 500]}
            resolution={2048}
            mixBlur={6}
            mixStrength={10.6}
            metalness={null}
          /> */
  }
  return (
    <group>
      <group>
        <Clone receiveShadow castShadow object={roadMesh} inject={<meshStandardMaterial toneMapped={false} map={textureRoad} />} />
      </group>
      <group ref={landscapeRoad}>
        <Clone
          object={landscapeMesh}
          receiveShadow
          castShadow
          inject={<meshStandardMaterial toneMapped={false} map={textureLandscape} />}
        />
        <Clone object={foliageMesh} receiveShadow castShadow inject={<meshStandardMaterial toneMapped={false} map={textureFoliage} />} />
        <Clone object={postMesh} receiveShadow castShadow inject={<meshStandardMaterial toneMapped={false} map={texturePost} />} />
        <Clone object={rockMesh} receiveShadow castShadow inject={<meshStandardMaterial toneMapped={false} map={textureRock} />} />
      </group>
    </group>
  );
};
