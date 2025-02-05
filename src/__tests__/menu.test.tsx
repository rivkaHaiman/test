import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Menu from "../menu";

// jest.mock("../hooks/useRenameMenu", () => ({
//   useRenameMenu: jest.fn(),
// }));

describe("Menu Component", () => {
  it("renders without crashing", () => {
    render(<Menu />);

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("adds a submenu correctly", async () => {
    render(<Menu />);

    const menuButton = screen.getByTestId("menu-item").childNodes[0];
    fireEvent.contextMenu(menuButton);
    const addSubmenuButton = await screen.findByText("Add Submenu");
    fireEvent.click(addSubmenuButton);
    const newSubmenus = screen.getAllByText("New Submenu");
    expect(newSubmenus.length).toBeGreaterThan(0);
  });

  // it("renames a menu item correctly", () => {
  //   render(<Menu />);

  //   const menuButton = screen.getByText("Menu");
  //   fireEvent.contextMenu(menuButton);

  //   const renameButton = screen.getByText("Rename");
  //   fireEvent.click(renameButton);

  //   const input = screen.getByRole("textbox");
  //   fireEvent.change(input, { target: { value: "New Name" } });
  //   fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  //   expect(screen.getByText("New Name")).toBeInTheDocument();
  // });
});
