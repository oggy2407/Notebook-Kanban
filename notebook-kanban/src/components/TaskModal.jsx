import { useEffect, useState } from 'react';
import { PRIORITIES } from '../utils/data.js';

export default function TaskModal({ task, theme, isNew, onSave, onClose }) {
  const [f, setF] = useState(task);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (f.title.trim()) onSave({ ...f, title: f.title.trim() });
  };
  return (
    <div className="overlay" data-theme={theme} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="sheet" role="dialog" aria-modal="true" aria-label={isNew ? 'New note' : 'Edit note'} onSubmit={submit}>
        <h2>{isNew ? 'New note' : 'Edit note'}</h2>
        <label>Title<input autoFocus required maxLength={80} value={f.title} onChange={set('title')} /></label>
        <label>Note (optional)<textarea rows={3} value={f.note} onChange={set('note')} /></label>
        <div className="row">
          <label>Priority
            <select value={f.priority} onChange={set('priority')}>
              {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label>Due (optional)<input type="date" value={f.due} onChange={set('due')} /></label>
        </div>
        <div className="row end">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save note</button>
        </div>
      </form>
    </div>
  );
}
