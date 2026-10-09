import React from 'react';
import { formatPostDate, Post } from '../lib/posts';
import PostImage from './PostImage';

// One "My Corner" article as a single card for the homepage deck: the cover photo, with the
// date and title on a white fade at the bottom. Clicking opens the full article.
const CornerCard: React.FC<{ post: Post; onOpen: () => void }> = ({ post, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group relative block w-full aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-neutral-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-gradient-to-br from-neutral-900 to-teal-900 text-left"
  >
    {post.imageIds.length > 0 && (
      <PostImage
        id={post.imageIds[0]}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    )}
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/85 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 px-5 sm:px-6 pb-5 sm:pb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">{formatPostDate(post.createdAt)}</p>
      <h3 className="mt-1 text-lg sm:text-xl font-bold text-neutral-900 leading-tight line-clamp-2">{post.title}</h3>
    </div>
  </button>
);

export default CornerCard;
