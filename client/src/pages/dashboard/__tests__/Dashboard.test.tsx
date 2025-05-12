import { render, screen, fireEvent } from "@testing-library/react";
import { Dashboard } from "../Dashboard";
import { Provider } from "react-redux";
import * as todosManager from "../managers/todos-manager";
import { store } from "../../../store/store";

jest.mock("../managers/todos-manager", () => ({
  handleGetTodos: jest.fn(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    (todosManager.handleGetTodos as jest.Mock).mockClear();
  });

  const setup = () =>
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

  it("renders Navbar and Filters", () => {
    setup();
    expect(screen.getByText(/task buddy/i)).toBeInTheDocument(); // assuming "Task Buddy" is shown in Navbar
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("fetches todos on mount", () => {
    setup();
    expect(todosManager.handleGetTodos).toHaveBeenCalled();
  });

  it("shows list view by default", () => {
    setup();
    expect(screen.getByTestId("todos-list")).toBeInTheDocument();
  });

  //   it("switches to board view when 'Board' tab is clicked", () => {
  //     setup();
  //     const boardTab = screen.getByTestId("tab-board");
  //     fireEvent.click(boardTab);
  //     expect(screen.getByTestId("todos-board")).toBeInTheDocument(); // Assuming TodosBoard has this test ID
  //   });

  it("opens create todo modal when 'Add Task' button is clicked", async () => {
    setup();
    const createBtn = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(createBtn);
    expect(await screen.getByTestId("create-todo-modal")).toBeInTheDocument();
    expect(screen.getByText(/create task/i)).toBeInTheDocument(); // adjust to modal heading
  });
});
