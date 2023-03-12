import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
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
      setColors.inner = new Color("#97b7c4");
      setColors.outer = new Color("#3f5569");
      break;
    case "sunset":
      setColors.inner = new Color("#bd8435");
      setColors.outer = new Color("#59000d");
      break;
    case "rainy":
      setColors.inner = new Color("#c7968a");
      setColors.outer = new Color("#6edae8");
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
              float circle = 0.3 / (length(uv-0.5)/0.5);
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
const App = () => {
  useControls("Weather", {
    wheather: {
      value: "sunny",
      options: ["sunny", "sunset", "rainy"],
      onChange: v => {
        setWeather(v);
      },
    },
  });
  const [weather, setWeather] = useState("sunny"); // sun, snow, night
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 100, position: [0, 0, 3], zoom: 4.5 }}>
      <ambientLight intensity={0.65} />
      <spotLight color={'#d1e0e2'}   position={[-0.8, 2, 50]} power={0.05}  angle={Math.PI/8} />
      <UI />
      <Scene weather={weather} />
      <BackgroundSceneColor key={weather} weather={weather} />
    </Canvas>
  );
};

export default App;
