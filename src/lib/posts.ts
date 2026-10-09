import { collection, doc, getDoc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

// "My Corner" posts. Photos live in Firestore itself (as compressed JPEG data URLs,
// one doc per photo) rather than Firebase Storage, because Storage needs the paid
// Blaze plan on new projects. One doc per photo keeps each doc under Firestore's
// 1 MiB limit no matter how many photos a post has.
const POSTS = 'posts';
const IMAGES = 'postImages';

export interface PostDoc {
  title: string;
  body: string;
  imageIds: string[];
  createdAt: number; // ms since epoch - the date shown on the post
  order?: number; // display position set from the admin (lower first); missing = newest first
}

export type Post = PostDoc & { id: string };

export const formatPostDate = (ms: number) =>
  new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Posts follow the admin's manual order once it's been set; until then (or for posts without
// one) newest first. The admin keeps either every post ordered or none - see ensureOrdered.
export const comparePosts = (a: PostDoc, b: PostDoc) =>
  typeof a.order === 'number' && typeof b.order === 'number' ? a.order - b.order : b.createdAt - a.createdAt;

export async function fetchPosts(): Promise<Post[]> {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, POSTS), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as PostDoc) })).sort(comparePosts);
}

/** Saves the given sequence as the display order (positions 0, 10, 20, ...). */
export async function savePostOrder(posts: Post[]) {
  if (!db) throw new Error('Firebase is not configured yet.');
  const batch = writeBatch(db);
  posts.forEach((p, i) => batch.update(doc(db!, POSTS, p.id), { order: i * 10 }));
  await batch.commit();
}

// Photos are fetched lazily (feeds only need covers) and cached for the page's lifetime
const imageCache = new Map<string, Promise<string | null>>();

export function fetchImage(id: string): Promise<string | null> {
  let cached = imageCache.get(id);
  if (!cached) {
    cached = db
      ? getDoc(doc(db, IMAGES, id)).then((s) => (s.exists() ? (s.data().data as string) : null))
      : Promise.resolve(null);
    imageCache.set(id, cached);
  }
  return cached;
}

export const newImageId = (): string => {
  if (!db) throw new Error('Firebase is not configured yet.');
  return doc(collection(db, IMAGES)).id;
};

/**
 * Writes a post and its photo changes in one atomic batch.
 * `newImages` are photos added in this edit; `removedImageIds` were dropped from the post.
 */
export async function savePost(
  id: string | undefined,
  post: PostDoc,
  newImages: { id: string; data: string }[],
  removedImageIds: string[]
) {
  if (!db) throw new Error('Firebase is not configured yet.');
  const batch = writeBatch(db);
  newImages.forEach((img) => batch.set(doc(db!, IMAGES, img.id), { data: img.data }));
  removedImageIds.forEach((imgId) => batch.delete(doc(db!, IMAGES, imgId)));
  const ref = id ? doc(db, POSTS, id) : doc(collection(db, POSTS));
  batch.set(ref, post);
  await batch.commit();
  newImages.forEach((img) => imageCache.set(img.id, Promise.resolve(img.data)));
}

export async function deletePost(post: Post) {
  if (!db) throw new Error('Firebase is not configured yet.');
  const batch = writeBatch(db);
  post.imageIds.forEach((imgId) => batch.delete(doc(db!, IMAGES, imgId)));
  batch.delete(doc(db, POSTS, post.id));
  await batch.commit();
}
