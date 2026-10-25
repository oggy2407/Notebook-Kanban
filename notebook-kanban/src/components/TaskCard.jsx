import { Draggable } from '@hello-pangea/dnd';
import { PRIORITIES, tilt } from '../utils/data.js';

export default function TaskCard({ task, index, done, locked, onEdit, onDelete }) {
  const late = task.due && !done && task.due < new Date().toISOString().slice(0, 10);
  return (
    // isDragDisabled while filtering: visible indexes no longer match stored indexes.
    // Touch: the library starts a drag after a short press, so normal swipes still scroll.
    <Draggable draggableId={task.id} index={index} isDragDisabled={locked}>
      {(p, s) => (
        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className={'slip' + (s.isDragging ? ' dragging' : '')}>
          {/* The library moves the outer div; tilt lives on the inner one so the two never fight. */}
          <article className={'note ' + task.priority} style={{ '--tilt': tilt(task.id) + 'deg' }}>
            <span className="tape" />
            <h3>{task.title}</h3>
            {task.note && <p>{task.note}</p>}
            <footer>
              <span className="tag">{PRIORITIES[task.priority]}</span>
              {task.due && <time className={late ? 'late' : ''}>{late ? 'overdue · ' : 'due '}{task.due}</time>}
              <span className="spacer" />
              <button className="icon-btn" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>✎</button>
              <button className="icon-btn" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>✕</button>
            </footer>
            {done && (
              <svg className="check" viewBox="0 0 40 40" aria-hidden="true"><path d="M6 22 L16 32 L35 7" /></svg>
            )}
          </article>
        </div>
      )}
    </Draggable>
  );
}
