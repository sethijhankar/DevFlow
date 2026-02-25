import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Project, ProjectInput } from './types'

const projectsCollection = (userId: string) =>
  collection(db, 'users', userId, 'projects')

function toProject(id: string, data: DocumentData): Project {
  const d = data
  return {
    id,
    title: d.title ?? '',
    description: d.description ?? '',
    techStack: Array.isArray(d.techStack) ? d.techStack : [],
    status: d.status ?? 'planning',
    startDate: d.startDate ?? '',
    links: Array.isArray(d.links) ? d.links : [],
    progress: typeof d.progress === 'number' ? d.progress : 0,
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? '',
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? '',
  }
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const q = query(
    projectsCollection(userId),
    orderBy('updatedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => toProject(doc.id, doc.data()))
}

export async function createProject(
  userId: string,
  input: ProjectInput
): Promise<Project> {
  const ref = await addDoc(projectsCollection(userId), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const snap = await getDoc(ref)
  return toProject(ref.id, snap.data() ?? {})
}

export async function updateProject(
  userId: string,
  id: string,
  input: Partial<ProjectInput>
): Promise<void> {
  const ref = doc(db, 'users', userId, 'projects', id)
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  const ref = doc(db, 'users', userId, 'projects', id)
  await deleteDoc(ref)
}
