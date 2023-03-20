import { useRef } from "react";
import { Environment, useAspect, useTexture } from "@react-three/drei";
import { RepeatWrapping, DoubleSide } from "three";
import { useFrame } from "@react-three/fiber";
const WeatherBackground = ({ map, cameraParent }) => {
  const mesh = useRef();
  const scale = useAspect(1024, 512, 0.95);
  useFrame(() => {
    if (!map || !cameraParent) return;
    mesh.current.material.map.offset.x = cameraParent?.quaternion.y * 0.25;
  });
  return (
    <mesh name="backgroundEnvPicture" ref={mesh} scale={scale} position-z={-20}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial toneMapped={false} fog={false} color={[1.5,1.5,1.5]} map={map} />
    </mesh>
  );
};
export const EnvBackground = ({ weather, cameraParent }) => {
  let texturePath = `${weather}-background.jpg`;
  let texture = null;
  if (texturePath) {
    texture = useTexture(texturePath, texture => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.anisotropy = 16;
      texture.flipY = true;
    });
  }

  return (
    <>
      <Environment frames={Infinity} background resolution={2048}>
        <ambientLight />
        <WeatherBackground map={texture} cameraParent={cameraParent} />
        <mesh position-z={0}>
          <sphereGeometry args={[50, 20, 20]} />
          <meshBasicMaterial toneMapped={false} map={texture} side={DoubleSide} />
        </mesh>
      </Environment>
    </>
  );
};
