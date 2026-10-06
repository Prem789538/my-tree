import { useState, useEffect, useRef } from 'react'
import TreeNode from './components/TreeNode'
import Modal from './components/Modal'

const STORAGE_KEY = 'my-tree-data'
const SELECTED_KEY = 'my-tree-selected'

const ROOT_NODE = {
  id: 'root',
  text: 'Root',
  children: [],
}

function addChildToNode(node, parentId, newChild) {
  if (node.id === parentId) {
    return { ...node, children: [...node.children, newChild] }
  }
  return {
    ...node,
    children: node.children.map((child) => addChildToNode(child, parentId, newChild)),
  }
}

function findNodeById(node, id) {
  if (node.id === id) return node
  for (const child of node.children) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

function isValidNode(node) {
  return (
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    typeof node.text === 'string' &&
    Array.isArray(node.children) &&
    node.children.every(isValidNode)
  )
}

function countNodes(node) {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
}

function loadTree() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : ROOT_NODE
  } catch {
    return ROOT_NODE
  }
}

function loadSelectedIds() {
  try {
    const saved = localStorage.getItem(SELECTED_KEY)
    return saved ? new Set(JSON.parse(saved)) : new Set()
  } catch {
    return new Set()
  }
}

export default function App() {
  const [tree, setTree] = useState(loadTree)
  const [modal, setModal] = useState({ open: false, parentId: null })
  const [inputText, setInputText] = useState('')
  const [descriptionText, setDescriptionText] = useState('')
  const [activeNodeId, setActiveNodeId] = useState('root')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(loadSelectedIds)
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
  }, [tree])

  useEffect(() => {
    localStorage.setItem(SELECTED_KEY, JSON.stringify([...selectedIds]))
  }, [selectedIds])

  const handleNodeClick = (nodeId) => {
    setActiveNodeId(nodeId)
    if (selectMode) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId)
        return next
      })
    } else {
      setInputText('')
      setDescriptionText('')
      setModal({ open: true, parentId: nodeId })
    }
  }

  const closeModal = () => {
    setModal({ open: false, parentId: null })
    setInputText('')
    setDescriptionText('')
  }

  const handleSubmit = () => {
    const text = inputText.trim()
    const description = descriptionText.trim()
    if (!text) return

    const newNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      description,
      children: [],
    }

    setTree((prev) => addChildToNode(prev, modal.parentId, newNode))
    closeModal()
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(tree, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    const a = document.createElement('a')
    a.href = url
    a.download = `my-tree-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-importing the same file
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      let parsed
      try {
        parsed = JSON.parse(reader.result)
      } catch {
        window.alert('Import failed: file is not valid JSON.')
        return
      }
      if (!isValidNode(parsed)) {
        window.alert('Import failed: JSON is not a valid tree (expected id, text, children).')
        return
      }
      const incoming = countNodes(parsed)
      const current = countNodes(tree)
      if (
        current > 1 &&
        !window.confirm(`Replace the current tree (${current} nodes) with the imported one (${incoming} nodes)?`)
      ) {
        return
      }
      setTree(parsed)
      setSelectedIds(new Set())
      setActiveNodeId(parsed.id)
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (window.confirm('Reset the entire tree? This cannot be undone.')) {
      setTree(ROOT_NODE)
      setSelectedIds(new Set())
      setActiveNodeId('root')
    }
  }

  const activeNode = findNodeById(tree, activeNodeId) || tree

  return (
    <div className="relative z-10 h-full bg-surface-dark flex flex-col font-mono">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,255,65,0.2)] bg-[rgba(1,4,9,0.82)] backdrop-blur-md">
        <h1 className="text-neon-green font-bold text-lg tracking-tight glow-text-subtle flex items-center gap-2">
          <span className="text-neon-green opacity-60">{'>'}</span>
          My Tree
          <span className="cursor-blink" />
        </h1>

        {/* Select mode toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors ${selectMode ? 'text-neon-purple' : 'text-neon-cyan opacity-70'}`}>
            {selectMode ? 'Select Mode' : 'Edit Mode'}
          </span>
          <button
            role="switch"
            aria-checked={selectMode}
            onClick={() => setSelectMode((v) => !v)}
            className={`
              relative w-11 h-6 rounded-full transition-all duration-200 cursor-pointer outline-none border
              focus-visible:ring-2 focus-visible:ring-neon-purple
              ${selectMode
                ? 'bg-[rgba(191,0,255,0.25)] border-neon-purple shadow-[0_0_12px_rgba(191,0,255,0.45)]'
                : 'bg-[rgba(0,255,65,0.08)] border-[rgba(0,255,65,0.3)]'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow
                transition-transform duration-200
                ${selectMode ? 'translate-x-5 bg-neon-purple' : 'translate-x-0 bg-neon-green'}
              `}
            />
          </button>
          {selectedIds.size > 0 && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-neon-purple font-semibold">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={handleExport}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neon-green opacity-60 border border-[rgba(0,255,65,0.3)] rounded px-3 py-1.5 hover:opacity-100 hover:border-neon-green hover:shadow-[0_0_12px_rgba(0,255,65,0.4)] transition-all cursor-pointer"
          >
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neon-green opacity-60 border border-[rgba(0,255,65,0.3)] rounded px-3 py-1.5 hover:opacity-100 hover:border-neon-green hover:shadow-[0_0_12px_rgba(0,255,65,0.4)] transition-all cursor-pointer"
          >
            Import
          </button>
          <button
            onClick={handleReset}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neon-green opacity-60 border border-[rgba(0,255,65,0.3)] rounded px-3 py-1.5 hover:opacity-100 hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_12px_rgba(248,113,113,0.4)] transition-all cursor-pointer"
          >
            Reset Tree
          </button>
        </div>
      </header>

      {/* Hint */}
      <p className="text-center text-neon-green opacity-50 text-[11px] tracking-wider pt-4">
        {selectMode
          ? '// click nodes to highlight them — click again to deselect'
          : '// click any node to add a child node'}
      </p>


      {/* Scrollable tree canvas */}
      <div className="flex-1 overflow-auto p-12">
        <div className="min-w-max flex justify-center">
          <TreeNode
            node={tree}
            onNodeClick={handleNodeClick}
            selectedIds={selectedIds}
            selectMode={selectMode}
            isRoot
          />
        </div>
      </div>

      {/* Add-child modal */}
      {modal.open && (
        <Modal
          inputText={inputText}
          descriptionText={descriptionText}
          onChange={setInputText}
          onDescriptionChange={setDescriptionText}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
