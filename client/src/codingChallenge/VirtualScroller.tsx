import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ITag } from './CodingChallenge';
import './CodingChallenge.css';

interface VirtualScrollerProps {
  data: ITag[];
  row: (v: ITag, i: number) => JSX.Element;
  scrollPosition: number;
  setScrollPosition: Dispatch<SetStateAction<number>>;
}

const VirtualScroller: React.FC<VirtualScrollerProps> = ({
  data,
  row,
  scrollPosition,
  setScrollPosition,
}) => {
  const minIndex = 0;
  const maxIndex = data.length;
  const startIndex = 1;
  const itemHeight = 40;
  const amount = 15;
  const tolerance = 2;

  // 1) height of the visible part of the viewport (px)
  const viewportHeight = amount * itemHeight;
  // 2) total height of rendered and virtualized items (px)
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;

  // 3) single viewport outlet height, filled with rendered but invisible rows (px)
  const toleranceHeight = tolerance * itemHeight;

  // 4) all rendered rows height, visible part + invisible outlets (px)
  // const bufferHeight = viewportHeight + 2 * toleranceHeight;
  // 5) number of items to be rendered, buffered dataset length (pcs)
  const bufferedItems = amount + 2 * tolerance;

  // 6) how many items will be virtualized above (pcs)
  const itemsAbove = startIndex - tolerance - minIndex;
  // 7) initial height of the top padding element (px)
  const [paddingHeight, setPaddingHeight] = useState<{
    top: number;
    bottom: number;
    viewData: ITag[];
  }>({
    top: itemsAbove * itemHeight,
    bottom: totalHeight - itemsAbove * itemHeight,
    viewData: [],
  });

  const runScroller = (scrollTop: number) => {
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const viewData = visualizeData(index, bufferedItems);
    const nuTopPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const nuBottomPaddingHeight = Math.max(
      totalHeight - paddingHeight.top - viewData.length * itemHeight,
      0
    );

    setScrollPosition(scrollElement.current?.scrollTop || scrollPosition);

    setPaddingHeight({
      top: nuTopPaddingHeight,
      bottom: nuBottomPaddingHeight,
      viewData: viewData,
    });
  };

  const scrollElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    runScroller(scrollPosition);
    scrollElement.current?.scrollTo &&
      scrollElement.current?.scrollTo(0, scrollPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visualizeData = (offset: number, limit: number) => {
    const start = Math.max(minIndex, offset);
    const end = Math.min(offset + limit - 1, maxIndex);
    if (start > end) {
      return data.slice(end, start);
    }
    return data.slice(start, end);
  };

  return (
    <div
      className="viewport"
      ref={scrollElement}
      style={{ height: viewportHeight }}
      onScroll={(e) => runScroller(e.currentTarget.scrollTop)}
    >
      <div
        data-testid="top-padding-element"
        style={{ height: paddingHeight.top }}
      ></div>
      {paddingHeight.viewData.map(row)}
      <div
        data-testid="bottom-padding-element"
        style={{ height: paddingHeight.bottom }}
      ></div>
    </div>
  );
};

export default VirtualScroller;
