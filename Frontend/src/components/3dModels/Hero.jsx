import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

function AvocadoModel({ scale }) {
  const { scene } = useGLTF("./models/Hero.glb");
  const modelRef = useRef();

  // Add idle animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.rotation.y = 0.85 + Math.sin(t * 0.5) * 0.1; // slow rotation
      modelRef.current.position.y = Math.sin(t * 1.5) * 0.05; // subtle floating
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      rotation={[-0.1, 0.85, 0]}
    />
  );
}

const Hero = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const scale = isMobile ? 1.2 : isTablet ? 1.6 : 2;

  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <AvocadoModel scale={scale} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3.5} // ~51° tilt minimum
          maxPolarAngle={Math.PI / 2.2} // ~82° tilt maximum
          minAzimuthAngle={-Math.PI / 4} // ~-30° left rotation
          maxAzimuthAngle={Math.PI / 3}
          minDistance={6}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
};

export default Hero;
