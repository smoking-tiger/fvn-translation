import { createSignal, createUniqueId, onSettled, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { Placement } from '@floating-ui/dom';
import { FloatingPanel } from './Tooltip';
import Button from './Button';

export default function Popover(props: { label: JSX.Element; children: JSX.Element; position?: Placement }) {
  const [open, setOpen] = createSignal(false);
  const id = createUniqueId();
  let anchor!: HTMLSpanElement;
  onSettled(() => {
    const outside = (event: Event) => {
      if (event.target instanceof Node && !anchor.contains(event.target) && !document.getElementById(id)?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); anchor.querySelector('button')?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  });
  return <span ref={anchor} class="inline-flex">
    <Button class="flex items-center rounded-full border p-1 mr-2" aria-expanded={open() ? "true" : "false"} aria-controls={id} aria-label="태그 선택" onClick={() => setOpen((value) => !value)}>{props.label}</Button>
    <Show when={open()}><FloatingPanel reference={anchor} position={props.position} id={id} role="region" close={() => setOpen(false)}>{props.children}</FloatingPanel></Show>
  </span>;
}
