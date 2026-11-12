import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MathUtils, type Mesh } from 'three';
import { scrollState } from '../../scroll/System';

/**
 * Sphère céramique du ch.02 : UN mesh icosaèdre subdivisé, ses facettes
 * s'illuminent séquentiellement via un uniform de shader (pas de meshes
 * multiples). Le seuil `lit` (0→1) pilote le révélage : les faces dont
 * faceRand < seuil passent de céramique à menthe.
 *
 * Implémentation shader via r3f extendMaterial-equivalent : patch de
 * MeshBasicMaterial par under-matériau custom (extend), type élargi pour
 * onBeforeCompile (non exposé par les types JSX de r3f).
 */
const orbUniforms = { uLit: { value: 0 } };

/** Patch du vertex/fragment shader standard de THREE (onBeforeCompile). */
function usePatchedMaterial() {
  return useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#c8ded0') });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uLit = orbUniforms.uLit;
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
          uniform float uLit;
          varying float vFaceRand;
          attribute float faceRand;`,
        )
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          vFaceRand = faceRand;`);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          uniform float uLit;
          varying float vFaceRand;`,
        )
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
          float lit = step(vFaceRand, uLit);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.34, 1.0, 0.6), lit * 0.85);`,
        );
    };
    return mat;
  }, []);
}

export function CeramicOrb({ position }: { position: [number, number, number] }) {
  const mesh = useRef<Mesh>(null);
  const smooth = useRef(0);
  const material = usePatchedMaterial();

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const d = Math.min(delta, 0.05);
    const target = scrollState.chapters.get('about') ?? 0;
    smooth.current = MathUtils.damp(smooth.current, target, 4, d);
    orbUniforms.uLit.value = smooth.current;
    mesh.current.rotation.y += d * 0.25;
    const grow = MathUtils.smoothstep(smooth.current, 0, 0.5);
    mesh.current.scale.setScalar(Math.max(0.001, 0.15 + grow * 0.85));
  });

  // faceRand par vertice : stable, séparé pour modeler un révélage organique.
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.95, 2);
    const count = geo.attributes.position.count;
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) rand[i] = ((i * 2654435761) % 1000) / 1000;
    geo.setAttribute('faceRand', new THREE.BufferAttribute(rand, 1));
    return geo;
  }, []);

  return (
    <mesh ref={mesh} position={position} scale={0.001} material={material} geometry={geometry} />
  );
}
