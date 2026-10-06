import React, { useEffect, useState } from 'react';
import { CollectionName, fetchAll, addItem, updateItem, deleteItem } from '../lib/content';

interface WithOrder {
  id?: string;
  order: number;
}

interface CollectionPanelProps<T extends WithOrder> {
  name: CollectionName;
  title: string;
  makeBlank: () => T;
  renderForm: (draft: T, setDraft: (updater: (prev: T) => T) => void) => React.ReactNode;
  renderSummary: (item: T & { id: string }) => React.ReactNode;
}

function CollectionPanel<T extends WithOrder>({
  name,
  title,
  makeBlank,
  renderForm,
  renderSummary,
}: CollectionPanelProps<T>) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await fetchAll<T>(name);
    setItems(data.sort((a, b) => a.order - b.order));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const startAdd = () => {
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order), 0);
    setDraft({ ...makeBlank(), order: maxOrder + 10 });
  };

  const startEdit = (item: T & { id: string }) => setDraft({ ...item });
  const cancel = () => {
    setDraft(null);
    setError('');
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError('');
    try {
      const { id, ...rest } = draft as T & { id?: string };
      if (id) {
        await updateItem<T>(name, id, rest as Partial<T>);
      } else {
        await addItem<T>(name, rest as T);
      }
      setDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    await deleteItem(name, id);
    await load();
  };

  const move = async (item: T & { id: string }, direction: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const other = items[swapIdx];
    await updateItem(name, item.id, { order: other.order } as Partial<T>);
    await updateItem(name, other.id, { order: item.order } as Partial<T>);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h3 className="font-display uppercase text-xl text-bauhaus-cream">{title}</h3>
        {!draft && (
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-bauhaus-yellow text-black font-bold uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#F2ECDE] hover:shadow-[0px_0px_0_0_#F2ECDE] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150"
          >
            + Add new
          </button>
        )}
      </div>

      {draft && (
        <div className="mb-8 p-6 bg-black border-4 border-bauhaus-blue">
          {renderForm(draft, (updater) => setDraft((prev) => (prev ? updater(prev) : prev)))}
          {error && <p className="mt-3 text-bauhaus-red text-sm font-semibold">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 bg-bauhaus-blue text-black font-bold uppercase text-sm border-2 border-black disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancel}
              className="px-5 py-2 bg-black text-bauhaus-cream font-bold uppercase text-sm border-2 border-bauhaus-cream"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-bauhaus-cream/60">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-bauhaus-cream/60">No items yet. Add one above, or seed starter content from the Overview tab.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 border-2 border-bauhaus-cream/30 flex items-start justify-between gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-[200px]">{renderSummary(item)}</div>
              <div className="flex flex-col gap-2 items-end flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => move(item, -1)}
                    disabled={idx === 0}
                    className="px-2 py-1 border border-bauhaus-cream/40 text-bauhaus-cream text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(item, 1)}
                    disabled={idx === items.length - 1}
                    className="px-2 py-1 border border-bauhaus-cream/40 text-bauhaus-cream text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="px-3 py-1 border-2 border-bauhaus-yellow text-bauhaus-yellow text-xs font-bold uppercase hover:bg-bauhaus-yellow hover:text-black transition-colors duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="px-3 py-1 border-2 border-bauhaus-red text-bauhaus-red text-xs font-bold uppercase hover:bg-bauhaus-red hover:text-black transition-colors duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionPanel;
