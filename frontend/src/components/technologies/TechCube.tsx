import { Scene } from '../three/Scene';
import { TechDie } from './TechDie';
import type { Technology } from '../../lib/types';

interface TechCubeProps {
  technologies: Technology[];
  active: boolean;
}

const COLUMNS = 6;
const SPACING = 2.1;

export function TechCube({ technologies, active }: TechCubeProps) {
  const rows = Math.ceil(technologies.length / COLUMNS);
  const offsetX = ((Math.min(technologies.length, COLUMNS) - 1) * SPACING) / 2;
  const offsetY = ((rows - 1) * SPACING) / 2;

  return (
    <div className="h-[420px] md:h-[520px] w-full">
      <Scene active={active} cameraPosition={[0, 0, 11]} fov={45}>
        {technologies.map((tech, i) => {
          const col = i % COLUMNS;
          const row = Math.floor(i / COLUMNS);
          return (
            <TechDie
              key={tech.id}
              technology={tech}
              position={[col * SPACING - offsetX, offsetY - row * SPACING, 0]}
            />
          );
        })}
      </Scene>
    </div>
  );
}
