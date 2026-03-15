'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlassesModelProps {
  landmarks: any;
  product?: any;
}

export default function GlassesModel({ landmarks, product }: GlassesModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!landmarks || !groupRef.current) return;

    // Landmarks for reference:
    // 33: Left eye inner
    // 263: Right eye inner
    // 133: Left eye outer
    // 362: Right eye outer
    // 168: Nose bridge
    // 10: Forehead top
    // 152: Chin bottom
    
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseBridge = landmarks[168];
    const leftTemple = landmarks[127]; // Side of face
    const rightTemple = landmarks[356]; // Side of face

    // Calculate Position
    // The canvas is normalized 0-1. R3F world coordinates need mapping.
    // For simplicity, we can use the nose bridge as center.
    // We'll normalize coordinates to [-5, 5] range for the scene.
    
    const posX = (noseBridge.x - 0.5) * 10;
    const posY = -(noseBridge.y - 0.5) * 10;
    const posZ = -noseBridge.z * 10; // Depth

    groupRef.current.position.set(posX, posY, posZ);

    // Calculate Rotation (Roll, Pitch, Yaw)
    // Roll: Angle between eyes
    const dx = rightEye.x - leftEye.x;
    const dy = rightEye.y - leftEye.y;
    const roll = Math.atan2(dy, dx);

    // Yaw: Based on z-depth difference of temples
    const yaw = Math.atan2(rightEye.z - leftEye.z, rightEye.x - leftEye.x);
    
    // Pitch: Based on z-depth difference of nose vs forehead/chin
    // Simplified pitch estimation
    const pitch = (landmarks[10].z - landmarks[152].z) * 2;

    groupRef.current.rotation.set(pitch, -yaw, -roll);

    // Calculate Scale
    // Distance between temples
    const width = Math.sqrt(
      Math.pow(rightTemple.x - leftTemple.x, 2) +
      Math.pow(rightTemple.y - leftTemple.y, 2)
    );
    const scale = width * 10; // Empirical multiplier
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      {/* 
        Generic glasses frame made of primitives. 
        In a real app, this would be a <primitive object={gltf.scene} /> 
      */}
      
      {/* Left Lens Frame */}
      <mesh position={[-0.35, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 16, 32]} />
        <meshStandardMaterial color={product?.colors?.[0]?.hex || "#1a1a1a"} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Right Lens Frame */}
      <mesh position={[0.35, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 16, 32]} />
        <meshStandardMaterial color={product?.colors?.[0]?.hex || "#1a1a1a"} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial color={product?.colors?.[0]?.hex || "#1a1a1a"} />
      </mesh>

      {/* Left Temple (arm) */}
      <mesh position={[-0.6, 0, -0.3]} rotation={[1.5, 0, 0.2]}>
        <boxGeometry args={[0.02, 0.01, 0.6]} />
        <meshStandardMaterial color={product?.colors?.[0]?.hex || "#1a1a1a"} />
      </mesh>

      {/* Right Temple (arm) */}
      <mesh position={[0.6, 0, -0.3]} rotation={[1.5, 0, -0.2]}>
        <boxGeometry args={[0.02, 0.01, 0.6]} />
        <meshStandardMaterial color={product?.colors?.[0]?.hex || "#1a1a1a"} />
      </mesh>
    </group>
  );
}
