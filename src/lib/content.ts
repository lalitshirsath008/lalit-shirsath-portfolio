import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export const COLLECTIONS = {
  skills: 'skills',
  projects: 'projects',
  experiences: 'experiences',
  education: 'education',
  certifications: 'certifications',
  activities: 'activities',
} as const;

export type CollectionName = keyof typeof COLLECTIONS;

export async function fetchAll<T>(name: CollectionName): Promise<(T & { id: string })[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTIONS[name]), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function addItem<T extends object>(name: CollectionName, data: T) {
  if (!db) throw new Error('Firebase is not configured yet.');
  return addDoc(collection(db, COLLECTIONS[name]), data);
}

export async function updateItem<T extends object>(
  name: CollectionName,
  id: string,
  data: Partial<T>
) {
  if (!db) throw new Error('Firebase is not configured yet.');
  // Firestore's UpdateData<T> typing is stricter than useful here for a generic
  // internal helper - the callers (admin panels) already know their own shapes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return updateDoc(doc(db, COLLECTIONS[name], id), data as any);
}

export async function deleteItem(name: CollectionName, id: string) {
  if (!db) throw new Error('Firebase is not configured yet.');
  return deleteDoc(doc(db, COLLECTIONS[name], id));
}

// Used once by the admin panel's "Seed starter content" action, and to assign
// a stable id so re-running the seed overwrites rather than duplicating.
export async function seedItem<T extends object>(name: CollectionName, id: string, data: T) {
  if (!db) throw new Error('Firebase is not configured yet.');
  return setDoc(doc(db, COLLECTIONS[name], id), data);
}

// Makes a collection exactly match the given starter set: deletes any existing
// doc whose id isn't in `items`, then writes all of `items`. Used by "Seed
// starter content" so re-seeding after the resume content changes doesn't leave
// old entries (e.g. a previous career's projects) sitting alongside the new ones.
export async function replaceCollection<T extends object>(
  name: CollectionName,
  items: (T & { id: string })[]
) {
  if (!db) throw new Error('Firebase is not configured yet.');
  const existing = await getDocs(collection(db, COLLECTIONS[name]));
  const keepIds = new Set(items.map((i) => i.id));

  const batch = writeBatch(db);
  existing.docs.forEach((d) => {
    if (!keepIds.has(d.id)) batch.delete(d.ref);
  });
  items.forEach(({ id, ...rest }) => {
    batch.set(doc(db!, COLLECTIONS[name], id), rest);
  });
  await batch.commit();
}
