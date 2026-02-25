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
import type { Note, NoteInput } from './types'

const notesCollection = (userId: string) =>
  collection(db, 'users', userId, 'notes')

function toNote(id: string, data: DocumentData): Note {
  const d = data
  return {
    id,
    title: d.title ?? '',
    content: d.content ?? '',
    tags: Array.isArray(d.tags) ? d.tags : [],
    projectId: d.projectId ?? null,
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? '',
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? '',
  }
}

export async function fetchNotes(userId: string): Promise<Note[]> {
  const q = query(
    notesCollection(userId),
    orderBy('updatedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => toNote(doc.id, doc.data()))
}

export async function createNote(
  userId: string,
  input: NoteInput
): Promise<Note> {
  const ref = await addDoc(notesCollection(userId), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const snap = await getDoc(ref)
  return toNote(ref.id, snap.data() ?? {})
}

export async function updateNote(
  userId: string,
  id: string,
  input: Partial<NoteInput>
): Promise<void> {
  const ref = doc(db, 'users', userId, 'notes', id)
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteNote(userId: string, id: string): Promise<void> {
  const ref = doc(db, 'users', userId, 'notes', id)
  await deleteDoc(ref)
}
