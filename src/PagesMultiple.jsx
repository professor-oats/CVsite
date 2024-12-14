const MultiplePages = ({amount = 6, z_origin = 0, z_directed = 0.015}) => {
  const pages = Array.from({ length: amount }, (_, index) => (
    <mesh key={index} position={[0, 0, z_origin + index * z_directed]}>
      <boxGeometry args={[1.1, 1.5, 0.003]} />
      <meshStandardMaterial
        color="beige"
        emissive="#000000" // No emissive light, perhaps redundant but hey
        emissiveIntensity={0}
        roughness={0.8}
      />
    </mesh>
  ));

  return <>{pages}</>;
};

export default MultiplePages;

