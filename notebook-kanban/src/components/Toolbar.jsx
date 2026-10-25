import { FONTS, PRIORITIES } from '../utils/data.js';

export default function Toolbar({ filters, setFilters, font, setFont, theme, onTheme }) {
  return (
    <div className="toolbar">
      <input type="search" aria-label="Search notes" placeholder="Search notes…" value={filters.q}
        onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
      <select aria-label="Filter by priority" value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
        <option value="all">All priorities</option>
        {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select aria-label="Handwriting font" value={font} onChange={(e) => setFont(e.target.value)}>
        {FONTS.map((f) => <option key={f.name} value={f.css} style={{ fontFamily: f.css }}>{f.name}</option>)}
      </select>
      <button className="btn" onClick={onTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
        {theme === 'dark' ? '☀ Day' : '☾ Night'}
      </button>
    </div>
  );
}
