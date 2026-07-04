export default function TreeNode({ node, onNodeClick, selectedIds = new Set(), selectMode = false, isRoot = false }) {
  const hasChildren = node.children.length > 0
  const isSelected = selectedIds.has(node.id)

  const nodeStyle = (() => {
    if (isSelected) {
      return 'bg-[rgba(0,212,255,0.12)] hover:bg-[rgba(0,212,255,0.2)] text-neon-cyan border-neon-cyan shadow-[0_0_18px_rgba(0,212,255,0.5)]'
    }
    if (isRoot) {
      return 'bg-[rgba(191,0,255,0.1)] hover:bg-[rgba(191,0,255,0.18)] text-neon-purple border-neon-purple shadow-[0_0_18px_rgba(191,0,255,0.4)]'
    }
    return 'bg-gradient-to-br from-surface to-surface-light hover:from-surface-light hover:to-surface text-neon-green border-[rgba(0,255,65,0.4)] shadow-[0_0_14px_rgba(0,255,65,0.25)] hover:shadow-[0_0_22px_rgba(0,255,65,0.45)] hover:border-neon-green'
  })()

  const baseTitle = selectMode
    ? isSelected ? 'Click to deselect' : 'Click to select'
    : 'Click to add a child node'
  const title = node.description
    ? `${baseTitle}\n${node.description}`
    : baseTitle

  return (
    <div className="flex flex-col items-center">
      {/* Node box */}
      <div
        onClick={() => onNodeClick(node.id)}
        title={title}
        className={`
          cursor-pointer select-none inline-block max-w-[16rem] px-4 py-3 rounded-lg border font-mono
          text-left break-words
          transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]
          ${nodeStyle}
        `}
      >
        <div className="font-semibold text-sm leading-tight">
          {node.text}
        </div>
        {node.description && (
          <div className="text-xs leading-snug opacity-80 mt-1">
            {node.description}
          </div>
        )}
      </div>

      {hasChildren && (
        <>
          {/* Vertical line from node down to horizontal connector */}
          <div className="w-0.5 h-8 bg-[rgba(0,255,65,0.35)]" />

          {/* Children row */}
          <div className="flex">
            {node.children.map((child, i) => (
              <div
                key={child.id}
                className="flex flex-col items-center relative px-6"
              >
                {/* Left half of horizontal connector (not on first child) */}
                {i > 0 && (
                  <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[rgba(0,255,65,0.35)]" />
                )}
                {/* Right half of horizontal connector (not on last child) */}
                {i < node.children.length - 1 && (
                  <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-[rgba(0,255,65,0.35)]" />
                )}

                {/* Vertical line from horizontal connector down to child node */}
                <div className="w-0.5 h-8 bg-[rgba(0,255,65,0.35)]" />

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
