import { useEffect, useRef, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard.jsx';

export default function Column({ col, tasks, total, locked, onAdd, onEdit, onDelete }) {
  // "Cleared" = the column had notes and now has none (remounts per board via key in App).
  const prev = useRef(total);
  const [cleared, setCleared] = useState(false);
  useEffect(() => {
    if (prev.current > 0 && total === 0) setCleared(true);
    if (total > 0) setCleared(false);
    prev.current = total;
  }, [total]);

  return (
    <section className="column" aria-label={col.title}>
      <h2>{col.title} <span className="count">{total}</span></h2>
      <svg className="squiggle" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 4 Q12 0 25 4 T50 4 T75 4 T100 4 T125 4 T150 4 T175 4 T200 4" />
      </svg>
      <Droppable droppableId={col.id}>
        {(p, s) => (
          <div ref={p.innerRef} {...p.droppableProps} className={'list' + (s.isDraggingOver ? ' over' : '')}>
            {tasks.map((t, i) => (
              <TaskCard key={t.id} task={t} index={i} done={col.id === 'done'} locked={locked} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {p.placeholder}
            {tasks.length === 0 && (
              <p className="empty">
                {cleared ? '✦ Page cleared. Nicely done.'
                  : total > 0 ? 'No notes match your search.'
                  : 'Nothing here yet, turn the page and start something.'}
              </p>
            )}
          </div>
        )}
      </Droppable>
      <button className="btn add" onClick={() => onAdd(col.id)}>+ Add a note</button>
    </section>
  );
}
