import type { Project } from './types'
import { PROJECT_STATUSES } from './types'

const statusColors: Record<Project['status'], string> = {
  planning: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  'on-hold': 'bg-amber-100 text-amber-700',
}

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const startLabel = project.startDate
    ? new Date(project.startDate).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : '—'

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]}`}
        >
          {PROJECT_STATUSES.find((s) => s === project.status) ?? project.status}
        </span>
      </div>
      {project.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {project.description}
        </p>
      )}
      {project.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span>Started {startLabel}</span>
        <span>·</span>
        <span>{project.progress}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-400 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
        />
      </div>
      {project.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => onEdit(project)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(project)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
