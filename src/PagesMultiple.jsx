const MultiplePages = () => {
  const pages = Array.from({ length: 8 }, (_, index) => (
    <mesh key={index} position={[0, 0, 0.015 + index * 0.015]}>
      <boxGeometry args={[1.1, 1.5, 0.003]} />
      <meshStandardMaterial color="beige" />
    </mesh>
  ));

  return <>{pages}</>;
};

export default MultiplePages;

