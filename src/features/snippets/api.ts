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
import type { Snippet, SnippetInput } from './types'

const snippetsCollection = (userId: string) =>
  collection(db, 'users', userId, 'snippets')

function toSnippet(id: string, data: DocumentData): Snippet {
  const d = data
  return {
    id,
    title: d.title ?? '',
    language: d.language ?? 'plaintext',
    code: d.code ?? '',
    tags: Array.isArray(d.tags) ? d.tags : [],
    favorite: d.favorite === true,
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? '',
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? '',
  }
}

export async function fetchSnippets(userId: string): Promise<Snippet[]> {
  const q = query(
    snippetsCollection(userId),
    orderBy('updatedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => toSnippet(doc.id, doc.data()))
}

export async function createSnippet(
  userId: string,
  input: SnippetInput
): Promise<Snippet> {
  const ref = await addDoc(snippetsCollection(userId), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const snap = await getDoc(ref)
  return toSnippet(ref.id, snap.data() ?? {})
}

export async function updateSnippet(
  userId: string,
  id: string,
  input: Partial<SnippetInput>
): Promise<void> {
  const ref = doc(db, 'users', userId, 'snippets', id)
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSnippet(
  userId: string,
  id: string
): Promise<void> {
  const ref = doc(db, 'users', userId, 'snippets', id)
  await deleteDoc(ref)
}
