import { useRef, useState } from "react";
import { PresentationControls, RenderTexture, useGLTF, useTexture } from "@react-three/drei";
import { SceneFrame } from "~/components/SceneFrame";
import { RepeatWrapping, Scene as ThreeScene } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export const Scene = ({ weather }) => {
  const frameRef = useRef();
  const frameNestedSceneRef = useRef(null);
  const [onUpdate, setOnUpdate] = useState(null);
  const normalMap = useTexture("/texture/fingerprint.jpg", textureMap => {
    textureMap.wrapS = textureMap.wrapT = RepeatWrapping;
    textureMap.flipY = false;
  });
  const handleRenderTexture = e => {
    let getScene = e.__r3f.parent;
    while (getScene && !(getScene instanceof ThreeScene)) {
      getScene = getScene.__r3f.parent;
    }
    if (getScene) {
      const [getCamera] = getScene.children.filter(item => item.isCamera);
      frameNestedSceneRef.current = { getScene, getCamera };
    }
    if (frameNestedSceneRef.current) {
      setOnUpdate("update");
    }
  };
 
  return (
    <>
      <PresentationControls
        enabled={true}
        global={false}
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
              <RenderTexture attach='map' onUpdate={handleRenderTexture}>
                <SceneFrame weather={weather} cameraParent={frameRef.current?.parent} />
                {onUpdate && (
                  <EffectComposer
                    disableNormalPass
                    scene={frameNestedSceneRef.current.getScene}
                    camera={frameNestedSceneRef.current.getCamera}
                  >
                    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.2} kernelSize={2} />
                  </EffectComposer>
                )}
              </RenderTexture>
            </meshStandardMaterial>
          </mesh>
          <mesh name='FrameBorder' scale-x={1.1} scale-y={1.3} position-y={-0.1} position-z={-0.001}>
            <planeGeometry />
            <meshStandardMaterial roughness={0.1} normalMap={normalMap} normalScale={[0.05, 0.05]} />
          </mesh>
        </group>
      </PresentationControls>
    </>
  );
};
useGLTF.preload("/scene.glb");
