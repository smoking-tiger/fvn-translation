import type { HTMLAttributes } from 'react';

import Tooltip from './Tooltip';

import { member } from '../metadata';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Member({ name, ...rest }: Props) {
  const data = member[name];
  if (!data) return null;
  return (
    <Tooltip
      className="bg-slate-100 dark:bg-slate-800 rounded"
      label={(
        <div className="flex p-2">
          <figure className="size-16 mr-2">
            <img className="rounded-lg object-fit" src={data.avatar} alt={name} />
          </figure>
          <div className="flex flex-col">
            <span className="font-semibold text-xl">{name}</span>
            <span className="opacity-75">{data.role}</span>
          </div>
        </div>
      )}
      position="top"
    >
      <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full" {...rest}>
        <img className="aspect-square h-full w-full" src={data.avatar} alt={name} />
      </span>
    </Tooltip>
  );
}
