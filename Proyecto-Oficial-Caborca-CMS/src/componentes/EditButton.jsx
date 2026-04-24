import React from 'react'

export default function EditButton({ section, onOpen, className = '', size = 'md', title = 'Editar' }) {
  const base = 'inline-flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  const sizes = size === 'sm' ? 'p-2 text-sm w-9 h-9' : 'p-3 text-base w-11 h-11';

  function handleClick(e) {
    if (typeof onOpen === 'function') return onOpen(e);
    const ev = new CustomEvent('cms:editor:open', { detail: { section } });
    window.dispatchEvent(ev);
  }

  return (
    <button
      aria-label={title}
      title={title}
      onClick={handleClick}
      className={`${base} ${sizes} bg-caborca-cafe text-white hover:bg-caborca-negro transition-transform transform hover:scale-105 ${className}`}
    >
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 21v-3.75L17.81 2.44a1.5 1.5 0 012.12 0l.63.63a1.5 1.5 0 010 2.12L6.75 20.0H3z" fill="currentColor" />
        <path d="M14.06 4.94l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
