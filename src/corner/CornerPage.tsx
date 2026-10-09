import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaClone, FaTimes } from 'react-icons/fa';
import { fetchPosts, formatPostDate, Post } from '../lib/posts';
import PostImage from './PostImage';

export const PostModal: React.FC<{ post: Post; onClose: () => void }> = ({ post, onClose }) => {
  const [index, setIndex] = useState(0);
  const count = post.imageIds.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (count > 1 && e.key === 'ArrowRight') go(1);
      if (count > 1 && e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
    >
      <motion.article
        initial={{ scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col ${
          count > 0 ? 'md:flex-row max-w-5xl' : 'max-w-2xl'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-200"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {count > 0 && (
          <div
            className={`relative overflow-hidden bg-neutral-900 flex-shrink-0 flex items-center justify-center aspect-square md:aspect-auto md:min-h-[70vh] ${
              post.body ? 'md:w-[58%]' : 'md:w-full'
            }`}
          >
            {/* Blurred copy fills the letterbox around photos that don't match the frame's shape */}
            <PostImage
              key={`bg-${post.imageIds[index]}`}
              id={post.imageIds[index]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-70"
            />
            <PostImage
              key={post.imageIds[index]}
              id={post.imageIds[index]}
              alt={`${post.title} - photo ${index + 1}`}
              className="w-full h-full object-contain absolute inset-0"
            />
            {/* White fade at the bottom carrying the post's date and title */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 px-6 sm:px-8 pb-6 sm:pb-7 pointer-events-none">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">{formatPostDate(post.createdAt)}</p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">{post.title}</h2>
            </div>
            {count > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-black flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-black flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-4 inset-x-0 flex justify-center gap-1.5">
                  {post.imageIds.map((id, i) => (
                    <button
                      key={id}
                      onClick={() => setIndex(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* With photos, the date and title sit on the photo, so this panel is just the writing */}
        {(count === 0 || post.body) && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {count === 0 && (
              <>
                <p className="text-xs font-medium uppercase tracking-widest text-teal-600 mb-2">
                  {formatPostDate(post.createdAt)}
                </p>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4 pr-8">{post.title}</h2>
              </>
            )}
            {post.body && (
              <p className={`text-neutral-700 leading-relaxed whitespace-pre-wrap break-words ${count > 0 ? 'md:pt-10' : ''}`}>
                {post.body}
              </p>
            )}
          </div>
        )}
      </motion.article>
    </motion.div>
  );
};

const PostTile: React.FC<{ post: Post; onOpen: () => void; delay: number }> = ({ post, onOpen, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    onClick={onOpen}
    className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 text-left"
  >
    {post.imageIds.length > 0 ? (
      <PostImage
        id={post.imageIds[0]}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      // Text-only posts get a typographic tile instead of a photo
      <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-teal-900 p-5 flex flex-col justify-end">
        <p className="text-white font-bold text-lg leading-snug line-clamp-3">{post.title}</p>
        <p className="text-white/60 text-xs mt-2 line-clamp-2">{post.body}</p>
      </div>
    )}
    {post.imageIds.length > 1 && (
      <FaClone className="absolute top-3 right-3 w-4 h-4 text-white drop-shadow" aria-label="Multiple photos" />
    )}
    {post.imageIds.length > 0 && (
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white font-semibold leading-snug line-clamp-2">{post.title}</p>
        <p className="text-white/70 text-xs mt-1">{formatPostDate(post.createdAt)}</p>
      </div>
    )}
  </motion.button>
);

const CornerPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPost, setOpenPost] = useState<Post | null>(null);

  useEffect(() => {
    document.title = 'My Corner | Lalit Shirsath';
    fetchPosts()
      .then(setPosts)
      .catch(() => setError("Couldn't load posts right now. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <header className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft className="w-3 h-3" /> Back to portfolio
          </a>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <p className="text-xs font-medium uppercase tracking-widest text-teal-400 mb-3">Lalit Shirsath</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">My Corner</h1>
            <p className="text-white/60 mt-3 max-w-xl">
              Moments, photos and thoughts from life outside the dashboards.
            </p>
            {!loading && posts.length > 0 && (
              <p className="text-white/40 text-sm mt-6">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            )}
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-neutral-500 py-20">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-neutral-500 py-20">Nothing here yet - check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {posts.map((p, i) => (
              <PostTile key={p.id} post={p} onOpen={() => setOpenPost(p)} delay={(i % 3) * 0.06} />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>{openPost && <PostModal post={openPost} onClose={() => setOpenPost(null)} />}</AnimatePresence>
    </div>
  );
};

export default CornerPage;
