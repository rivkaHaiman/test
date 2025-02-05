import React from "react";
import { MenuItem } from "../types/menuItem.types";

const MenuPreview: React.FC<{ items: MenuItem[] }> = ({ items }) => {
  return (
    <ul className="flex space-x-4">
      {items.map((item) => (
        <li key={item.id} className="relative group">
          <button className="bg-white border p-2 rounded flex items-center">
            {item.name}
            {item.children.length > 0 && (
              <span className="ml-2">&#9662;</span> // Down arrow
            )}
          </button>
          {item.children.length > 0 && (
            <ul className="absolute left-full top-0 mt-0 bg-white border rounded shadow-lg hidden group-hover:block">
              {item.children.map((child) => (
                <li
                  key={child.id}
                  className="w-48 p-2 hover:bg-gray-200 relative group"
                >
                  {child.name}
                  {child.children.length > 0 && (
                    <span className="ml-2">&#9656;</span> // Right arrow
                  )}
                  {child.children.length > 0 && (
                    <ul className="absolute left-full top-0 mt-0 bg-white border rounded shadow-lg hidden group-hover:block">
                      {child.children.map((grandchild) => (
                        <li
                          key={grandchild.id}
                          className="w-48 p-2 hover:bg-gray-200"
                        >
                          {grandchild.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MenuPreview;
