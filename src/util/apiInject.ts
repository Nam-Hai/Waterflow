import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

/**
 * Helper function around provide/inject to create a typed pair with a curried "key" and default values
 */
export function createContext<T>(
  key: InjectionKey<T> | string,
  defaultValue?: T,
): readonly [
  (value?: T) => void,
  // eslint-disable-next-line no-shadow
  (defaultValue?: T | (() => T), treatDefaultAsFactory?: boolean) => T,
] {
  const provideContext = (value?: T): void => {
    provide(key, value || defaultValue);
  };

  // eslint-disable-next-line no-shadow
  const useContext = (defaultValue?: T | (() => T), treatDefaultAsFactory?: boolean): T =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject(key, defaultValue, treatDefaultAsFactory as any) as T;
  return [provideContext, useContext] as const;
}
