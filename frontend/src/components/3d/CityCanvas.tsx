import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface DistrictInfo {
  name: string;
  type: string;
  temp: string;
  greenness: string;
  density: string;
  status: string;
}

const DISTRICT_DATA: Record<string, DistrictInfo> = {
  Riverside: {
    name: 'Riverside Corridor',
    type: 'High-Density Waterfront',
    temp: '35.8°C',
    greenness: '14.2%',
    density: '7,420 /km²',
    status: 'Elevated Surface Heat Anomaly'
  },
  VanaCanopy: {
    name: 'Vana Botanical Buffer',
    type: 'Dense Urban Canopy',
    temp: '27.4°C',
    greenness: '52.6%',
    density: '2,150 /km²',
    status: 'Active Microclimate Cooling'
  },
  CentralPlaza: {
    name: 'Prithvi Civic Core',
    type: 'Commercial Terracotta Slabs',
    temp: '33.1°C',
    greenness: '22.8%',
    density: '8,890 /km²',
    status: 'Moderate Heat Trap Zone'
  }
};

export const CityCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(DISTRICT_DATA.Riverside);
  const [isDragging, setIsDragging] = useState(false);
  const [hotspot1Pos, setHotspot1Pos] = useState({ x: 0, y: 0, visible: false });
  const [hotspot2Pos, setHotspot2Pos] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0a07, 0.035);

    // Isometric Camera setup
    const aspect = width / height;
    const d = 14;
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 1000
    );
    camera.position.set(20, 24, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf4d38c, 2.2);
    sunLight.position.set(30, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    const shadowD = 18;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8a3c22, 1.2);
    fillLight.position.set(-20, 10, -15);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xd4af37, 2, 40);
    rimLight.position.set(0, 15, 0);
    scene.add(rimLight);

    // City Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Ground Platform
    const groundGeo = new THREE.BoxGeometry(22, 0.8, 22);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1b140d,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.4;
    ground.receiveShadow = true;
    cityGroup.add(ground);

    // Hatch / Diagonal grid lines on ground
    const gridHelper = new THREE.GridHelper(22, 22, 0x4a3826, 0x251c14);
    gridHelper.position.y = 0.02;
    cityGroup.add(gridHelper);

    // Diagonal Striped Terrains (matching Figma ground stripes)
    const stripeCount = 14;
    const stripeMat = new THREE.MeshBasicMaterial({
      color: 0x2e2316,
      transparent: true,
      opacity: 0.6
    });
    for (let i = -stripeCount; i <= stripeCount; i += 2) {
      const stripeGeo = new THREE.PlaneGeometry(0.3, 30);
      const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
      stripeMesh.rotation.x = -Math.PI / 2;
      stripeMesh.rotation.z = Math.PI / 4;
      stripeMesh.position.set(i * 0.9, 0.03, 0);
      cityGroup.add(stripeMesh);
    }

    // River / Canal running through the city
    const canalGeo = new THREE.PlaneGeometry(3.5, 22);
    const canalMat = new THREE.MeshStandardMaterial({
      color: 0x18241d,
      roughness: 0.2,
      metalness: 0.8
    });
    const canal = new THREE.Mesh(canalGeo, canalMat);
    canal.rotation.x = -Math.PI / 2;
    canal.position.set(1.5, 0.04, 0);
    cityGroup.add(canal);

    // Buildings / Monolithic Slabs
    // Palette: Terracotta, Weathered Bronze, Sandstone Gold
    const buildingColors = [0x533827, 0x6e4e37, 0x8a6446, 0xa57c58, 0x3d2b1f];
    const buildings: THREE.Mesh[] = [];

    // Building coordinate grid
    const layout = [
      { x: -7, z: -7, w: 2.2, d: 2.2, h: 7.5, color: 0x8a6446 },
      { x: -4, z: -7, w: 2.0, d: 2.0, h: 10.2, color: 0x6e4e37 },
      { x: -1, z: -7, w: 1.8, d: 1.8, h: 5.5, color: 0x533827 },
      { x: 5, z: -7, w: 2.4, d: 2.0, h: 8.8, color: 0x8a6446 },
      { x: 8, z: -7, w: 2.0, d: 2.0, h: 6.0, color: 0x6e4e37 },

      { x: -7, z: -3, w: 2.0, d: 2.0, h: 9.0, color: 0x6e4e37 },
      { x: -4, z: -3, w: 2.2, d: 2.2, h: 12.5, color: 0xa57c58 }, // Tallest heat slab
      { x: -1, z: -3, w: 1.8, d: 1.8, h: 4.8, color: 0x533827 },
      { x: 5, z: -3, w: 2.2, d: 2.2, h: 7.2, color: 0x6e4e37 },
      { x: 8, z: -3, w: 1.8, d: 1.8, h: 10.8, color: 0x8a6446 },

      { x: -7, z: 2, w: 2.0, d: 2.0, h: 6.2, color: 0x533827 },
      { x: -4, z: 2, w: 1.8, d: 1.8, h: 8.4, color: 0x6e4e37 },
      { x: 5, z: 2, w: 2.2, d: 2.2, h: 5.0, color: 0x8a6446 },
      { x: 8, z: 2, w: 2.0, d: 2.0, h: 7.8, color: 0x6e4e37 },

      { x: -7, z: 7, w: 2.2, d: 2.2, h: 4.5, color: 0x3d2b1f },
      { x: -4, z: 7, w: 2.0, d: 2.0, h: 5.2, color: 0x533827 },
      { x: 5, z: 7, w: 2.0, d: 2.0, h: 6.5, color: 0x6e4e37 },
      { x: 8, z: 7, w: 2.2, d: 2.2, h: 4.0, color: 0x533827 },
    ];

    layout.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.6,
        metalness: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add gold top-cap border to each building
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 });
      const wire = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(wire);

      cityGroup.add(mesh);
      buildings.push(mesh);
    });

    // Green Canopy Disks (representing cool parks / urban trees)
    const parkLocations = [
      { x: -1.5, z: 2, r: 1.2 },
      { x: -1.0, z: 4.5, r: 0.9 },
      { x: 1.5, z: 6, r: 1.4 },
      { x: -5, z: 5, r: 0.8 },
      { x: 6, z: 4.5, r: 1.0 },
    ];

    parkLocations.forEach((p) => {
      const parkGeo = new THREE.CylinderGeometry(p.r, p.r, 0.2, 24);
      const parkMat = new THREE.MeshStandardMaterial({
        color: 0x2e5a44,
        roughness: 0.7,
        metalness: 0.1
      });
      const park = new THREE.Mesh(parkGeo, parkMat);
      park.position.set(p.x, 0.1, p.z);
      park.receiveShadow = true;

      // Add thin glowing emerald ring
      const ringGeo = new THREE.RingGeometry(p.r - 0.05, p.r, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x58d68d, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.12;
      park.add(ring);

      cityGroup.add(park);
    });

    // 3D Hotspot Anchor Objects (world positions)
    const hotspot1World = new THREE.Vector3(-4, 12.8, -3); // Near tall hot slab
    const hotspot2World = new THREE.Vector3(-1.5, 0.8, 2);  // Near green park

    // Mouse Interaction / Drag Orbit
    let mouseX = 0;
    let targetRotationY = -Math.PI / 6;
    let targetRotationX = 0;
    let isMouseDown = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      setIsDragging(true);
      startX = e.clientX;
      startY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) {
        // subtle cursor parallax
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = -Math.PI / 6 + normX * 0.2;
        targetRotationX = normY * 0.1;
        return;
      }
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;
      targetRotationY += dx * 0.008;
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX + dy * 0.005));
    };

    const onMouseUp = () => {
      isMouseDown = false;
      setIsDragging(false);
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        setIsDragging(true);
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isMouseDown || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      targetRotationY += dx * 0.008;
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX + dy * 0.005));
    };

    const onTouchEnd = () => {
      isMouseDown = false;
      setIsDragging(false);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      const newAspect = newW / newH;
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const toScreenPosition = (objVec: THREE.Vector3) => {
      const v = objVec.clone().applyMatrix4(cityGroup.matrixWorld);
      v.project(camera);
      const halfW = width / 2;
      const halfH = height / 2;
      return {
        x: v.x * halfW + halfW,
        y: -v.y * halfH + halfH,
        visible: v.z < 1.0
      };
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group rotation with inertia
      cityGroup.rotation.y += (targetRotationY - cityGroup.rotation.y) * 0.06;
      cityGroup.rotation.x += (targetRotationX - cityGroup.rotation.x) * 0.06;

      // Subtle float animation
      cityGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

      renderer.render(scene, camera);

      // Project hotspots to 2D screen coordinates
      const p1 = toScreenPosition(hotspot1World);
      const p2 = toScreenPosition(hotspot2World);
      setHotspot1Pos(p1);
      setHotspot2Pos(p2);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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
        minHeight: '480px',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Figma Hotspot 1: High Surface Temperature */}
      {hotspot1Pos.visible && (
        <div
          onClick={() => setSelectedDistrict(DISTRICT_DATA.Riverside)}
          style={{
            position: 'absolute',
            left: `${hotspot1Pos.x}px`,
            top: `${hotspot1Pos.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            zIndex: 10
          }}
          className="hover:scale-105"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(23, 14, 10, 0.88)',
            border: '1px solid rgba(231, 76, 60, 0.65)',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.25)',
            borderRadius: '999px',
            padding: '4px 12px',
            color: '#f8d7da',
            fontSize: '11px',
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#e74c3c',
              boxShadow: '0 0 8px #e74c3c'
            }} />
            <span>35.8° SURFACE</span>
          </div>
        </div>
      )}

      {/* Figma Hotspot 2: Cool Canopy */}
      {hotspot2Pos.visible && (
        <div
          onClick={() => setSelectedDistrict(DISTRICT_DATA.VanaCanopy)}
          style={{
            position: 'absolute',
            left: `${hotspot2Pos.x}px`,
            top: `${hotspot2Pos.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            zIndex: 10
          }}
          className="hover:scale-105"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(10, 22, 16, 0.88)',
            border: '1px solid rgba(88, 214, 141, 0.65)',
            boxShadow: '0 4px 15px rgba(88, 214, 141, 0.2)',
            borderRadius: '999px',
            padding: '4px 12px',
            color: '#d4edda',
            fontSize: '11px',
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#58d68d',
              boxShadow: '0 0 8px #58d68d'
            }} />
            <span>COOL CANOPY</span>
          </div>
        </div>
      )}

      {/* Drag Hint (Figma: ⇅ DRAG THE CITY) */}
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '48%',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10px',
        letterSpacing: '0.22em',
        color: 'rgba(212, 175, 55, 0.75)',
        textTransform: 'uppercase',
        pointerEvents: 'none'
      }}>
        <span>⇅ DRAG THE CITY</span>
      </div>

      {/* Figma District HUD card in bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        width: '260px',
        background: 'rgba(18, 14, 10, 0.92)',
        border: '1px solid #4a3826',
        borderRadius: '6px',
        padding: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 5
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: '#9e855c',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          SELECTED DISTRICT
        </div>
        <div style={{
          fontSize: '18px',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          letterSpacing: '0.04em',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          {selectedDistrict.name}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          fontSize: '11px',
          marginBottom: '10px',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          <div>
            <div style={{ color: '#7a6b57', fontSize: '9px' }}>SURFACE TEMP</div>
            <div style={{ color: selectedDistrict.temp.includes('35') ? '#e74c3c' : '#58d68d', fontWeight: 600 }}>
              {selectedDistrict.temp}
            </div>
          </div>
          <div>
            <div style={{ color: '#7a6b57', fontSize: '9px' }}>GREENNESS</div>
            <div style={{ color: '#c5a059', fontWeight: 600 }}>{selectedDistrict.greenness}</div>
          </div>
        </div>

        <div style={{
          fontSize: '9.5px',
          letterSpacing: '0.15em',
          color: '#8b7a61',
          textTransform: 'uppercase',
          borderTop: '1px solid #281e14',
          paddingTop: '8px'
        }}>
          DEMO ENVIRONMENT · DRAG TO ORBIT
        </div>
      </div>
    </div>
  );
};
