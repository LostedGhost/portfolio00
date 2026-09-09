import { useProjects } from '../../api/hooks';
import { SectionWrapper } from '../layout/SectionWrapper';
import { ProjectCard } from './ProjectCard';

export function ProjectsGrid() {
  const { data: projects = [] } = useProjects();

  return (
    <SectionWrapper id="projects" index={5} title="Projets" subtitle="Une selection de mes realisations recentes">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} {...project} featured={i === 0} />
        ))}
      </div>
    </SectionWrapper>
  );
}
