"use client"; // This component must be a client component for interactivity.

import { useState, useEffect } from 'react';

// A self-contained component for the 3D cube. No external libraries needed.
export default function InteractiveCube() {
  const [rotation, setRotation] = useState({ x: -15, y: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the viewport
      const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      // Define the maximum rotation angle
      const maxRotation = 25;

      // Update the rotation state based on mouse position
      setRotation({
        x: -mouseY * maxRotation, // Invert Y for intuitive up/down rotation
        y: mouseX * maxRotation,
      });
    };

    // Add event listener when the component mounts
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs only once

  return (
    // This is the container for our 3D scene. 
    // The `perspective` property is crucial for creating the 3D effect.
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
      
      {/* This is the cube itself. We apply the rotation and transition here. */}
      <div
        className="w-48 h-48 relative transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Each `div` below is one face of the cube. */}
        {/* They are positioned in 3D space using CSS transforms. */}
        <div className="cube-face" style={{ transform: 'rotateY(0deg) translateZ(96px)' }}></div>
        <div className="cube-face" style={{ transform: 'rotateY(180deg) translateZ(96px)' }}></div>
        <div className="cube-face" style={{ transform: 'rotateY(90deg) translateZ(96px)' }}></div>
        <div className="cube-face" style={{ transform: 'rotateY(-90deg) translateZ(96px)' }}></div>
        <div className="cube-face" style={{ transform: 'rotateX(90deg) translateZ(96px)' }}></div>
        <div className="cube-face" style={{ transform: 'rotateX(-90deg) translateZ(96px)' }}></div>
      </div>
    </div>
  );
}