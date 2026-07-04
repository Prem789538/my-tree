import { useEffect, useRef } from 'react'

export default function Modal({ inputText, descriptionText, onChange, onDescriptionChange, onSubmit, onClose }) {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-surface to-surface-light border border-[rgba(0,255,65,0.3)] rounded-lg shadow-[0_0_40px_rgba(0,255,65,0.2),0_0_80px_rgba(0,255,65,0.1)] p-6 w-80 animate-in font-mono">
        <h2 className="text-neon-green text-base font-bold mb-1 glow-text-subtle flex items-center gap-2">
          <span className="opacity-60">{'>'}</span> Add Child Node
        </h2>
        <p className="text-neon-cyan opacity-70 text-[11px] tracking-wider mb-4">// enter a label for the new node</p>

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Node label..."
          className="w-full bg-[rgba(13,17,23,0.8)] text-neon-green placeholder-[rgba(0,255,65,0.35)] border border-[rgba(0,255,65,0.25)] rounded px-4 py-2.5 text-sm outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all"
        />

        <textarea
          value={descriptionText}
          onChange={(e) => onDescriptionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Optional description..."
          rows={3}
          className="mt-3 w-full bg-[rgba(13,17,23,0.8)] text-neon-green placeholder-[rgba(0,255,65,0.35)] border border-[rgba(0,255,65,0.25)] rounded px-4 py-2.5 text-sm outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all resize-none"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-transparent border border-[rgba(0,255,65,0.25)] text-neon-green opacity-70 rounded text-xs uppercase tracking-[0.15em] hover:opacity-100 hover:border-[rgba(0,255,65,0.5)] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!inputText.trim()}
            className="flex-1 px-4 py-2 bg-[rgba(0,255,65,0.12)] border border-neon-green text-neon-green rounded text-xs uppercase tracking-[0.15em] font-semibold shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:bg-[rgba(0,255,65,0.2)] hover:shadow-[0_0_22px_rgba(0,255,65,0.5)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all cursor-pointer"
          >
            Add Node
          </button>
        </div>
      </div>
    </div>
  )
}
