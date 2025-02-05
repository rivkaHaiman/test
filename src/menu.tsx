import React, { useState, useEffect } from "react";
import MenuItemComponent from "./MenuItem.tsx";
import { useRenameMenu } from "./hooks/useRenameMenu.ts";
import { MenuItem } from "./types/menuItem.types.ts";
import MenuPreview from "./MenuPreview.tsx";

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
                  id: Date.now(),
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

  const renderMenuItems = (items: MenuItem[]) => {
    return (
      <ul className="ml-4 border-l pl-2">
        {items.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            editingId={editingId}
            newName={newName}
            setNewName={setNewName}
            setEditingId={setEditingId}
            commitRename={commitRename}
            handleRightClick={handleRightClick}
            renderMenuItems={renderMenuItems}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 relative">
      <h1>Menu</h1>
      {renderMenuItems(menu)}

      <div className="mt-4">
        <h2>Menu Preview</h2>
        <div className="bg-gray-100 p-4 rounded shadow">
          <MenuPreview items={menu} />
        </div>
      </div>

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
