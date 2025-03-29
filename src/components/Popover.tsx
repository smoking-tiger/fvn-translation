import { Children, cloneElement, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import {
  useFloating, useInteractions, useClick, useId, useTransitionStyles,
  shift, offset as offsetUi, flip, FloatingOverlay, autoUpdate,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/core';

import Portal from './Portal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: ReactElement;
  children?: ReactNode;
  position?: Placement;
}

export default function Popover({ label, children, position, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const nodeId = useId();

  const { refs, floatingStyles, context } = useFloating({
    nodeId,
    placement: position,
    middleware: [
      shift(),
      flip({ fallbackAxisSideDirection: 'end' }),
      offsetUi({ mainAxis: 0, crossAxis: 6 }),
    ],
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: 'scale(0.8)' },
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useClick(context, { enabled: true }),
  ]);

  return (
    <>
      {cloneElement(Children.only(label), getReferenceProps({
        ref: refs.setReference,
        tabIndex: 0,
        role: 'button',
        'aria-expanded': open,
      }))}
      <Portal disabled={!isMounted}>
        <FloatingOverlay data-testid="vs-popover-shadow" onClick={() => setOpen(false)} autoFocus>
          <div role="region" ref={refs.setFloating} style={floatingStyles}>
            <div {...getFloatingProps({ ...rest })}>
              {children}
            </div>
          </div>
        </FloatingOverlay>
      </Portal>
    </>
  );
}
