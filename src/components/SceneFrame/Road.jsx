import { useRef, useMemo, useState } from "react";
import { Clone, CubeCamera, useFBO, useGLTF, useTexture, useBoxProjectedEnv } from "@react-three/drei";
import { RepeatWrapping, AdditiveBlending, MultiplyBlending } from "three";
import { useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
export const Road = ({ weather }) => {
  const { nodes } = useGLTF("/scene.glb");
  const { road: roadMesh, landscape: landscapeMesh, foliage: foliageMesh, poteaux: postMesh, rock: rockMesh } = nodes;
  const landscapeRoad = useRef();
  const roadRef = useRef();
  const stopFramesRef = useRef(false);
  const [textureLandscape, textureRoad, textureRoughnessRoad, textureFoliage, texturePost, textureRock] = useTexture(
    [
      "/texture/van-landscape.webp",
      "/texture/van-road.webp",
      "/texture/van-road-roughness.webp",
      "/texture/van-landscape-foliage.webp",
      "/texture/van-landscape-pan.webp",
      "/texture/van-landscape-rock.webp",
    ],
    ([textureLandscape, textureRoad]) => {
      textureLandscape.flipY =
        textureRoad.flipY =
        textureRoughnessRoad.flipY =
        textureFoliage.flipY =
        texturePost.flipY =
        textureRock.flipY =
          false;
      textureLandscape.anisotropy = textureRoad.anisotropy = textureRoughnessRoad.anisotropy = 16;
      textureLandscape.wrapS = textureLandscape.wrapT = RepeatWrapping;
      textureRoad.wrapS = textureRoad.wrapT = RepeatWrapping;
      textureRoughnessRoad.wrapS = textureRoughnessRoad.wrapT = RepeatWrapping;
    }
  );

  useFrame(({ clock }) => {
    {
      // Anim road
      textureRoad.offset.x -= 0.015;
      const speed = clock.getElapsedTime() * 1.0;
      landscapeRoad.current.rotation.x = -speed;
    }
  });
  let projection = useBoxProjectedEnv([0, -21, -12], [40, 50, 40]);
  return (
    <group>
      <group>
        {(weather !== "rainy" || weather !== "night") && (
          <Clone ref={roadRef} receiveShadow castShadow object={roadMesh} inject={<meshStandardMaterial map={textureRoad} />} />
        )}
        {weather === "rainy" && (
          <CubeCamera resolution={2048} frames={1}>
            {texture => (
              <Clone
                receiveShadow
                castShadow
                object={roadMesh}
                inject={
                  <meshStandardMaterial
                    map={textureRoad}
                    roughnessMap={textureRoughnessRoad}
                    metalness={0.2}
                    envMap={texture}
                    envMapIntensity={4}
                    {...projection}
                  />
                }
              />
            )}
          </CubeCamera>
        )}
        {weather === "night" && (
          <CubeCamera resolution={512} frames={1}>
            {texture => (
              <Clone
                receiveShadow
                castShadow
                object={roadMesh}
                inject={
                  <meshStandardMaterial
                    map={textureRoad}
                    roughness={0.15}
                    metalness={0.3}
                    envMap={texture}
                    envMapIntensity={7}
                    {...projection}
                  />
                }
              />
            )}
          </CubeCamera>
        )}
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
