import { useState, useEffect } from 'react'
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
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(loadSelectedIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
  }, [tree])

  useEffect(() => {
    localStorage.setItem(SELECTED_KEY, JSON.stringify([...selectedIds]))
  }, [selectedIds])

  const handleNodeClick = (nodeId) => {
    if (selectMode) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId)
        return next
      })
    } else {
      setInputText('')
      setModal({ open: true, parentId: nodeId })
    }
  }

  const closeModal = () => {
    setModal({ open: false, parentId: null })
    setInputText('')
  }

  const handleSubmit = () => {
    const text = inputText.trim()
    if (!text) return

    const newNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      children: [],
    }

    setTree((prev) => addChildToNode(prev, modal.parentId, newNode))
    closeModal()
  }

  const handleReset = () => {
    if (window.confirm('Reset the entire tree? This cannot be undone.')) {
      setTree(ROOT_NODE)
      setSelectedIds(new Set())
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h1 className="text-slate-100 font-semibold text-lg tracking-tight">
          My Tree
        </h1>

        {/* Select mode toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium transition-colors ${selectMode ? 'text-amber-400' : 'text-slate-500'}`}>
            {selectMode ? 'Select Mode' : 'Edit Mode'}
          </span>
          <button
            role="switch"
            aria-checked={selectMode}
            onClick={() => setSelectMode((v) => !v)}
            className={`
              relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer outline-none
              focus-visible:ring-2 focus-visible:ring-amber-400
              ${selectMode ? 'bg-amber-500' : 'bg-slate-600'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                transition-transform duration-200
                ${selectMode ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          {selectedIds.size > 0 && (
            <span className="text-xs text-amber-400 font-medium">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          Reset Tree
        </button>
      </header>

      {/* Hint */}
      <p className="text-center text-slate-600 text-xs pt-4">
        {selectMode
          ? 'Click nodes to highlight them — click again to deselect'
          : 'Click any node to add a child node'}
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
          onChange={setInputText}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
