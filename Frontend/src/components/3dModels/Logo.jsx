import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Float, useGLTF } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

function LogoModel({ scale }) {
  const { scene } = useGLTF("./models/logo.glb");
  const modelRef = useRef();

  // Optional: set initial rotation once

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      rotation={[0, 9.4, 0]}
    />
  );
}

const Logo = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const scale = isMobile ? 3 : isTablet ? 3 : 5;

  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{
          position: isMobile ? [0, 2, 14] : isTablet ? [0, 2, 24] : [0, 2, 26],
          fov: isMobile ? 55 : 50,
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Float speed={2.5} rotationIntensity={1.3} floatIntensity={1.5}>
            <LogoModel scale={scale} />
          </Float>
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Logo;
