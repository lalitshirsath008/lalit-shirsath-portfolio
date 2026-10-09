import React, { useEffect, useState } from 'react';
import { fetchImage } from '../lib/posts';

// Loads one stored photo by id (photos aren't embedded in the post doc - see lib/posts.ts)
const PostImage: React.FC<{ id: string; alt: string; className?: string }> = ({ id, alt, className = '' }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    fetchImage(id).then((data) => {
      if (alive) setSrc(data);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (!src) return <div className={`${className} bg-neutral-200 animate-pulse`} aria-label={alt} />;
  return <img src={src} alt={alt} className={className} loading="lazy" />;
};

export default PostImage;
