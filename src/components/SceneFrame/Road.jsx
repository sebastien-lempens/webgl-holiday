import { useRef } from "react";
import { Clone, CubeCamera, useGLTF, useTexture, useBoxProjectedEnv, useDetectGPU } from "@react-three/drei";
import { RepeatWrapping } from "three";
import { useFrame } from "@react-three/fiber";

export const Road = ({ weather }) => {
  const { nodes } = useGLTF("/scene-draco.glb");
  const { road: roadMesh, landscape: landscapeMesh, foliage: foliageMesh, poteaux: postMesh, rock: rockMesh } = nodes;
  const landscapeRoad = useRef();
  const roadRef = useRef();
  const [textureLandscape, textureRoad, textureRoughnessRoad, textureNormalRoad, textureFoliage, texturePost, textureRock] = useTexture(
    [
      "/texture/van-landscape.webp",
      "/texture/van-road.webp",
      "/texture/van-road-roughness.webp",
      "/texture/van-road-normal.webp",
      "/texture/van-landscape-foliage.webp",
      "/texture/van-landscape-pan.webp",
      "/texture/van-landscape-rock.webp",
    ],
    ([textureLandscape, textureRoad]) => {
      textureLandscape.flipY =
        textureRoad.flipY =
        textureRoughnessRoad.flipY =
        textureNormalRoad.flipY =
        textureFoliage.flipY =
        texturePost.flipY =
        textureRock.flipY =
          false;
      textureLandscape.wrapS = textureLandscape.wrapT = RepeatWrapping;
      textureRoad.wrapS = textureRoad.wrapT = RepeatWrapping;
      textureRoughnessRoad.wrapS = textureRoughnessRoad.wrapT = RepeatWrapping;
      textureNormalRoad.wrapS = textureNormalRoad.wrapT = RepeatWrapping;
    }
  );
  const { isMobile } = useDetectGPU();
  useFrame(({ clock }) => {
    {
      // Anim road
      textureRoad.offset.x -= 0.015;
      const speed = clock.getElapsedTime() * 1.0;
      landscapeRoad.current.rotation.x = -speed;
    }
  });

  let projection = useBoxProjectedEnv([0, -17, -10], [40, 37, 40]);

  return (
    <group>
      <group>
        {(weather === "sunny" || weather === "sunset") && (
          <Clone
            ref={roadRef}
            receiveShadow
            castShadow
            object={roadMesh}
            inject={<meshStandardMaterial map={textureRoad} normalMap={textureNormalRoad} normalScale={[0.85, -0.5]} {...projection} />}
          />
        )}
        {weather === "rainy" && (
          <CubeCamera resolution={isMobile ? 512 : 1024} frames={1}>
            {texture => (
              <Clone
                receiveShadow
                object={roadMesh}
                inject={
                  <meshStandardMaterial
                    map={textureRoad}
                    roughnessMap={textureRoughnessRoad}
                    roughness={0.25}
                    normalMap={textureNormalRoad}
                    normalScale={[-0.15, 0.15]}
                    metalness={0.5}
                    envMap={texture}
                    envMapIntensity={6}
                    toneMapped={false}
                    {...projection}
                  />
                }
              />
            )}
          </CubeCamera>
        )}
        {weather === "night" && (
          <CubeCamera resolution={1024} frames={1}>
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
                    normalMap={textureNormalRoad}
                    normalScale={[0.95, -0.25]}
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
