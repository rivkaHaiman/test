import React, { useState } from "react";
import { useRenameMenu } from "./useRenameMenu.ts";
import Input from "../components/Input.tsx";

interface MenuItem {
  id: number;
  name: string;
  children: MenuItem[];
}

interface ContextMenuState {
  x: number;
  y: number;
  itemId: number | null;
}

export const useMenuLogic = () => {
  const [menu, setMenu] = useState<MenuItem[]>([
    { id: 0, name: "Main Menu", children: [] },
  ]);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  const { commitRename } = useRenameMenu(setMenu);

  const handleRightClick = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, itemId: id });
  };

  const handleAddSubmenu = (parentId: number) => {
    const addSubmenuRecursive = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: [
                ...item.children,
                {
                  id: Date.now(),
                  name: "New Submenu",
                  children: [],
                },
              ],
            }
          : {
              ...item,
              children: addSubmenuRecursive(item.children),
            }
      );
    };

    setMenu((prevMenu) => addSubmenuRecursive(prevMenu));
    setContextMenu(null);
  };

  const handleRename = (id: number) => {
    if (!newName.trim()) return;
    commitRename(id, newName);
    setEditingId(null);
    setNewName("");
  };

  const renderMenuItems = (items: MenuItem[]): any => {
    return (
      <ul className="ml-4 border-l pl-2">
        {items.map((item) => (
          <li key={item.id} className="p-1 cursor-pointer">
            {editingId === item.id ? (
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleRename(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRename(item.id);
                  }
                }}
                autoFocus
              />
            ) : (
              <span
                onContextMenu={(e) => handleRightClick(e, item.id)}
                onClick={(e) => e.stopPropagation()} // Prevent unwanted clicks
              >
                {item.name}
              </span>
            )}
            {item.children.length > 0 && renderMenuItems(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return {
    menu,
    contextMenu,
    editingId,
    newName,
    handleRightClick,
    handleAddSubmenu,
    setEditingId,
    setNewName,
    commitRename,
    renderMenuItems,
  };
};
