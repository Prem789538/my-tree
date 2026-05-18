export default function TreeNode({ node, onNodeClick, selectedIds = new Set(), selectMode = false, isRoot = false }) {
  const hasChildren = node.children.length > 0
  const isSelected = selectedIds.has(node.id)

  const nodeStyle = (() => {
    if (isSelected) {
      return 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-amber-500/50 ring-2 ring-amber-300/60'
    }
    if (isRoot) {
      return 'bg-violet-600 hover:bg-violet-500 shadow-violet-900/60 text-white ring-2 ring-violet-400/30'
    }
    return 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50 text-white'
  })()

  const title = selectMode
    ? isSelected ? 'Click to deselect' : 'Click to select'
    : 'Click to add a child node'

  return (
    <div className="flex flex-col items-center">
      {/* Node box */}
      <div
        onClick={() => onNodeClick(node.id)}
        title={title}
        className={`
          cursor-pointer select-none px-5 py-2.5 rounded-full shadow-lg
          font-medium text-sm whitespace-nowrap
          transition-all duration-150 hover:scale-105 active:scale-95
          ${nodeStyle}
        `}
      >
        {node.text}
      </div>

      {hasChildren && (
        <>
          {/* Vertical line from node down to horizontal connector */}
          <div className="w-0.5 h-8 bg-slate-600" />

          {/* Children row */}
          <div className="flex">
            {node.children.map((child, i) => (
              <div
                key={child.id}
                className="flex flex-col items-center relative px-6"
              >
                {/* Left half of horizontal connector (not on first child) */}
                {i > 0 && (
                  <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-slate-600" />
                )}
                {/* Right half of horizontal connector (not on last child) */}
                {i < node.children.length - 1 && (
                  <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-slate-600" />
                )}

                {/* Vertical line from horizontal connector down to child node */}
                <div className="w-0.5 h-8 bg-slate-600" />

                {/* Recursive child */}
                <TreeNode
                  node={child}
                  onNodeClick={onNodeClick}
                  selectedIds={selectedIds}
                  selectMode={selectMode}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
