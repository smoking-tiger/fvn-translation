import type { JSX } from '@solidjs/web';

export default function ChevronLeft(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" {...props}>
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
