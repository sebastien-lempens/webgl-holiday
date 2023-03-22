import { useRef, useState, useEffect } from "react";
import { PresentationControls, RenderTexture, useGLTF, useTexture } from "@react-three/drei";
import { SceneFrame } from "~/components/SceneFrame";
import { RepeatWrapping, Scene as ThreeScene } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { folder, useControls } from "leva";
export const Scene = ({ weather }) => {
  const frameRef = useRef();
  const bloomEffect = useRef({ bloomLumThresold: 0, bloomLumSmoothing: 0, bloomIntensity: 0, bloomRadius: 0 });
  const frameNestedSceneRef = useRef(null);
  const [, setOnUpdate] = useState(null);
  const [normalMap, textureDecal, textureDecalMask] = useTexture(
    ["/texture/fingerprint.jpg", "/texture/decal-text.jpg", "/texture/decal-text-mask.jpg"],
    ([textureMap, textureDecal, textureDecalMask]) => {
      textureMap.wrapS = textureMap.wrapT = RepeatWrapping;
      textureMap.flipY = false;
    }
  );
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
  const [, setUseControls] = useControls(
    () => (
      {
        Effects: folder({
          Bloom: folder({
            thresold: {
              value: bloomEffect.current.bloomLumThresold,
              onChange: v => {
                bloomEffect.current.bloomLumThresold = v;
              },
              transient: false,
            },
            smoothing: {
              value: bloomEffect.current.bloomLumSmoothing,
              onChange: v => {
                bloomEffect.current.bloomLumSmoothing = v;
              },
              transient: false,
            },
            intensity: {
              value: bloomEffect.current.bloomIntensity,
              onChange: v => {
                bloomEffect.current.bloomIntensity = v;
              },
              transient: false,
            },
            radius: {
              value: bloomEffect.current.bloomRadius,
              onChange: v => {
                bloomEffect.current.bloomRadius = v;
              },
              transient: false,
            },
          }),
        },
      { collapsed: true }),
      }
    )
  );

  useEffect(() => {
    switch (weather) {
      case "sunny":
        bloomEffect.current.bloomLumThresold = 1;
        bloomEffect.current.bloomLumSmoothing = 0.2;
        bloomEffect.current.bloomIntensity = 1;
        bloomEffect.current.bloomRadius = 0.85;
        break;
      case "sunset":
        bloomEffect.current.bloomLumThresold = 1;
        bloomEffect.current.bloomLumSmoothing = 0.2;
        bloomEffect.current.bloomIntensity = 3;
        bloomEffect.current.bloomRadius = 0.85;
        break;
      case "night":
        bloomEffect.current.bloomLumThresold = 1;
        bloomEffect.current.bloomLumSmoothing = 0.4;
        bloomEffect.current.bloomIntensity = 8;
        bloomEffect.current.bloomRadius = 0.8;
        break;
      case "rainy":
        bloomEffect.current.bloomLumThresold = 1;
        bloomEffect.current.bloomLumSmoothing = 0.4;
        bloomEffect.current.bloomIntensity = 12;
        bloomEffect.current.bloomRadius = 0.75;
        break;
    }
    setUseControls({
      thresold: bloomEffect.current.bloomLumThresold,
      smoothing: bloomEffect.current.bloomLumSmoothing,
      intensity: bloomEffect.current.bloomIntensity,
      radius: bloomEffect.current.bloomRadius,
    });
  }, [weather]);
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
        <group ref={frameRef} position-y={0.05}>
          <mesh name='Frame'>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial roughness={0.15} toneMapped={false} normalMap={normalMap} normalScale={[-0.025, -0.025]}>
              <RenderTexture attach='map' onUpdate={handleRenderTexture}>
                <>
                  <SceneFrame weather={weather} cameraParent={frameRef.current?.parent} />
                  <EffectComposer
                    disableNormalPass
                    stencilBuffer={false}
                    scene={frameNestedSceneRef.current?.getScene}
                    camera={frameNestedSceneRef.current?.getCamera}
                  >
                    <Bloom
                      mipmapBlur
                      radius={bloomEffect.current.bloomRadius}
                      intensity={bloomEffect.current.bloomIntensity}
                      luminanceThreshold={bloomEffect.current.bloomLumThresold}
                      luminanceSmoothing={bloomEffect.current.bloomLumSmoothing}
                      height={150}
                    />
                  </EffectComposer>
                </>
              </RenderTexture>
            </meshStandardMaterial>
          </mesh>
          <mesh name='FrameDecalText' position={[0, -0.58, 0.01]} rotation-z={-0.08} scale={0.35}>
            <planeGeometry args={[2, 1]} />
            <meshStandardMaterial
              alphaTest={0.0}
              roughness={0.13}
              metalness={0.15}
              opacity={0.975}
              map={textureDecal}
              alphaMap={textureDecalMask}
              transparent
              toneMapped={false}
            />
          </mesh>
          <mesh name='FrameBorder' scale-x={1.1} scale-y={1.3} position-y={-0.1} position-z={-0.01}>
            <planeGeometry />
            <meshStandardMaterial
              toneMapped={true}
              roughness={0.2}
              metalness={0}
              color={[1.0, 1.0, 1.0]}
              normalMap={normalMap}
              normalScale={[0.05, 0.05]}
            />
          </mesh>
        </group>
      </PresentationControls>
    </>
  );
};
useGLTF.preload("/scene-draco.glb");
