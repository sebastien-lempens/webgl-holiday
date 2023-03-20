import { useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Preload } from "@react-three/drei";
import { Scene } from "~/components/Scene";
import { UI } from "~/components/UI";
import { Color } from "three";
import { useControls } from "leva";
const BackgroundSceneColor = ({ weather }) => {
  const setColors = {
    inner: null,
    outer: null,
  };
  switch (weather) {
    case "sunny":
      setColors.inner = new Color("#97c1dc");
      setColors.outer = new Color("#4d7a98");
      break;
    case "sunset":
      setColors.inner = new Color("#bd8435");
      setColors.outer = new Color("#59000d");
      break;
    case "night":
      setColors.inner = new Color("#00b2ff");
      setColors.outer = new Color("#565e9a");
      break;
    case "rainy":
      setColors.inner = new Color("#74798a");
      setColors.outer = new Color("#474c5e");
      break;
  }
  const uniforms = useMemo(
    () => ({
      uColorInner: { value: setColors.inner },
      uColorOuter: { value: setColors.outer },
    }),
    [weather]
  );
  return (
    <>
      <mesh position-z={-1} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `}
          fragmentShader={`
            uniform vec3 uColorInner;
            uniform vec3 uColorOuter;
            varying vec2 vUv;
            void main() {
              vec2 uv = vUv;
              vec3 color = vec3(1.0);
              float circle =  0.3 - (length(uv-0.5));
              color = mix(uColorOuter, uColorInner, circle);
              gl_FragColor.rgba = vec4(color, 1.0);
            }
        `}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};
const MainScene = () => {
  useControls("Weather", {
    wheather: {
      value: "rainy",
      options: ["sunny", "sunset", "night", "rainy"],
      onChange: v => {
        setWeather(v);
      },
    },
  });
  const [weather, setWeather] = useState(null);
  if (!weather) return false;
  return (
    <>
      <PerspectiveCamera fov={100} position={[0, 0, 3]} zoom={4.5} makeDefault />
      <ambientLight intensity={0.65} />
      <spotLight color={"#d1e0e2"} position={[-0.8, 2, 50]} power={0.05} angle={Math.PI / 8} />
      <UI />
      <Scene weather={weather} />
      <BackgroundSceneColor key={weather} weather={weather} />
    </>
  );
};
const App = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <MainScene />
    </Canvas>
  );
};

export default App;
