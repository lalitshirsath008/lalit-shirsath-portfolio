import React, { useEffect, useRef, useState } from 'react';
import { deletePost, fetchImage, fetchPosts, formatPostDate, newImageId, Post, PostDoc, savePost, savePostOrder } from '../lib/posts';
import ImageCropper, { PHOTO_CROP } from './ImageCropper';
import PostImage from '../corner/PostImage';
import { Field, TextAreaInput, TextInput } from './fields';

interface DraftImage {
  id: string;
  data?: string; // only set for photos added in this edit (not yet saved)
}

// A photo waiting in the crop editor: a new upload, or an existing photo being re-cropped
interface CropJob {
  src: string;
  replaceIndex?: number;
}

interface Draft {
  id?: string;
  title: string;
  body: string;
  date: string; // yyyy-mm-dd, from the date input
  originalCreatedAt?: number;
  originalOrder?: number; // kept as-is when editing, so editing doesn't move the post
  images: DraftImage[];
  originalImageIds: string[];
}

const toDateInput = (ms: number) => {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Keep the exact original timestamp unless the date was changed, so posts made the
// same day keep their order; a changed date lands at midday of that day.
const toCreatedAt = (draft: Draft) => {
  if (draft.originalCreatedAt !== undefined && toDateInput(draft.originalCreatedAt) === draft.date) {
    return draft.originalCreatedAt;
  }
  if (draft.originalCreatedAt === undefined && draft.date === toDateInput(Date.now())) return Date.now();
  return new Date(`${draft.date}T12:00:00`).getTime();
};

const smallButton =
  'w-7 h-7 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black transition-colors duration-200 disabled:opacity-30';

const CornerPanel: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [cropQueue, setCropQueue] = useState<CropJob[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await fetchPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startAdd = () => {
    setError('');
    setDraft({ title: '', body: '', date: toDateInput(Date.now()), images: [], originalImageIds: [] });
  };

  const startEdit = (p: Post) => {
    setError('');
    setDraft({
      id: p.id,
      title: p.title,
      body: p.body,
      date: toDateInput(p.createdAt),
      originalCreatedAt: p.createdAt,
      originalOrder: p.order,
      images: p.imageIds.map((id) => ({ id })),
      originalImageIds: p.imageIds,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const update = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  // Selected files go through the crop editor one at a time
  const addPhotos = (fileList: FileList | null) => {
    // Copy the files out first: the input's FileList is live, and clearing the input
    // (so the same photo can be picked again later) empties it
    const files = Array.from(fileList ?? []);
    if (fileRef.current) fileRef.current.value = '';
    if (files.length === 0) return;
    const images = files.filter((f) => f.type.startsWith('image/'));
    const skipped = files.length - images.length;
    setError(skipped ? `${skipped} file${skipped === 1 ? " wasn't an image" : "s weren't images"} and ${skipped === 1 ? 'was' : 'were'} skipped.` : '');
    setCropQueue((q) => [...q, ...images.map((f) => ({ src: URL.createObjectURL(f) }))]);
  };

  const recropPhoto = async (i: number) => {
    if (!draft) return;
    const img = draft.images[i];
    const src = img.data ?? (await fetchImage(img.id));
    if (src) setCropQueue((q) => [...q, { src, replaceIndex: i }]);
  };

  const finishCropJob = (data?: string) => {
    const job = cropQueue[0];
    if (!job) return;
    if (data) {
      // A re-cropped photo gets a fresh id, so the old stored photo is deleted on save
      const next: DraftImage = { id: newImageId(), data };
      setDraft((d) => {
        if (!d) return d;
        if (job.replaceIndex === undefined) return { ...d, images: [...d.images, next] };
        const images = [...d.images];
        images[job.replaceIndex] = next;
        return { ...d, images };
      });
    }
    if (job.src.startsWith('blob:')) URL.revokeObjectURL(job.src);
    setCropQueue((q) => q.slice(1));
  };

  const moveImage = (i: number, step: -1 | 1) => {
    if (!draft) return;
    const next = [...draft.images];
    [next[i], next[i + step]] = [next[i + step], next[i]];
    update({ images: next });
  };

  const removeImage = (i: number) => {
    if (!draft) return;
    update({ images: draft.images.filter((_, idx) => idx !== i) });
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError('Give the post a title.');
      return;
    }
    if (draft.images.length === 0 && !draft.body.trim()) {
      setError('Add at least one photo or write something.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const keptIds = new Set(draft.images.map((img) => img.id));
      const doc: PostDoc = {
        title: draft.title.trim(),
        body: draft.body.trim(),
        imageIds: draft.images.map((img) => img.id),
        createdAt: toCreatedAt(draft),
      };
      if (draft.id) {
        if (typeof draft.originalOrder === 'number') doc.order = draft.originalOrder;
      } else if (posts.some((p) => typeof p.order === 'number')) {
        // Manual order is in use: a new post goes to the top
        doc.order = Math.min(...posts.map((p) => p.order ?? 0)) - 10;
      }
      await savePost(
        draft.id,
        doc,
        draft.images.filter((img) => img.data).map((img) => ({ id: img.id, data: img.data! })),
        draft.originalImageIds.filter((id) => !keptIds.has(id))
      );
      setDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Saving failed.');
    } finally {
      setSaving(false);
    }
  };

  // Move a post up/down in the display order. The first move turns the current (newest-first)
  // order into an explicit one for every post.
  const move = async (index: number, step: -1 | 1) => {
    const next = [...posts];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    setPosts(next.map((p, i) => ({ ...p, order: i * 10 })));
    try {
      await savePostOrder(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the new order.');
      await load();
    }
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Delete "${p.title}" and its photos? This cannot be undone.`)) return;
    try {
      await deletePost(p);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
        <h3 className="text-xl font-bold text-white">My Corner</h3>
        {!draft && (
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/85 transition-colors duration-200"
          >
            + New post
          </button>
        )}
      </div>
      <p className="text-white/50 text-sm mb-6">
        Photos and writing shown on{' '}
        <a href="/corner" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
          /corner
        </a>
        , in the order below - use ↑ ↓ to rearrange.
      </p>

      {draft && (
        <div className="mb-8 p-6 rounded-2xl bg-white/[0.03] border border-white/15">
          <Field label="Title">
            <TextInput value={draft.title} onChange={(v) => update({ title: v })} placeholder="e.g. Sunday trek to Harihar" />
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={draft.date}
              onChange={(e) => e.target.value && update({ date: e.target.value })}
              className="block rounded-lg bg-white/[0.03] border border-white/15 px-3 py-2 text-white focus:border-white/50 focus:outline-none [color-scheme:dark]"
            />
          </Field>

          <Field label={`Photos (${draft.images.length})`}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {draft.images.map((img, i) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/15">
                  {img.data ? (
                    <img src={img.data} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <PostImage id={img.id} alt="" className="w-full h-full object-cover" />
                  )}
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-teal-400 text-black text-[10px] font-bold">
                      COVER
                    </span>
                  )}
                  <div className="absolute bottom-1.5 inset-x-1.5 flex justify-between">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => recropPhoto(i)} className={smallButton} aria-label="Adjust crop" title="Adjust crop">
                        ⤢
                      </button>
                      <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className={smallButton} aria-label="Move left">
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === draft.images.length - 1}
                        className={smallButton}
                        aria-label="Move right"
                      >
                        →
                      </button>
                    </div>
                    <button type="button" onClick={() => removeImage(i)} className={`${smallButton} hover:bg-red-600`} aria-label="Remove photo">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors duration-200 flex flex-col items-center justify-center gap-1 text-xs disabled:opacity-50"
              >
                <span className="text-2xl leading-none">+</span>
                Add photos
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => addPhotos(e.target.files)}
            />
            <p className="text-white/35 text-xs mt-2">First photo is the cover. Each photo opens in the crop editor; ⤢ re-crops one.</p>
            {cropQueue[0] && (
              <ImageCropper
                key={cropQueue[0].src}
                src={cropQueue[0].src}
                config={{
                  ...PHOTO_CROP,
                  title: cropQueue.length > 1 ? `Adjust photo · ${cropQueue.length} to go` : PHOTO_CROP.title,
                }}
                onCancel={() => finishCropJob()}
                onSave={(data) => finishCropJob(data)}
              />
            )}
          </Field>

          <Field label="Write">
            <TextAreaInput value={draft.body} onChange={(v) => update({ body: v })} rows={10} />
          </Field>

          {error && <p className="mt-3 text-red-400 text-sm font-medium">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              disabled={saving || cropQueue.length > 0}
              className="px-5 py-2 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/85 transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? 'Publishing...' : draft.id ? 'Save changes' : 'Publish'}
            </button>
            <button
              onClick={() => {
                setDraft(null);
                setError('');
              }}
              className="px-5 py-2 text-white/70 font-medium text-sm rounded-full border border-white/15 hover:text-white hover:border-white/40 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!draft && error && <p className="mb-4 text-red-400 text-sm font-medium">{error}</p>}

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-white/50">No posts yet. Click "+ New post" to share your first one.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p, index) => (
            <div key={p.id} className="p-3 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="w-7 h-7 rounded-lg border border-white/15 text-white/70 text-xs disabled:opacity-30 hover:text-white hover:border-white/40 transition-colors duration-200"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === posts.length - 1}
                  aria-label="Move down"
                  className="w-7 h-7 rounded-lg border border-white/15 text-white/70 text-xs disabled:opacity-30 hover:text-white hover:border-white/40 transition-colors duration-200"
                >
                  ↓
                </button>
              </div>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                {p.imageIds[0] ? (
                  <PostImage id={p.imageIds[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/30 text-xs">Text</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{p.title}</p>
                <p className="text-white/45 text-xs mt-0.5">
                  {formatPostDate(p.createdAt)} · {p.imageIds.length} {p.imageIds.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="px-3 py-1 rounded-lg border border-white/20 text-white/80 text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p)}
                  className="px-3 py-1 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/60 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CornerPanel;
