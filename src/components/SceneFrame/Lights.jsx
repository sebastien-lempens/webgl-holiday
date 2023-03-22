import { useRef, useEffect } from "react";
import { Color } from "three";
import { folder, useControls } from "leva";
export const Lights = ({ weather }) => {
  const spotLightRef = useRef();
  const ambiantLightRef = useRef();
  const hemisphereLightRef = useRef();
  const ambiantLightParamsRef = useRef({
    color: null,
    intensity: 0,
  });
  const spotLightParamsRef = useRef({
    color: null,
    intensity: 0,
    position: null,
    angle: 0,
    penumbra: 0,
  });

  let hemisphereLightParamsRef = useRef({
    color: null,
    intensity: 0,
  });

  switch (weather) {
    case "sunny":
      {
        ambiantLightParamsRef.current.color = "#85d3e6";
        ambiantLightParamsRef.current.intensity = 0.8;
      }
      {
        spotLightParamsRef.current.color = "#ffd9a1";
        spotLightParamsRef.current.intensity = 11.0;
        spotLightParamsRef.current.position = [-50, 100, 10];
        spotLightParamsRef.current.angle = 0.04;
        spotLightParamsRef.current.penumbra = 0.3;
      }
      {
        hemisphereLightParamsRef.current.color = "#ff8600";
        hemisphereLightParamsRef.current.intensity = 0.6;
      }
      break;
    case "sunset":
      {
        ambiantLightParamsRef.current.color = "#7c5555";
        ambiantLightParamsRef.current.intensity = 3.5;
      }
      {
        spotLightParamsRef.current.color = "#ff8600";
        spotLightParamsRef.current.intensity = 25.0;
        spotLightParamsRef.current.position = [5, 0.5, -5];
        spotLightParamsRef.current.angle = 0.6;
        spotLightParamsRef.current.penumbra = 0.5;
      }
      {
        hemisphereLightParamsRef.current.color = "#cf36ff";
        hemisphereLightParamsRef.current.intensity = 0.09;
      }
      break;
    case "night":
      {
        ambiantLightParamsRef.current.color = "#032558";
        ambiantLightParamsRef.current.intensity = 8;
      }
      {
        spotLightParamsRef.current.color = "#004ec4";
        spotLightParamsRef.current.intensity = 20.0;
        spotLightParamsRef.current.position = [80, 90, -35];
        spotLightParamsRef.current.angle = 0.05;
        spotLightParamsRef.current.penumbra = 0.01;
      }
      {
        hemisphereLightParamsRef.current.color = "#00b2ff";
        hemisphereLightParamsRef.current.intensity = 0.1;
      }
      break;
    case "rainy":
      {
        ambiantLightParamsRef.current.color = "#596a93";
        ambiantLightParamsRef.current.intensity = 2;
      }
      {
        spotLightParamsRef.current.color = "#7d99e8";
        spotLightParamsRef.current.intensity = 2;
        spotLightParamsRef.current.position = [-450, 800, 80];
        spotLightParamsRef.current.angle = 0.05;
        spotLightParamsRef.current.penumbra = 0.3;
      }
      {
        hemisphereLightParamsRef.current.color = "#242d4e";
        hemisphereLightParamsRef.current.intensity = -0.15;
      }
      break;
  }

  const [, setUseControls] = useControls(() => ({
    Lights: folder(
      {
        AmbiantLight: folder({
          AmbiantLightColor: {
            value: ambiantLightParamsRef.current.color,
            onChange: v => (ambiantLightRef.current.color = new Color(v)),
          },
          AmbiantLightIntensity: {
            value: ambiantLightParamsRef.current.intensity,
            onChange: v => (ambiantLightRef.current.intensity = v),
          },
        }),
        SpotLight: folder({
          SpotLightColor: {
            value: spotLightParamsRef.current.color,
            onChange: v => (spotLightRef.current.color = new Color(v)),
          },
          SpotLightIntensity: {
            value: spotLightParamsRef.current.intensity,
            onChange: v => (spotLightRef.current.intensity = v),
          },
          SpotLightPosition: {
            value: {
              x: spotLightParamsRef.current.position[0],
              y: spotLightParamsRef.current.position[1],
              z: spotLightParamsRef.current.position[2],
            },
            onChange: v => spotLightRef.current.position.set(...Object.values(v)),
          },
          SpotLightAngle: {
            value: spotLightParamsRef.current.angle,
            onChange: v => (spotLightRef.current.angle = v),
          },
          SpotLightPenumbra: {
            value: spotLightParamsRef.current.penumbra,
            onChange: v => (spotLightRef.current.penumbra = v),
          },
        }),
        HemisphereLight: folder({
          HemisphereLightColor: {
            value: hemisphereLightParamsRef.current.color,
            onChange: v => (hemisphereLightRef.current.groundColor = new Color(v)),
          },
          HemisphereLightIntensity: {
            value: hemisphereLightParamsRef.current.intensity,
            onChange: v => (hemisphereLightRef.current.intensity = v),
          },
        }),
      },
      { collapsed: true }
    ),
  }));
  useEffect(() => {
    setUseControls({
      AmbiantLightColor: ambiantLightParamsRef.current.color,
      AmbiantLightIntensity: ambiantLightParamsRef.current.intensity,
      SpotLightColor: spotLightParamsRef.current.color,
      SpotLightIntensity: spotLightParamsRef.current.intensity,
      SpotLightPosition: {
        x: spotLightParamsRef.current.position[0],
        y: spotLightParamsRef.current.position[1],
        z: spotLightParamsRef.current.position[2],
      },
      SpotLightAngle: spotLightParamsRef.current.angle,
      SpotLightPenumbra: spotLightParamsRef.current.penumbra,
      HemisphereLightColor: hemisphereLightParamsRef.current.color,
      HemisphereLightIntensity: hemisphereLightParamsRef.current.intensity,
    });
  }, [weather]);
  return (
    <group>
      <ambientLight ref={ambiantLightRef} {...ambiantLightParamsRef.current} />
      <spotLight ref={spotLightRef} {...spotLightParamsRef.current} castShadow />
      <hemisphereLight ref={hemisphereLightRef} {...hemisphereLightParamsRef} />
    </group>
  );
};
