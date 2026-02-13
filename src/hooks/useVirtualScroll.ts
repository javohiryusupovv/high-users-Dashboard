
import { useState, useEffect, useMemo, type RefObject } from "react";

interface VirtualItem {
  index: number;
  offsetTop: number;
}

interface VirtualScrollReturn {
  totalHeight: number;
  visibleItems: VirtualItem[];
  offsetY: number;
}



export function useVirtualScroll(
  itemCount: number,
  itemHeight: number,
  containerRef: RefObject<HTMLDivElement | null>
): VirtualScrollReturn {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);

    const observer = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });

    container.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [containerRef]);

  const totalHeight = itemCount * itemHeight;
  const overscan = 5;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  const offsetY = startIndex * itemHeight;

  const visibleItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, offsetTop: i * itemHeight });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  return { totalHeight, visibleItems, offsetY };
}
