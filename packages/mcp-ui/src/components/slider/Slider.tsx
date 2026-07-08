import { useRef, useState, useCallback, type ReactNode } from 'react';
import styles from './Slider.module.css';

const SCROLL_AMOUNT = 220;

type Props = {
  children: ReactNode;
};

export const Slider = ({ children }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={scrollLeft} disabled={atStart} aria-label="Previous">
        ‹
      </button>
      <div ref={trackRef} className={styles.track} onScroll={updateBounds}>
        {children}
      </div>
      <button className={styles.button} onClick={scrollRight} disabled={atEnd} aria-label="Next">
        ›
      </button>
    </div>
  );
};
