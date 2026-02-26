import { useState } from 'react'
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from './hooks'
import { ProjectCard } from './ProjectCard'
import { ProjectForm } from './ProjectForm'
import { ProjectModal } from './ProjectModal'
import type { Project, ProjectInput } from './types'

export function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useProjects()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [modal, setModal] = useState<'create' | Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const handleCreate = () => setModal('create')
  const handleEdit = (project: Project) => setModal(project)
  const handleCloseModal = () => setModal(null)

  const handleSubmit = (input: ProjectInput) => {
    if (modal === 'create') {
      createProject.mutate(input, { onSuccess: () => handleCloseModal() })
    } else if (modal && typeof modal === 'object') {
      updateProject.mutate(
        { id: modal.id, input },
        { onSuccess: () => handleCloseModal() }
      )
    }
  }

  const handleDeleteClick = (project: Project) => setDeleteTarget(project)
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteProject.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load projects. Please try again.
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 active:bg-gray-700 sm:w-auto"
        >
          Add project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center">
          <p className="text-gray-600">No projects yet.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {modal !== null && (
        <ProjectModal
          title={modal === 'create' ? 'New project' : 'Edit project'}
          onClose={handleCloseModal}
        >
          <ProjectForm
            project={typeof modal === 'object' ? modal : undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={
              createProject.isPending || updateProject.isPending
            }
          />
        </ProjectModal>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <p className="text-gray-700">
              Delete <strong>{deleteTarget.title}</strong>? This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteProject.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteProject.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
