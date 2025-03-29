import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface Props {
  children: ReactNode;
  container?: HTMLElement;
  disabled?: boolean;
}

export default function Portal({ children, container, disabled }: Props) {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEffect(() => {
    if (!container) {
      let dom = document.getElementById('fvn-portals');
      if (!dom) {
        dom = document.createElement('div');
        dom.id = 'fvn-portals';
        document.body.appendChild(dom);
      }
      return setMountNode(dom);
    }
    setMountNode(container);
  }, [container]);

  if (disabled || !mountNode) return null;
  return createPortal(children, mountNode);
}
