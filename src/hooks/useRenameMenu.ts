import { useCallback } from "react";

export interface MenuItem {
  id: number;
  name: string;
  children: MenuItem[];
}

export const useRenameMenu = (
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>
) => {
  const commitRename = useCallback((id: number, newName: string) => {
    const renameItemRecursive = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, name: newName };
        } else if (item.children.length > 0) {
          return { ...item, children: renameItemRecursive(item.children) };
        }
        return item;
      });
    };

    setMenu((prevMenu) => renameItemRecursive(prevMenu));
  }, [setMenu]);

  return { commitRename };
};
