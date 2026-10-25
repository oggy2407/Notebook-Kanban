import { useLayoutEffect, useRef, useState } from 'react';

/*
 * THE PAGE FLIP
 * The real page (children) always renders in its NEW state, underneath.
 * When pageKey (board) or theme changes we lay a "leaf" on top that shows the OLD
 * page and rotate it 180deg around its left edge (the binding):
 *   - front face = old paper (old theme + old board name)
 *   - back face  = new paper, pre-rotated 180deg; backface-visibility hides whichever
 *                  face points away, so the old theme turns over to show the new one
 * Only transform + opacity animate. A shade strip sweeps across for the shadow.
 * useLayoutEffect swaps the leaf in before the browser paints, so there is no flash.
 * (Reduced motion: CSS swaps the rotation for a plain fade.)
 */
export default function FlipPage({ pageKey, theme, label, children }) {
  const prev = useRef({ pageKey, theme, label });
  const timer = useRef();
  const [leaf, setLeaf] = useState(null);

  useLayoutEffect(() => {
    const old = prev.current;
    if (old.pageKey !== pageKey || old.theme !== theme) {
      setLeaf({ old, n: Date.now() }); // n makes React restart the CSS animation
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setLeaf(null), 800);
    }
    prev.current = { pageKey, theme, label };
  });

  return (
    <div className="stage">
      <div className="paper page" data-theme={theme}>{children}</div>
      {leaf && (
        <>
          <div className="shade" aria-hidden="true"><div className="sweep" key={'s' + leaf.n} /></div>
          <div className="leaf" key={leaf.n} aria-hidden="true">
            <div className="paper face" data-theme={leaf.old.theme}><h2 className="leaf-title">{leaf.old.label}</h2></div>
            <div className="paper face back" data-theme={theme}><h2 className="leaf-title">{label}</h2></div>
          </div>
        </>
      )}
    </div>
  );
}
