import { createSignal, createUniqueId, onSettled, Show } from 'solid-js';
import { Portal, type JSX } from '@solidjs/web';
import { autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';

export function FloatingPanel(props: { reference: HTMLElement; position?: Placement; children: JSX.Element; id?: string; role?: JSX.HTMLAttributes<HTMLDivElement>['role']; close?: () => void }) {
  let panel!: HTMLDivElement;
  onSettled(() => autoUpdate(props.reference, panel, () => {
    void computePosition(props.reference, panel, {
      placement: props.position || 'bottom', strategy: 'fixed', middleware: [offset(6), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => Object.assign(panel.style, { left: `${x}px`, top: `${y}px` }));
  }));
  return <Portal><div ref={panel} id={props.id} role={props.role} class="fixed z-[9999]" onClick={props.close}>{props.children}</div></Portal>;
}

export default function Tooltip(props: { label: JSX.Element; children: JSX.Element; position?: Placement }) {
  const [open, setOpen] = createSignal(false);
  const id = createUniqueId();
  let anchor!: HTMLSpanElement;
  return <span ref={anchor} class="inline-flex" aria-describedby={open() ? id : undefined}
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
    onFocusIn={() => setOpen(true)} onFocusOut={() => setOpen(false)}>
    {props.children}
    <Show when={open()}><FloatingPanel reference={anchor} position={props.position} id={id} role="tooltip">
      <span class="block whitespace-pre rounded shadow-md px-3 py-1 bg-stone-100 dark:bg-stone-800">{props.label}</span>
    </FloatingPanel></Show>
  </span>;
}
