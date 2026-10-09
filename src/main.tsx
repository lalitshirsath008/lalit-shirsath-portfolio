import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CornerPage from './corner/CornerPage'
// Self-hosted fonts: Poppins (Latin only) and Great Vibes come from src/fonts.css (preloaded in
// index.html); Devanagari (Marathi/Hindi) falls through to Mukta - see the font stack in tailwind.config.js
import './fonts.css'
import '@fontsource/mukta/devanagari-400.css'
import '@fontsource/mukta/devanagari-500.css'
import '@fontsource/mukta/devanagari-600.css'
import '@fontsource/mukta/devanagari-700.css'
import './index.css'

// The admin panel is only for Lalit, so it's split out of the public bundle (faster first load)
const AdminApp = lazy(() => import('./admin/AdminApp'))

const SITE = 'https://lalit-shirsath-portfolio-008.vercel.app'
const path = window.location.pathname.replace(/\/+$/, '')

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/) ?? []
    if (key && name) el.setAttribute(key, name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

// Per-route SEO: the homepage tags live in index.html; adjust them for the other routes
if (path === '/admin') {
  setMeta('meta[name="robots"]', 'content', 'noindex, nofollow')
} else if (path === '/corner') {
  setMeta('link[rel="canonical"]', 'href', `${SITE}/corner`)
  setMeta('meta[property="og:url"]', 'content', `${SITE}/corner`)
  setMeta('meta[name="description"]', 'content', "My Corner – photos, moments and writing from Lalit Shirsath's life outside work.")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {path === '/admin' ? (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <AdminApp />
      </Suspense>
    ) : path === '/corner' ? (
      <CornerPage />
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
