import { makeVar } from '@apollo/client';
import { act, renderHook } from '@testing-library/react';

import useReactiveVarWithSelector from '../useReactiveVarWithSelector';

describe('useReactiveVarWithSelector', () => {
  it('should update when the reactive variable value changes', () => {
    const sampleVar = makeVar<{ fieldA: string; fieldB: number }>({
      fieldA: 'test',
      fieldB: 1,
    });

    const { result } = renderHook(() =>
      useReactiveVarWithSelector(sampleVar, (v) => v.fieldA)
    );

    expect(result.current).toStrictEqual('test');

    act(() => {
      sampleVar({ fieldA: 'test', fieldB: 5 });
    });

    expect(result.current).toStrictEqual('test');

    act(() => {
      sampleVar({ fieldA: 'test2', fieldB: 5 });
    });

    expect(result.current).toStrictEqual('test2');
  });
});
