import React from 'react';
import { screen, render } from '@testing-library/react';
import VirtualScroller from './VirtualScroller';
import { ITag } from './CodingChallenge';
import { generateData } from '../common/utils';

const TestRowTemplate = (v: ITag, i: number) => {
  return (
    <li
      data-test-element={i}
      style={{
        backgroundColor: `${v.color}`,
      }}
      key={`${v.id}_${i}`}
    >
      {v.content}
    </li>
  );
};

const data = generateData(100);

describe('Fast and isolated socket tests', function () {
  let dom: any;
  beforeEach(() => {
    dom = render(
      <VirtualScroller
        data={data}
        scrollPosition={0}
        setScrollPosition={() => {}}
        row={TestRowTemplate}
      />
    );
  });

  test('Should only render a subset of the total number of elements', async () => {
    expect(
      dom.container.querySelectorAll('[data-test-element]').length
    ).toEqual(16);
  });

  test('Should have a top-padding and a bottom padding element with the same size as the whole list', async () => {
    const topPadding = await screen.getAllByTestId('top-padding-element');
    expect(topPadding.length).toEqual(1);
    const bottomPadding = await screen.getAllByTestId('bottom-padding-element');
    expect(bottomPadding.length).toEqual(1);
    // totalHeight (100*40) - padding bottom (0) - inViewHeight (40*14) // 3440px
    expect(bottomPadding[0].style.height).toEqual('3440px');
    // top should have no padding set
    expect(topPadding[0].style.height).toEqual('0px');
  });
});
