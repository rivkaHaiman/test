import React from "react";
import Input from "./Input.tsx";
import { MenuItem } from "./types/menuItem.types.ts";

interface MenuItemProps {
  item: MenuItem;
  editingId: number | null;
  newName: string;
  setNewName: (name: string) => void;
  setEditingId: (id: number | null) => void;
  commitRename: (id: number, name: string) => void;
  handleRightClick: (e: React.MouseEvent, id: number) => void;
  renderMenuItems: (items: MenuItem[]) => JSX.Element;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  editingId,
  newName,
  setNewName,
  setEditingId,
  commitRename,
  handleRightClick,
  renderMenuItems,
}) => {
  return (
    <li key={item.id} className="p-1 cursor-pointer">
      {editingId === item.id ? (
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => {
            if (!newName.trim()) {
              setNewName(item.name);
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
  );
};

export default MenuItemComponent;
