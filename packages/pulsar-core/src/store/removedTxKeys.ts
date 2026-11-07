/**
 * @file The transactions a person stopped tracking, kept across page loads and tabs.
 */

/** How many are kept: nothing else ever clears them. */
const MOST_KEPT = 50;

/**
 * The storage key of the list of a store.
 *
 * @internal
 * @param name - The `name` of the store.
 * @returns The key in `localStorage`.
 */
export const removedTxKeysStorageKey = (name: string | undefined) => `${name}:removedTxKeys`;

/**
 * The transactions removed from a store. Its own key in `localStorage` and not part of the saved state: every tab saves the whole
 * state on every change, and a tab with an older copy would undo the removal of another. Each change here reads the list first.
 * Where the storage is closed or missing, the list holds for the page.
 *
 * @internal
 * @param name - The `name` of the store.
 * @returns The list: `has`, `add` and `delete` of a key, and `reload`, which takes in what another tab wrote and returns what it
 * added.
 */
export function createRemovedTxKeys(name: string | undefined) {
  const storageKey = removedTxKeysStorageKey(name);

  const read = (): string[] | null => {
    try {
      if (typeof window === 'undefined') return null;
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      return Array.isArray(saved) ? saved.filter((key): key is string => typeof key === 'string') : [];
    } catch {
      return null;
    }
  };

  const write = (keys: string[]) => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(keys));
    } catch {
      // Holds for the page
    }
  };

  let keys = read() ?? [];

  return {
    has: (txKey: string) => keys.includes(txKey),
    add: (txKey: string) => {
      const current = read() ?? keys;
      // A write would be heard by the other tabs, and this one may be answering theirs
      if (current.includes(txKey)) {
        keys = current;
        return;
      }
      keys = [...current, txKey].slice(-MOST_KEPT);
      write(keys);
    },
    delete: (txKey: string) => {
      const current = read() ?? keys;
      keys = current.filter((key) => key !== txKey);
      if (keys.length !== current.length) write(keys);
    },
    reload: () => {
      const before = keys;
      keys = read() ?? keys;
      return keys.filter((key) => !before.includes(key));
    },
  };
}
