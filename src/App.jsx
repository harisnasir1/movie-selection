import { useState, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { MeshReflectorMaterial, Environment, OrbitControls } from '@react-three/drei'
import {
    batman, 
    inception, 
    interstellar, 
    shawshank, 
    san ,
    Dune,
    Ford,
    Ironman,
    Joker,
    Panda,
    Titanic } from './eximg'
import gsap from 'gsap';

import './App.css'

const Panel = ({ pos, img }) => {
  const texture = useLoader(TextureLoader, img);
  return (
    <mesh position={pos} rotation={[0, Math.PI / 20, 0]}>
      <planeGeometry args={[3, 4]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Ground = () => {
  return (
    <group position={[0, -2, 0]}>
      <fog attach="fog" args={['#191920', 0, 15]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[500, 200]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};

function App() {
  const [upcurrent, setupcurrent] = useState(0);
  const images = [batman, 
    inception, 
    interstellar, 
    shawshank, 
    san ,
    Dune,
    Ford,
    Ironman,
    Joker,
    Panda,
    Titanic];
  const pref = images.map(() => useRef(null)); // Keeping your original ref logic
  const lockRef = useRef(false); // Lock to prevent overlapping animations

  const panels = images.map((img, i) => (
    <mesh ref={pref[i]} key={i}>
      <Panel pos={[i, 0, -i * 2]} img={img} />
    </mesh>
  ));

  const handleWheel = (event) => {
    if (lockRef.current) return; // Prevent new animation if one is ongoing

    
    const direction = event.deltaY > 0 ? 1 : -1;

    if (direction > 0 && upcurrent < images.length - 1) {
      animatePanels(direction);
      setupcurrent(upcurrent + 1);
    } else if (direction < 0 && upcurrent > 0) {
      animatePanels(direction);
      setupcurrent(upcurrent - 1);
    }
  };

  const animatePanels = (direction) => {
    lockRef.current = true; // Lock the animation

    pref.forEach((ref, i) => {
      if (ref.current) {
        const currentPos = ref.current.position;
        const newPosZ = currentPos.z + direction * 2;
        const newPosX = currentPos.x + direction * -1;

        gsap.to(currentPos, {
          z: newPosZ,
          x: newPosX,
          duration: 0.5, // Shortened duration for faster response
          ease: 'power2.inOut',
          onComplete: () => {
            lockRef.current = false; // Unlock once the animation is complete
          },
        });
      }
    });
  };

  return (
    <Canvas shadows onWheel={handleWheel}>
      <color attach="background" args={['#191920']} />
      <group position={[-4, 0, 0]}>
        {panels}
        
        <Environment preset="city" />
        <Ground />
      </group>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
    </Canvas>
  );
}

export default App;
