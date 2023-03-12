import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Road } from "./SceneFrame/Road";
import { Van } from "./SceneFrame/Van";
import { EnvBackground } from "./SceneFrame/EnvBackground";
import { Lights } from "./SceneFrame/Lights";
import { Color } from "three";
import { useControls } from "leva";
export const SceneFrame = ({ weather, cameraParent }) => {
  const frameRef = useRef();
  const cameraRef = useRef();
  const scene = useRef();
  const { scenePosition } = useControls("Scene", {
    scenePosition: { x: 0, y: -1.65, z: 1.5 },
  });

  const { FogColor, FogNear, FogFar } = useControls("Fog", {
    FogColor: "#96c4c1",
    FogNear: 2,
    FogFar: 7,
  });
  useFrame(() => {
    if (!cameraParent) return;
    frameRef.current.position.x = cameraParent?.quaternion.y * 0.5;
    frameRef.current.rotation.y = cameraParent?.quaternion.y;
    frameRef.current.rotation.x = cameraParent?.quaternion.x;
  });
  return (
    <>
      <group>
        <PerspectiveCamera ref={cameraRef} manual makeDefault fov={90} aspect={1 / 1} zoom={1.5} />
        <fog attach='fog' near={FogNear} far={FogFar} color={new Color(FogColor)} />
        <group>
          <EnvBackground weather={weather} cameraParent={cameraParent} />
          <Lights weather={weather} />
          <group name='SceneFrame' ref={frameRef} position-z={-8.5} scale={[3, 3, 3]}>
            <group ref={scene} position={[...Object.values(scenePosition)]}>
              <Road weather={weather} />
              <Van  weather={weather} />
            </group>
          </group>
        </group>
      </group>
    </>
  );
};
