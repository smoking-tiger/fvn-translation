import type { SVGAttributes } from 'react';

export default function Plus(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
