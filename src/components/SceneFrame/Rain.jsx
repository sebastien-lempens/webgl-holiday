import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, MathUtils } from "three";
import { Instance, Instances, useDetectGPU } from "@react-three/drei";
const Drop = ({ position, rotation, speed }) => {
  const dropRef = useRef();
  let _speed = 0;
  let positionLimit = -1;
  let positionRePosition = 2;

  useFrame(({ clock }, delta) => {
    {
      //Manage speed
      _speed = delta * 2 * speed;
    }
    let _position = dropRef.current.position.y;
    {
      //Manage position
      if (_position < positionLimit) {
        _speed = 0;
        dropRef.current.position.y = positionRePosition;
        dropRef.current.scale.y = 0.15;
      }
      dropRef.current.translateY(-_speed);
    }
    {
      //Manage Size
      const mod = _position / positionRePosition;
      if (mod > 0) {
        dropRef.current.scale.y = 0.3 + mod;
      }
    }
  });
  return <Instance ref={dropRef} position={position} scale={[0.01, 0.15, 0.01]} />;
};
export const Rain = ({ visible }) => {
  const { isMobile } = useDetectGPU();
  const drops = Array.from({ length: isMobile ? 800 : 1800 }, () => ({
    factor: MathUtils.randInt(20, 100),
    speed: MathUtils.randFloat(1, 2),
    xFactor: MathUtils.randFloatSpread(2),
    yFactor: MathUtils.randFloat(0, 2),
    zFactor: MathUtils.randFloat(-1.5, -3),
  }));
  if (!visible) return false;
  return (
    <group>
      <Instances rotation={[0.45, 0, 0.0]} position-y={-1.5}>
        <sphereGeometry args={[0.08, 2, 2]} />
        <meshStandardMaterial color={[0, 0.2, 0.2]} blending={AdditiveBlending} emissive={[0.2, 0.2, 0.4]} transparent opacity={0.5} />
        {drops.map((drop, i) => (
          <Drop
            key={i}
            position={[drop.xFactor, drop.yFactor, drop.zFactor]}
            rotation={[0, 0, MathUtils.randFloatSpread(0.5)]}
            speed={drop.speed}
          />
        ))}
      </Instances>
    </group>
  );
};
