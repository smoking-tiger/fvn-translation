import type { HTMLAttributes } from 'react';

import Tooltip from './Tooltip';
import clsx from 'clsx';
import IconLogo from './Icons/Logo';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  data: MemberType;
  full?: boolean;
}

export default function Member({ name, data, full, ...rest }: Props) {
  return (
    <Tooltip
      label={(
        <div className="flex py-1">
          <figure className="size-16 mr-2">
            {data.avatar ? (
              <img className="rounded-lg object-fit" src={data.avatar} alt={name} />
            ) : (
              <IconLogo className="rounded-lg object-fit" />
            )}
          </figure>
          <div className="flex flex-col">
            <span className="font-semibold text-xl">{name}</span>
            <span className="opacity-75">{data.role || '번역가'}</span>
            {full && data.message ? (
              <p className="max-w-65 whitespace-pre-wrap">{data.message}</p>
            ) : null}
          </div>
        </div>
      )}
      position="top"
    >
      <span
        className={clsx(
          'relative flex shrink-0 overflow-hidden rounded-2xl',
          full ? 'size-20' : 'size-10',
        )}
        {...rest}
      >
        {data.avatar ? (
          <img className="aspect-square h-full w-full" src={data.avatar} alt={name} />
        ) : (
          <IconLogo className="aspect-square h-full w-full" />
        )}
      </span>
    </Tooltip>
  );
}
