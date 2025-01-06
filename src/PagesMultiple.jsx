import { useTextures } from "./TextureContext";

const MultiplePages = ({amount = 6, z_origin = 0, z_directed = 0.015}) => {

  const textures = useTextures();

  const pages = Array.from({ length: amount }, (_, index) => (
    <mesh key={index} position={[0, 0, z_origin + index * z_directed]}>
      <boxGeometry args={[1.1, 1.5, 0.003]} />
      <meshStandardMaterial
        color="beige"
        emissive="#FFFFFF" // No emissive light, perhaps redundant but hey
        emissiveIntensity={0.2} // Fuck. Project soon done and I just learnt how emissiveness works ...
        roughness={0.8}
        normalMap={textures.normalSnow}
        diffuseMap={textures.diffuseSnow}
      />
    </mesh>
  ));

  return <>{pages}</>;
};

export default MultiplePages;

