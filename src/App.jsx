import { useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, useDetectGPU } from "@react-three/drei";
import { Scene } from "~/components/Scene";
import { UI } from "~/components/UI";
import { Color } from "three";
import { Leva, useControls } from "leva";

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
  const [loaded = false] = useState(() => true);
  const [weather, setWeather] = useState("sunny");
  useControls({
    Weather: {
      options: ["sunny", "sunset", "night", "rainy"],
      onChange: v => setWeather(v),
    },
  });
  if (!weather) return false;
  const handleWeather = weatherValue => {
    if (weatherValue) {
      setWeather(weatherValue);
    }
  };
  if (!loaded) return false;
  return (
    <>
      <PerspectiveCamera fov={100} position={[0, 0, 3]} zoom={4.5} makeDefault />
      <ambientLight intensity={0.65} />
      <spotLight color={"#d1e0e2"} position={[-0.8, 2, 50]} power={0.065} angle={Math.PI / 8} />
      <UI weather={weather} handleWeather={handleWeather} />
      <Scene weather={weather} />
      <BackgroundSceneColor key={weather} weather={weather} />
    </>
  );
};

const App = () => {
  const GPUTier = useDetectGPU();
  let dpr = GPUTier.isMobile ? 0.7 : 1;
  return (
    <>
      <Canvas shadows dpr={dpr}>
        <Suspense fallback={null}>
          <MainScene />
        </Suspense>
      </Canvas>

      <div style={{ display: "flex", gap: "10px", position: "fixed", bottom: "25px", right: "25px" }}>
        <a href='https://twitter.com/s_lempens'>
          <svg width='28' height='27'>
            <path
              fillRule='evenodd'
              fill='#FFF'
              d='M14.17.155C6.696.155.759 6.91.759 13.412c0 7.322 5.937 13.258 13.411 13.258 7.168 0 13.105-5.936 13.105-13.258C27.275 6.91 21.338.155 14.17.155Zm6.54 10.337c.05.13.08.261.08.393 0 4.021-3.61 8.658-9.369 8.658-1.719 0-3.318-.153-4.664-1.367a6.109 6.109 0 0 0 4.505-1.26c-1.332-.025-2.455-.806-2.843-2.114a2.998 2.998 0 0 0 1.374-.052 3.044 3.044 0 0 1-2.441-2.983v-.039c.411.228.88 1.202 1.379.381a3.042 3.042 0 0 1-1.354-2.533c0-.396.15-1.08.412-1.116 1.5 1.427 3.743 3.52 6.821 2.766.29.074-.628-.456-.628-.694 0-1.68 1.363-3.043 3.278-3.043.641 0 1.431.37 1.987.961.693-.136 1.344.15 1.932-.738-.227.71-.71 1.468-1.338 1.683.616-.074 1.589-.237 1.747-.479-.407.61-.923 1.704-.878 1.576Z'
            ></path>
          </svg>
        </a>
        <a href='https://github.com/sebastien-lempens/webgl-holiday'>
          <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'>
            <path
              fill='#FFF'
              d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
            />
          </svg>
        </a>
      </div>
    </>
  );
};

export default App;
