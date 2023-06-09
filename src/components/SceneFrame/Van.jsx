import { useRef, useMemo } from "react";
import { useGLTF, useTexture, useFBO } from "@react-three/drei";
import { folder, useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { Color, DoubleSide, Vector2 } from "three";

export const Van = ({ weather }) => {
  const { nodes } = useGLTF("/scene-draco.glb");
  const {
    VanLuggage,
    Van,
    wheel: VanLuggageWheel,
    seats: VanSeats,
    windows: VanWindows,
    driver: VanDriver,
    driverHand: VanDriverHand,
    headlights: VanHeadlights,
    wiper: VanWiper,
  } = nodes;
  const vanRef = useRef();
  const vanBodyWorkRef = useRef();
  const VanLuggageRef = useRef();
  const VanLuggageWheelRef = useRef();
  const vanWindowsRef = useRef();
  const vanDriverRef = useRef();
  const vanDriverHandRef = useRef();
  const VanWiperRef = useRef();
  const renderTarget = useFBO();
  // Texture
  const [textureVanStructure, textureVanLuggage] = useTexture(
    ["/texture/van-structure.webp", "/texture/van-luggage.webp"],
    ([textureVanStructure, textureVanLuggage]) => {
      textureVanStructure.flipY = textureVanLuggage.flipY = false;
    }
  );
  // Control
  const { vanPosition, vanDriverPosition, vanDriverHandPosition, vanSeatsPosition, VanHeadlightsPosition, VanWiperRefPosition } =
    useControls(
      "Meshs",
      {
        Van: folder({
          vanPosition: { x: 0, y: 0.71, z: 0 },
          vanDriverPosition: { x: 0.16, y: 0.94, z: 0.29 },
          vanDriverHandPosition: { x: 0.25, y: 0.98, z: 0.26 },
          vanSeatsPosition: { x: 0.01, y: 1, z: 0 },
          VanHeadlightsPosition: { x: 0, y: 0.91, z: 0.45 },
          VanWiperRefPosition: { x: 0, y: 0.98, z: 0.4 },
        }),
      },
      { collapsed: true }
    );

  const uniforms = useMemo(() => {
    let uColor = null;
    let uWeatherType = null;
    switch (weather) {
      case "sunny":
        uColor = new Color("#42b2eb");
        uWeatherType = 1;
        break;
      case "sunset":
        uColor = new Color("#e83109");
        uWeatherType = 2;
        break;
      case "night":
        uColor = new Color("#42b2eb");
        uWeatherType = 3;
        break;
      case "rainy":
        uColor = new Color("#242d4e");
        uWeatherType = 4;
        break;
    }
    return {
      uTexture: { value: null },
      uResolution: { value: new Vector2(innerWidth, innerHeight) },
      uColor: { value: uColor },
      uWeather: { value: uWeatherType },
    };
  }, [weather]);

  // useFrame
  useFrame(({ gl, scene, camera, clock }) => {
    const shake = Math.sin(clock.getElapsedTime() * 35) * 0.005;
    vanBodyWorkRef.current.position.y = shake;
    VanLuggageRef.current.position.y = 0.04 + shake * 0.4 + shake * 0.2;
    VanLuggageWheelRef.current.rotation.z -= 0.06;
    vanDriverHandRef.current.rotation.z = 1.3 + Math.sin(0.9 + clock.getElapsedTime() * 10) * 0.5;
    // Render Target Windows
    vanRef.current.visible = false;
    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);
    vanWindowsRef.current.material.uniforms.uTexture.value = renderTarget.texture;
    gl.setRenderTarget(null);
    vanRef.current.visible = true;
    {
      //Wiper animation
      if (weather === "rainy") {
        VanWiperRef.current.rotation.z = Math.PI / 2 - Math.sin(clock.getElapsedTime() * 5) * 1.5;
      }
    }
  });

  return (
    <group name='vanGroup' ref={vanRef} position-y={vanPosition.y} key={weather}>
      <group ref={vanBodyWorkRef}>
        <group name='VanLuggage' ref={VanLuggageRef}>
          <mesh
            name='VanLuggage'
            userData-vangroup={true}
            geometry={VanLuggage.geometry}
            position={[...Object.values(VanLuggage.position)]}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial map={textureVanLuggage} toneMapped={false} envMapIntensity={2} roughness={0.5} metalness={0.0} />
          </mesh>
          <mesh
            name='VanLuggageWheel'
            ref={VanLuggageWheelRef}
            userData-vangroup={true}
            geometry={VanLuggageWheel.geometry}
            position-x={0.2}
            position-y={1.57}
            position-z={0.04}
            rotation-x={VanLuggageWheel.rotation.x}
            rotation-y={VanLuggageWheel.rotation.y}
            rotation-z={VanLuggageWheel.rotation.z}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial toneMapped={false} map={textureVanLuggage} envMapIntensity={5} roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
        <group name='Van Group'>
          <mesh
            name='Van'
            userData-vangroup={true}
            geometry={Van.geometry}
            position={[...Object.values(Van.position)]}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial
              toneMapped={false}
              side={DoubleSide}
              map={textureVanStructure}
              envMapIntensity={3}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          <mesh
            name='VanWindows'
            ref={vanWindowsRef}
            userData-vangroup={true}
            geometry={VanWindows.geometry}
            toneMapped={false}
            envMapIntensity={50}
            position-y={0.95}
            position-z={0.015}
          >
            <shaderMaterial
              transparent
              toneMapped={false}
              uniforms={uniforms}
              vertexShader={`
              varying vec2 vUv;
              varying vec3 worldNormal;
              varying vec3 eyeVector;
              void main() {
                vUv = uv;
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * worldPos;
                worldNormal = normalize(normalMatrix * normal);
                eyeVector = normalize(worldPos.xyz - cameraPosition);
              }`}
              fragmentShader={`
              uniform sampler2D uTexture;
              uniform vec2 uResolution;
              uniform vec3 uColor;
              uniform int uWeather;
              varying vec2 vUv;
              varying vec3 worldNormal;
              varying vec3 eyeVector;

              vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
                vec4 color = vec4(0.0);
                vec2 off1 = vec2(1.3333333333333333) * direction;
                color += texture2D(image, uv) * 0.29411764705882354;
                color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
                color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
                return color; 
              }

              void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                vec3 refractVec = refract(eyeVector, worldNormal, 0.3);
                float ux = uv.x - refractVec.x;
                float uy = uv.y - refractVec.y;
                vec3 color = vec3(0.0);
                vec3 texture = vec3(blur5(uTexture, vec2(ux-0.1, uy-0.1), uResolution.xy, vec2(5.0,1.0)));
                color = mix(texture, uColor * vec3(-0.25), texture.y);
                float wiperTrace = smoothstep(0.42, 0.45, length(vUv-0.5) );
                if(uWeather == 4) {
                  color += color * wiperTrace;
                  color -= 0.1;
                }
                gl_FragColor.rgba = vec4(color, 0.85);
              }`}
            />
          </mesh>
          <mesh
            name='Driver'
            ref={vanDriverRef}
            userData-vangroup={true}
            geometry={VanDriver.geometry}
            position={[...Object.values(vanDriverPosition)]}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial color={"#a3978b"} roughness={0.6} metalness={0} />
          </mesh>
          <mesh
            name='DriverHand'
            userData-vangroup={true}
            ref={vanDriverHandRef}
            geometry={VanDriverHand.geometry}
            position={[...Object.values(vanDriverHandPosition)]}
            rotation-z={0.5}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial color={"#ffd98a"} metalness={0.4} />
          </mesh>
          <mesh name='Seats' userData-vangroup={true} geometry={VanSeats.geometry} position={[...Object.values(vanSeatsPosition)]}>
            <meshBasicMaterial color={"rgb(25,25,25)"} />
          </mesh>
          <group visible={weather === "night"} name='Headlights' position={[...Object.values(VanHeadlightsPosition)]}>
            <mesh name='Headlights' geometry={VanHeadlights.geometry}>
              <meshStandardMaterial emissive={[6, 1, 0]} emissiveIntensity={2} color={[0, 0, 0]} toneMapped={false} side={DoubleSide} />
            </mesh>
          </group>
          <mesh
            visible={weather === "rainy"}
            name='Wiper'
            userData-vangroup={true}
            ref={VanWiperRef}
            geometry={VanWiper.geometry}
            position={[...Object.values(VanWiperRefPosition)]}
          >
            <meshBasicMaterial color={new Color("#242d4e")} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
