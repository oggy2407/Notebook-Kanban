import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import useLocalStorage from './hooks/useLocalStorage.js';
import { COLUMNS, FONTS, blankTask, moveTask, newBoard, seed } from './utils/data.js';
import FlipPage from './components/FlipPage.jsx';
import BoardTabs from './components/BoardTabs.jsx';
import Toolbar from './components/Toolbar.jsx';
import Column from './components/Column.jsx';
import TaskModal from './components/TaskModal.jsx';

const mapCols = (cols, fn) => Object.fromEntries(Object.entries(cols).map(([k, list]) => [k, fn(list)]));

export default function App() {
  const [data, setData] = useLocalStorage('nb-data', seed);
  // First visit follows the OS setting; after that the saved choice wins.
  const [theme, setTheme] = useLocalStorage('nb-theme', () =>
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [font, setFont] = useLocalStorage('nb-font', FONTS[0].css);
  const [filters, setFilters] = useState({ q: '', priority: 'all' });
  const [editing, setEditing] = useState(null); // { task, col, isNew }
  const [ready, setReady] = useState(false);

  useEffect(() => { const id = setTimeout(() => setReady(true), 700); return () => clearTimeout(id); }, []);
  useEffect(() => { document.documentElement.style.setProperty('--hand', font); }, [font]);

  const board = data.boards.find((b) => b.id === data.activeId) || data.boards[0];
  // All edits go through patch(): "change the active board's columns".
  const patch = (fn) => setData((d) => ({
    ...d, boards: d.boards.map((b) => (b.id === board.id ? { ...b, columns: fn(b.columns) } : b)),
  }));

  const saveTask = (t, col) => {
    patch((c) => Object.values(c).flat().some((x) => x.id === t.id)
      ? mapCols(c, (l) => l.map((x) => (x.id === t.id ? t : x)))
      : { ...c, [col]: [t, ...c[col]] });
    setEditing(null);
  };
  const deleteTask = (id) => patch((c) => mapCols(c, (l) => l.filter((x) => x.id !== id)));
  // Drag end: ignore drops outside any column, otherwise reorder via the pure moveTask().
  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    patch((c) => moveTask(c, { col: source.droppableId, index: source.index }, { col: destination.droppableId, index: destination.index }));
  };
  const addBoard = () => {
    const name = prompt('Name this page (e.g. Study)')?.trim();
    if (!name) return;
    const b = newBoard(name);
    setData((d) => ({ boards: [...d.boards, b], activeId: b.id }));
  };
  const deleteBoard = () => {
    if (!confirm(`Tear out "${board.name}" and all its notes?`)) return;
    setData((d) => { const boards = d.boards.filter((b) => b.id !== board.id); return { boards, activeId: boards[0].id }; });
  };

  const filtering = filters.q.trim() !== '' || filters.priority !== 'all';
  const visible = (list) => list.filter((t) =>
    (filters.priority === 'all' || t.priority === filters.priority) &&
    (`${t.title} ${t.note}`.toLowerCase().includes(filters.q.trim().toLowerCase())));

  if (!ready) return <div className="desk"><p className="loading">✎ Opening your notebook…</p></div>;

  return (
    <div className="desk">
      <div className="notebook">
        <div className="rings" aria-hidden="true" />
        <FlipPage pageKey={board.id} theme={theme} label={board.name}>
          <header className="head">
            <h1>{board.name}</h1>
            <BoardTabs boards={data.boards} activeId={board.id} onAdd={addBoard} onDelete={deleteBoard}
              onSelect={(id) => setData((d) => ({ ...d, activeId: id }))} />
          </header>
          <Toolbar filters={filters} setFilters={setFilters} font={font} setFont={setFont} theme={theme}
            onTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
          <DragDropContext onDragEnd={onDragEnd}>
            {/* key={board.id} remounts columns per board so "cleared" state never leaks across pages */}
            <main className="cols" key={board.id}>
              {COLUMNS.map((col) => (
                <Column key={col.id} col={col} tasks={visible(board.columns[col.id])} total={board.columns[col.id].length}
                  locked={filtering} onDelete={deleteTask}
                  onAdd={(c) => setEditing({ task: blankTask(), col: c, isNew: true })}
                  onEdit={(t) => setEditing({ task: t, col: col.id })} />
              ))}
            </main>
          </DragDropContext>
        </FlipPage>
      </div>
      {/* Outside the 3D stage on purpose: perspective would trap position:fixed elements. */}
      <button className="fab" aria-label="Add a note" onClick={() => setEditing({ task: blankTask(), col: 'todo', isNew: true })}>+</button>
      {editing && <TaskModal task={editing.task} theme={theme} isNew={editing.isNew}
        onSave={(t) => saveTask(t, editing.col)} onClose={() => setEditing(null)} />}
    </div>
  );
}
