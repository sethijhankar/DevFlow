export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  projectId: string | null
  createdAt: string
  updatedAt: string
}

export interface NoteInput {
  title: string
  content: string
  tags: string[]
  projectId: string | null
}
