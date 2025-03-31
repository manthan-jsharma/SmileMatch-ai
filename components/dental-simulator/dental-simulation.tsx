"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Vector3 } from "three";
import InfoPanel from "./info-panel";
import MeasurementsOverlay from "./measurements-overlay";
import TreatmentTimeline from "./treatment-timeline";
import { useSimulationSettings } from "@/hooks/use-simulation-settings";

// Create more realistic teeth models
const TeethModel = ({
  modelType,
  visible,
  position = [0, 0, 0],
  isTransforming,
  transformProgress,
  animationSpeed,
}) => {
  const group = useRef();

  // Calculate the adjusted animation speed (0.5 to 2.0 times normal)
  const speedFactor = 0.5 + (animationSpeed / 100) * 1.5;

  // Define the initial and ideal positions for each bite type
  const getInitialLowerPosition = () => {
    if (modelType === "overbite") {
      return [0, -0.5, -0.3]; // Lower jaw is set back
    } else if (modelType === "underbite") {
      return [0, -0.5, 0.3]; // Lower jaw protrudes
    } else if (modelType === "crossbite") {
      return [0, -0.5, 0, 0.2]; // Lower jaw is shifted to side (4th param is x-offset)
    }
    return [0, -0.5, 0, 0];
  };

  const getIdealLowerPosition = () => {
    return [0, -0.5, 0, 0]; // Aligned position for all types
  };

  const initialPos = getInitialLowerPosition();
  const idealPos = getIdealLowerPosition();

  // Spring animation for transformation
  const { lowerTeethPos, lowerTeethXOffset } = useSpring({
    lowerTeethPos: isTransforming ? idealPos[2] : initialPos[2],
    lowerTeethXOffset: isTransforming ? idealPos[3] || 0 : initialPos[3] || 0,
    config: { duration: 2000 / speedFactor },
  });

  if (!visible) return null;

  return (
    <group ref={group} position={position}>
      {/* Upper teeth arch */}
      <group position={[0, 0.5, 0]} name="upperTeeth">
        {/* Main arch */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.5, 0.4, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.3} />
        </mesh>

        {/* Individual teeth - front teeth */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = Math.PI / 2 - (i - 2.5) * 0.15;
          const radius = 1.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={`upper-front-${i}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - angle, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.5, 0.15]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Back teeth - molars (left side) */}
        {Array.from({ length: 3 }).map((_, i) => {
          const angle = Math.PI / 2 + (i + 1) * 0.2;
          const radius = 1.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={`upper-left-${i}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - angle, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.25, 0.4, 0.25]} />
                <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
              </mesh>
            </group>
          );
        })}

        {/* Back teeth - molars (right side) */}
        {Array.from({ length: 3 }).map((_, i) => {
          const angle = Math.PI / 2 - (i + 3.5) * 0.2;
          const radius = 1.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={`upper-right-${i}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - angle, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.25, 0.4, 0.25]} />
                <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Lower teeth arch - animated position */}
      <animated.group
        position-z={lowerTeethPos}
        position-x={lowerTeethXOffset}
        position-y={-0.5}
        name="lowerTeeth"
      >
        {/* Main arch */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.3, 0.35, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.3} />
        </mesh>

        {/* Individual teeth - front teeth */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = Math.PI / 2 - (i - 2.5) * 0.15;
          const radius = 1.3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={`lower-front-${i}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - angle, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.18, 0.45, 0.14]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Back teeth - molars (left side) */}
        {Array.from({ length: 3 }).map((_, i) => {
          const angle = Math.PI / 2 + (i + 1) * 0.2;
          const radius = 1.3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={`lower-left-${i}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - angle, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.23, 0.35, 0.23]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
              </mesh>
            </group>
          );
        })}

        {/* Back teeth - molars (right side) */}
        {Array.from({ length: 3 }).map((_, i) => {
          const angle = Math.PI / 2 - (i + 3.5) * 0.2;
          const radius = 1.3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={`lower-right-${i}`}
              position={[x, 0, z]}
              rotation={[0, Math.PI / 2 - angle, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.23, 0.35, 0.23]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </animated.group>
    </group>
  );
};

// Draggable Invisalign component with more realistic shape
const DraggableInvisalign = ({ onDrop, isVisible, activeModel }) => {
  const meshRef = useRef();
  const [position, setPosition] = useState([2.5, 0, 0]); // Start position (to the right of teeth)
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { camera, raycaster, mouse, scene } = useThree();

  // Handle drag start
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  };

  // Handle drag movement
  useFrame(() => {
    if (isDragging && meshRef.current) {
      raycaster.setFromCamera(mouse, camera);

      // Project mouse position to 3D space
      const pos = new Vector3();
      pos.set(mouse.x, mouse.y, 0.5); // z=0.5 is the distance from camera
      pos.unproject(camera);

      // Calculate direction and distance
      const dir = pos.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;

      // Set new position
      const newPos = new Vector3();
      newPos.copy(camera.position).add(dir.multiplyScalar(distance));

      setPosition([newPos.x, newPos.y, newPos.z]);
    }
  });

  const handlePointerUp = (e) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      document.body.style.cursor = "auto";

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      const teethIntersect = intersects.find((intersect) => {
        let obj = intersect.object;
        while (obj) {
          if (
            obj.name &&
            (obj.name.includes("upperTeeth") || obj.name.includes("lowerTeeth"))
          ) {
            return true;
          }
          obj = obj.parent;
        }
        return false;
      });

      if (teethIntersect) {
        onDrop(true);
        setPosition([0, 0, 0]);
      } else {
        setPosition([2.5, 0, 0]);
      }
    }
  };

  const handlePointerOver = () => {
    setIsHovering(true);
    document.body.style.cursor = "grab";
  };

  const handlePointerOut = () => {
    setIsHovering(false);
    if (!isDragging) document.body.style.cursor = "auto";
  };

  if (!isVisible) return null;

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={isHovering ? 1.05 : 1}
    >
      {/* Upper aligner - more realistic shape */}
      <group position={[0, 0.5, 0]}>
        {/* Main aligner body */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.52, 0.42, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#a0e0ff"
            transparent
            opacity={0.6}
            roughness={0.1}
            emissive="#a0e0ff"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Inner surface */}
        <mesh position={[0, -0.05, 0]}>
          <torusGeometry args={[1.5, 0.35, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#c0e8ff"
            transparent
            opacity={0.4}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Lower aligner - more realistic shape */}
      <group position={[0, -0.5, 0]}>
        {/* Main aligner body */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.32, 0.37, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#a0e0ff"
            transparent
            opacity={0.6}
            roughness={0.1}
            emissive="#a0e0ff"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Inner surface */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[1.3, 0.3, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#c0e8ff"
            transparent
            opacity={0.4}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Label */}
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        Invisalign
      </Text>
    </group>
  );
};

// Veneer treatment component with more realistic appearance
const VeneerTreatment = ({ type, active, activeModel }) => {
  const springs = useSpring({
    opacity: active ? 0.9 : 0,
    scale: active ? 1 : 0.95,
    config: { duration: 1000 },
  });

  // Different veneer colors and properties based on type
  const veneerColor =
    type === "hollywood"
      ? "#ffffff"
      : type === "dominant"
      ? "#f8f8f0"
      : type === "porcelain"
      ? "#f0f0e8"
      : "#ffffff";

  const veneerRoughness =
    type === "hollywood"
      ? 0.05
      : type === "dominant"
      ? 0.1
      : type === "porcelain"
      ? 0.15
      : 0.1;

  const veneerMetalness =
    type === "hollywood"
      ? 0.3
      : type === "dominant"
      ? 0.1
      : type === "porcelain"
      ? 0.05
      : 0.1;

  if (!active) return null;

  return (
    <animated.group position-y={0.5} scale={springs.scale}>
      {/* Main veneer arch */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[1.51, 0.41, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={veneerColor}
          transparent
          opacity={springs.opacity}
          roughness={veneerRoughness}
          metalness={veneerMetalness}
        />
      </mesh>

      {/* Individual veneers - front teeth only */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = Math.PI / 2 - (i - 2.5) * 0.15;
        const radius = 1.51;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <animated.group
            key={`veneer-${i}`}
            position={[x, 0, z]}
            rotation={[0, Math.PI / 2 - angle, 0]}
            opacity={springs.opacity}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.21, 0.52, 0.08]} />
              <meshStandardMaterial
                color={veneerColor}
                transparent
                opacity={springs.opacity}
                roughness={veneerRoughness}
                metalness={veneerMetalness}
              />
            </mesh>
          </animated.group>
        );
      })}
    </animated.group>
  );
};

// Main scene component
const Scene = ({
  activeModel,
  activeTreatment,
  simulationSettings,
  setInfoText,
  setTreatmentProgress,
  setTreatmentData,
}) => {
  const [isInvisalignTransforming, setIsInvisalignTransforming] =
    useState(false);
  const [showInvisalignModel, setShowInvisalignModel] = useState(false);
  const [autoRotate, setAutoRotate] = useState(simulationSettings.autoRotate);
  const orbitControlsRef = useRef();

  // Handle Invisalign drop
  const handleInvisalignDrop = (success) => {
    if (success) {
      setIsInvisalignTransforming(true);
      setShowInvisalignModel(false); // Hide draggable model
      setInfoText(
        `Invisalign treatment for ${activeModel}. Estimated time: 18-24 months. Transforming to ideal position...`
      );

      // Reset and animate progress
      setTreatmentProgress(0);

      // Set treatment data for timeline
      setTreatmentData({
        type: "invisalign",
        startDate: new Date(),
        endDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // ~18 months in the future
        checkpoints: [
          { label: "Initial", date: new Date(), complete: true },
          {
            label: "Aligner 1",
            date: new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000),
            complete: false,
          },
          {
            label: "Aligner 5",
            date: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000),
            complete: false,
          },
          {
            label: "Aligner 10",
            date: new Date(Date.now() + 20 * 7 * 24 * 60 * 60 * 1000),
            complete: false,
          },
          {
            label: "Aligner 20",
            date: new Date(Date.now() + 40 * 7 * 24 * 60 * 60 * 1000),
            complete: false,
          },
          {
            label: "Final",
            date: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000),
            complete: false,
          },
        ],
      });

      const timer = setInterval(() => {
        setTreatmentProgress((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(timer);
          return 100;
        });
      }, 30);
    }
  };

  // Update auto-rotate when settings change
  useEffect(() => {
    setAutoRotate(simulationSettings.autoRotate);
  }, [simulationSettings.autoRotate]);

  // Show Invisalign model when treatment is selected
  useEffect(() => {
    if (activeTreatment?.type === "invisalign") {
      setShowInvisalignModel(true);
      setIsInvisalignTransforming(false);

      // Reset treatment data
      setTreatmentData(null);
    } else {
      setShowInvisalignModel(false);
      setIsInvisalignTransforming(false);
    }

    // Handle veneer treatments
    if (activeTreatment?.type.includes("veneer")) {
      const veneerType = activeTreatment.type.split("-")[1];

      if (veneerType === "hollywood") {
        setInfoText(
          "Hollywood Veneers: Bright white, highly reflective porcelain for a dramatic smile makeover. Typically lasts 10-15 years."
        );
        setTreatmentData({
          type: "veneer",
          veneerType: "hollywood",
          duration: "2-3 visits",
          maintenance: "Regular polishing, avoid staining foods",
        });
      } else if (veneerType === "dominant") {
        setInfoText(
          "Dominant Veneers: Natural-looking with slightly elongated central incisors for a confident smile. Provides a balanced, harmonious appearance."
        );
        setTreatmentData({
          type: "veneer",
          veneerType: "dominant",
          duration: "2-3 visits",
          maintenance: "Regular dental checkups, gentle brushing",
        });
      } else if (veneerType === "porcelain") {
        setInfoText(
          "Porcelain Veneers: Custom-matched to your natural tooth color with translucent properties. Most natural-looking option with excellent durability."
        );
        setTreatmentData({
          type: "veneer",
          veneerType: "porcelain",
          duration: "2-3 visits",
          maintenance: "Avoid biting hard objects, night guard recommended",
        });
      }
    } else if (!activeTreatment?.type) {
      setInfoText("");
      setTreatmentData(null);
    }
  }, [activeTreatment, activeModel, setInfoText, setTreatmentData]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow={simulationSettings.shadows}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <TeethModel
        modelType="overbite"
        visible={activeModel === "overbite"}
        isTransforming={isInvisalignTransforming}
        transformProgress={0}
        animationSpeed={simulationSettings.animationSpeed}
      />
      <TeethModel
        modelType="underbite"
        visible={activeModel === "underbite"}
        isTransforming={isInvisalignTransforming}
        transformProgress={0}
        animationSpeed={simulationSettings.animationSpeed}
      />
      <TeethModel
        modelType="crossbite"
        visible={activeModel === "crossbite"}
        isTransforming={isInvisalignTransforming}
        transformProgress={0}
        animationSpeed={simulationSettings.animationSpeed}
      />

      <DraggableInvisalign
        onDrop={handleInvisalignDrop}
        isVisible={showInvisalignModel && !isInvisalignTransforming}
        activeModel={activeModel}
      />

      {activeTreatment?.type === "veneer-hollywood" && (
        <VeneerTreatment
          type="hollywood"
          active={true}
          activeModel={activeModel}
        />
      )}

      {activeTreatment?.type === "veneer-dominant" && (
        <VeneerTreatment
          type="dominant"
          active={true}
          activeModel={activeModel}
        />
      )}

      {activeTreatment?.type === "veneer-porcelain" && (
        <VeneerTreatment
          type="porcelain"
          active={true}
          activeModel={activeModel}
        />
      )}

      <Environment preset="studio" />
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
      />
    </>
  );
};

export default function DentalSimulation({ activeModel, activeTreatment }) {
  const [infoText, setInfoText] = useState("");
  const [treatmentProgress, setTreatmentProgress] = useState(0);
  const [treatmentData, setTreatmentData] = useState(null);
  const { simulationSettings } = useSimulationSettings();

  // Set detail level based on settings
  const getPixelRatio = () => {
    const quality = simulationSettings.renderQuality;
    switch (quality) {
      case "low":
        return 1;
      case "medium":
        return 1.5;
      case "high":
        return 2;
      case "ultra":
        return 3;
      default:
        return 2;
    }
  };

  const pixelRatio = getPixelRatio();

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 relative">
      <Canvas
        shadows={simulationSettings.shadows}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={pixelRatio}
      >
        <Scene
          activeModel={activeModel}
          activeTreatment={activeTreatment}
          simulationSettings={simulationSettings}
          setInfoText={setInfoText}
          setTreatmentProgress={setTreatmentProgress}
          setTreatmentData={setTreatmentData}
        />
      </Canvas>

      {infoText && (
        <InfoPanel
          text={infoText}
          progress={treatmentProgress}
          isActive={!!activeTreatment}
          textSize={simulationSettings.textSize}
        />
      )}

      {simulationSettings.showMeasurements && treatmentData && (
        <MeasurementsOverlay
          treatmentData={treatmentData}
          activeModel={activeModel}
          textSize={simulationSettings.textSize}
        />
      )}

      {simulationSettings.showTimeline &&
        treatmentData &&
        treatmentData.type === "invisalign" && (
          <TreatmentTimeline
            treatmentData={treatmentData}
            progress={treatmentProgress}
            textSize={simulationSettings.textSize}
          />
        )}

      <div className="absolute top-4 right-4 text-xs bg-white dark:bg-gray-700 p-2 rounded-md shadow-md">
        <p className="font-medium">Instructions:</p>
        <p>Drag the Invisalign onto the teeth model to apply</p>
      </div>
    </div>
  );
}
