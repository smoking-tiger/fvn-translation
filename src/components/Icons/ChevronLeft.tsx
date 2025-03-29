import type { SVGAttributes } from 'react';

export default function ChevronLeft(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
