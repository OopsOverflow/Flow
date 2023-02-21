import { ListVisu } from './list-visu.component';

export function listVisu(...args: ConstructorParameters<typeof ListVisu>): ListVisu {
  return new ListVisu(...args);
}

export type { ListVisu };
