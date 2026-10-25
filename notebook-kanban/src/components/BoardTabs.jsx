export default function BoardTabs({ boards, activeId, onSelect, onAdd, onDelete }) {
  return (
    <nav className="tabs" aria-label="Notebook pages">
      {boards.map((b) => (
        <button key={b.id} className="tab" aria-current={b.id === activeId ? 'page' : undefined} onClick={() => onSelect(b.id)}>
          {b.name}
        </button>
      ))}
      <button className="tab ghost" onClick={onAdd} aria-label="Add a new page">+ page</button>
      {boards.length > 1 && (
        <button className="tab ghost" onClick={onDelete} aria-label="Tear out this page">tear out</button>
      )}
    </nav>
  );
}
