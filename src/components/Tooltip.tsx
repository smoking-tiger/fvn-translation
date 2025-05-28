import { Children, cloneElement, useState, forwardRef, useMemo } from 'react';
import type { ReactNode, ReactElement, HTMLAttributes } from 'react';
import {
  useFloating, useInteractions, useHover, useTransitionStyles,
  shift, offset as offsetUi, flip, autoUpdate,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/core';
import clsx from 'clsx';

import Portal from './Portal';

interface Props {
  label: ReactNode;
  children: ReactElement;
  position?: Placement;
  className?: string;
}

export default function Tooltip({ children, position = 'bottom', label, className }: Props) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    nodeId: 'fvn-tooltip',
    open,
    placement: position,
    middleware: [
      shift(),
      flip(),
      offsetUi({ mainAxis: 6, crossAxis: 0 }),
    ],
    whileElementsMounted: autoUpdate,
    onOpenChange: setOpen,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { enabled: true }),
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: 'scale(0.8)' },
  });

  const child = typeof children === 'string' ? <span>{children}</span> : children;

  return (
    <>
      {cloneElement(Children.only(child), { ref: refs.setReference, ...getReferenceProps() })}
      <Portal disabled={!isMounted}>
        <div role="tooltip" className="z-[9999]" ref={refs.setFloating} {...getFloatingProps({ style: floatingStyles })}>
          <TooltipContent className={className} style={styles}>
            {label}
          </TooltipContent>
        </div>
      </Portal>
    </>
  );
}

interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  custom?: boolean;
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(({
  className, custom, ...rest
}, ref) => {
  const tooltipName = useMemo(() => clsx(
    'relative w-auto h-auto outline-none transition-transform ease-in-out whitespace-pre',
    'bg-stone-100 dark:bg-stone-800',
    custom ? null : 'rounded shadow-md px-3 py-1',
    className,
  ), [className, custom]);
  return <div ref={ref} className={tooltipName} {...rest} />;
});
