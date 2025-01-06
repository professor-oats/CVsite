// Texture Context Loader for global use

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextureLoader } from 'three';

const TextureContext = createContext();

export const useTextures = () => useContext(TextureContext);

export const TextureProvider = ({ children, materials = [] }) => {
  const [textures, setTextures] = useState({});

  useEffect(() => {
    const loader = new TextureLoader();
    const loadedTextures = {};

    const loadMaterialTextures = (materialName) => {
      switch (materialName) {
        case 'leather':
          loadedTextures.normalLeather = loader.load('./materials/leather/PNG/fabric_leather_02_nor_gl_1k.png');
          loadedTextures.roughnessLeather = loader.load('./materials/leather/PNG/fabric_leather_02_rough_1k.png');
          loadedTextures.diffuseLeather = loader.load('./materials/leather/PNG/fabric_leather_02_diff_1k.png');
          break;
        case 'snow':
          loadedTextures.normalSnow = loader.load('./materials/snow/PNG/snow_02_nor_gl_1k.png');
          loadedTextures.roughnessSnow = loader.load('./materials/snow/PNG/snow_02_rough_1k.png');
          loadedTextures.diffuseSnow = loader.load('./materials/snow/PNG/snow_02_diff_1k.png');
          break;
        default:
          console.warn(`Material ${materialName} is not recognized.`);
      }
    };

    materials.forEach(loadMaterialTextures);
    setTextures(loadedTextures);
  }, [materials]);

  return (
    <TextureContext.Provider value={textures}>
      {children}
    </TextureContext.Provider>
  );
};