import React, { useState, useEffect } from "react";
import Input from "./Input.tsx";
import { useRenameMenu } from "./hooks/useRenameMenu.ts";

interface MenuItem {
  id: number;
  name: string;
  children: MenuItem[];
}

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const savedMenu = localStorage.getItem("menu");
    return savedMenu
      ? JSON.parse(savedMenu)
      : [{ id: 0, name: "Main Menu", children: [] }];
  });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: number | null;
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const { commitRename } = useRenameMenu(setMenu);

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

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
                  id: Date.now(), // Use Date.now() for unique id
                  name: "New Submenu",
                  children: [],
                },
              ],
            }
          : item.children.length > 0
          ? {
              ...item,
              children: addSubmenuRecursive(item.children),
            }
          : item
      );
    };

    setMenu((prevMenu) => addSubmenuRecursive(prevMenu));
    setContextMenu(null);
  };

  const handleDelete = (itemId: number) => {
    const deleteItemRecursive = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.id !== itemId)
        .map((item) => {
          if (item.children.length > 0) {
            return { ...item, children: deleteItemRecursive(item.children) };
          }
          return item;
        });
    };

    setMenu((prevMenu) => deleteItemRecursive(prevMenu));
    setContextMenu(null);
  };

  console.log("menu", menu);

  const renderMenuItems = (items: MenuItem[]) => {
    return (
      <ul className="ml-4 border-l pl-2">
        {items.map((item) => (
          <li key={item.id} className="p-1 cursor-pointer">
            {editingId === item.id ? (
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => {
                  if (!newName.trim()) {
                    setNewName(item.name); // Revert to original name
                    setEditingId(null);
                    return;
                  }
                  commitRename(item.id, newName);
                  setEditingId(null);
                  setNewName("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitRename(item.id, newName);
                    setEditingId(null);
                    setNewName("");
                  }
                }}
                autoFocus
              />
            ) : (
              <span onContextMenu={(e) => handleRightClick(e, item.id)}>
                {item.name}
              </span>
            )}
            {item.children.length > 0 && renderMenuItems(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 relative">
      <h1>Menu</h1>
      {renderMenuItems(menu)}

      {contextMenu && (
        <div
          className="absolute bg-white shadow-md border p-2 rounded z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="block w-full text-left p-1 hover:bg-gray-200"
            onClick={() => handleAddSubmenu(contextMenu.itemId!)}
          >
            Add Submenu
          </button>
          <button
            className="block w-full text-left p-1 hover:bg-gray-200"
            onClick={() => {
              setEditingId(contextMenu.itemId);
              setNewName("");
              setContextMenu(null);
            }}
          >
            Rename
          </button>
          <button
            className="block w-full text-left p-1 hover:bg-gray-200"
            onClick={() => handleDelete(contextMenu.itemId!)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
