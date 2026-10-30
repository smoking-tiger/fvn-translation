import type { JSX } from '@solidjs/web';

export default function Close(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
