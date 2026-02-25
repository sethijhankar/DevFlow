import { useState, useEffect } from 'react'
import type { Project, ProjectInput, ProjectLink, ProjectStatus } from './types'
import { PROJECT_STATUSES } from './types'

const emptyLink: ProjectLink = { label: '', url: '' }

const defaultInput: ProjectInput = {
  title: '',
  description: '',
  techStack: [],
  status: 'planning',
  startDate: '',
  links: [],
  progress: 0,
}

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (input: ProjectInput) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProjectFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [techStackStr, setTechStackStr] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('planning')
  const [startDate, setStartDate] = useState('')
  const [links, setLinks] = useState<ProjectLink[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setDescription(project.description)
      setTechStackStr(project.techStack.join(', '))
      setStatus(project.status)
      setStartDate(project.startDate.slice(0, 10))
      setLinks(
        project.links.length > 0 ? project.links : [{ ...emptyLink }]
      )
      setProgress(project.progress)
    } else {
      setTitle(defaultInput.title)
      setDescription(defaultInput.description)
      setTechStackStr('')
      setStatus(defaultInput.status)
      setStartDate('')
      setLinks([{ ...emptyLink }])
      setProgress(defaultInput.progress)
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const techStack = techStackStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const validLinks = links.filter((l) => l.label.trim() && l.url.trim())
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      techStack,
      status,
      startDate: startDate.trim(),
      links: validLinks,
      progress: Math.min(100, Math.max(0, progress)),
    })
  }

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    )
  }

  const addLink = () => setLinks((prev) => [...prev, { ...emptyLink }])
  const removeLink = (index: number) =>
    setLinks((prev) => prev.filter((_, i) => i !== index))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tech stack (comma-separated)
        </label>
        <input
          type="text"
          value={techStackStr}
          onChange={(e) => setTechStackStr(e.target.value)}
          placeholder="React, TypeScript, Firebase"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Progress (%)
        </label>
        <input
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Links</label>
          <button
            type="button"
            onClick={addLink}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add link
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateLink(index, 'label', e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="rounded-lg px-2 text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : project ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
