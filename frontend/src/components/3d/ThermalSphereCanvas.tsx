import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThermalSphereCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Warm atmospheric lighting
    const ambientLight = new THREE.AmbientLight(0x442211, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf4a261, 4.5, 20);
    pointLight.position.set(2, 3, 5);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xe76f51, 3.0, 20);
    rimLight.position.set(-4, -2, -2);
    scene.add(rimLight);

    // Main Sphere Group
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Base Terracotta Sphere
    const sphereGeo = new THREE.SphereGeometry(2.3, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x9e472a,
      roughness: 0.65,
      metalness: 0.25,
      bumpScale: 0.08
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(sphereMesh);

    // Concentric Topographic Heat Rings across the sphere surface
    const ringCount = 18;
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45
    });

    for (let i = 0; i < ringCount; i++) {
      const radius = 0.2 + (i * 0.11);
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.015, 64);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      // Place concentric rings tangent to upper-left face of the sphere (matching Figma)
      ringMesh.position.set(-0.6, 0.6, 2.15 - (i * 0.08));
      ringMesh.rotation.x = 0.25;
      ringMesh.rotation.y = -0.3;
      sphereGroup.add(ringMesh);
    }

    // Core Glowing Focal Point
    const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffe6a7 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(-0.6, 0.6, 2.22);
    sphereGroup.add(coreMesh);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle orbital drift
      sphereGroup.rotation.y = elapsed * 0.12;
      sphereGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
      sphereMesh.position.y = Math.sin(elapsed * 0.8) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* Centered label matching Figma */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '46%',
        transform: 'translate(-50%, -50%)',
        fontSize: '9px',
        letterSpacing: '0.25em',
        color: 'rgba(244, 237, 226, 0.85)',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        fontWeight: 600,
        textShadow: '0 2px 8px rgba(0,0,0,0.8)'
      }}>
        THERMAL SIGNAL
      </div>
    </div>
  );
};
