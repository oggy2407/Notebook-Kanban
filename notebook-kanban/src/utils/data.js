export const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];
export const PRIORITIES = { high: 'High', med: 'Medium', low: 'Low' };
export const FONTS = [
  { name: 'Caveat', css: "'Caveat', cursive" },
  { name: 'Patrick Hand', css: "'Patrick Hand', cursive" },
  { name: 'Kalam', css: "'Kalam', cursive" },
  { name: 'Gloria Hallelujah', css: "'Gloria Hallelujah', cursive" },
];

export const uid = () => Math.random().toString(36).slice(2, 9);
export const blankTask = () => ({ id: uid(), title: '', note: '', priority: 'med', due: '' });
const task = (title, priority = 'med', note = '') => ({ ...blankTask(), title, priority, note });
const board = (name, todo = []) => ({ id: uid(), name, columns: { todo, doing: [], done: [] } });

export function seed() {
  const boards = [
    board('Study', [task('Revise DSA notes', 'high', 'Arrays and linked lists'), task('Finish reading report')]),
    board('Project', [task('Sketch wireframes')]),
    board('Personal', [task('Buy ink refills', 'low')]),
  ];
  return { boards, activeId: boards[0].id };
}
export const newBoard = (name) => board(name);

// Stable "random" tilt (-3..3 deg) derived from the id, so cards don't jiggle on re-render.
export const tilt = (id) => ([...id].reduce((h, c) => h + c.charCodeAt(0), 0) % 7) - 3;

// Pure drag-and-drop reducer: remove from source slot, insert at destination slot.
export function moveTask(columns, from, to) {
  const next = { ...columns, [from.col]: [...columns[from.col]] };
  const [moved] = next[from.col].splice(from.index, 1);
  if (to.col !== from.col) next[to.col] = [...columns[to.col]];
  next[to.col].splice(to.index, 0, moved);
  return next;
}
