import { useRef } from "react";
import { OrbitControls, PresentationControls, RenderTexture, useGLTF, useTexture } from "@react-three/drei";
import { SceneFrame } from "~/components/SceneFrame";
import { useThree } from "@react-three/fiber";
import { RepeatWrapping } from "three";
export const Scene = ({ weather }) => {
  const frameRef = useRef();
  const state = useThree();

  const normalMap = useTexture("/texture/fingerprint.jpg", textureMap => {
    textureMap.wrapS = textureMap.wrapT = RepeatWrapping;
    textureMap.flipY = false;
  });
  return (
    <>
      <PresentationControls
        enabled={true}
        global={true}
        cursor={true}
        snap={false}
        speed={1.3}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 12, Math.PI / 12]} // Vertical limits
        azimuth={[-Math.PI / 4, Math.PI / 4]} // Horizontal limits
      >
        <group ref={frameRef} position-y={0.05} dispose={null}>
          <mesh name='Frame'>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial roughness={0.15} normalMap={normalMap} normalScale={[-0.025, -0.025]}>
              <RenderTexture attach='map'>
                <SceneFrame weather={weather} cameraParent={frameRef.current?.parent} />
              </RenderTexture>
            </meshStandardMaterial>
          </mesh>
          <mesh name='FrameBorder' scale-x={1.1} scale-y={1.3} position-y={-0.1} position-z={-0.001}>
            <planeGeometry />
            <meshStandardMaterial  roughness={0.1} normalMap={normalMap} normalScale={[0.05, 0.05]} />
          </mesh>
        </group>
      </PresentationControls>
    </>
  );
};
useGLTF.preload("/scene.glb");
