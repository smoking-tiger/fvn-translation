import type { JSX } from '@solidjs/web';

import Tooltip from './Tooltip';
import clsx from 'clsx';
import IconLogo from './Icons/Logo';

interface Props extends JSX.HTMLAttributes<HTMLSpanElement> {
  name: string;
  data: MemberType;
  full?: boolean;
}

export default function Member(props: Props) {
  return (
    <Tooltip
      label={(
        <div class="flex py-1">
          <figure class="size-16 mr-2">
            {props.data.avatar ? (
              <img class="rounded-lg object-fit" src={props.data.avatar} alt={props.name} />
            ) : (
              <IconLogo class="rounded-lg object-fit" />
            )}
          </figure>
          <div class="flex flex-col">
            <span class="font-semibold text-xl">{props.name}</span>
            <span class="opacity-75">{props.data.role || '번역가'}</span>
            {props.full && props.data.message ? (
              <p class="max-w-65 whitespace-pre-wrap">{props.data.message}</p>
            ) : null}
          </div>
        </div>
      )}
      position="top"
    >
      <span
        class={clsx(
          'relative flex shrink-0 overflow-hidden rounded-2xl',
          props.full ? 'size-20' : 'size-10',
        )}
      >
        {props.data.avatar ? (
          <img class="aspect-square h-full w-full" src={props.data.avatar} alt={props.name} />
        ) : (
          <IconLogo class="aspect-square h-full w-full" />
        )}
      </span>
    </Tooltip>
  );
}
