import { CSSProperties, ReactElement, Ref, cloneElement, useRef } from 'react';

import { useForkRef } from '@mui/material/utils';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

const DURATION = 225;

type Props = Omit<TransitionProps<HTMLElement>, 'children'> & {
  children: ReactElement<{ ref?: Ref<HTMLElement>; style?: CSSProperties }>;
  ref?: Ref<HTMLElement>;
};

// Custom Transition instead of MUI's Slide: translateY(100%) is element-relative
// and immune to viewport resizes mid-transition (e.g. virtual keyboard retraction).
const SlideUpTransition = ({ ref, children, ...props }: Props) => {
  const nodeRef = useRef<HTMLElement>(null);
  const handleRef = useForkRef(nodeRef, ref);
  return (
    <Transition nodeRef={nodeRef} timeout={DURATION} {...props}>
      {(state, childProps) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip ownerState before forwarding to cloned element
        const { ownerState, ...restChildProps } = childProps ?? {};
        return cloneElement(children, {
          ref: handleRef,
          style: {
            transition: `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            transform:
              state === 'entering' || state === 'entered'
                ? 'translateY(0)'
                : 'translateY(100%)',
            visibility: state === 'exited' && !props.in ? 'hidden' : undefined,
          },
          ...restChildProps,
        });
      }}
    </Transition>
  );
};

export default SlideUpTransition;
