import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { WeeklySummaryData } from './weeklySummary'

const SUMMARY_DOC_ID = 'current'

function weeklySummaryRef(userId: string) {
  return doc(db, 'users', userId, 'weeklySummary', SUMMARY_DOC_ID)
}

export async function fetchWeeklySummary(
  userId: string
): Promise<WeeklySummaryData | null> {
  const snap = await getDoc(weeklySummaryRef(userId))
  if (!snap.exists()) return null
  const d = snap.data()
  return {
    weekLabel: d.weekLabel ?? '',
    summary: d.summary ?? '',
    generatedAt: d.generatedAt?.toDate?.()?.toISOString() ?? '',
  }
}

export async function saveWeeklySummary(
  userId: string,
  data: Omit<WeeklySummaryData, 'generatedAt'>
): Promise<WeeklySummaryData> {
  const ref = weeklySummaryRef(userId)
  const payload = {
    ...data,
    generatedAt: serverTimestamp(),
  }
  await setDoc(ref, payload)
  return {
    ...data,
    generatedAt: new Date().toISOString(),
  }
}
