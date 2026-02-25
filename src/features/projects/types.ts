export const PROJECT_STATUSES = ['planning', 'in-progress', 'completed', 'on-hold'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  status: ProjectStatus
  startDate: string
  links: ProjectLink[]
  progress: number
  createdAt: string
  updatedAt: string
}

export interface ProjectInput {
  title: string
  description: string
  techStack: string[]
  status: ProjectStatus
  startDate: string
  links: ProjectLink[]
  progress: number
}
