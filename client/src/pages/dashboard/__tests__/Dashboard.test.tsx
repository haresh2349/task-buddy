// Dashboard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Dashboard } from "../Dashboard"; // Adjust path
import * as reduxHooks from "../../../hooks/app.hooks";
import * as todosManager from "../managers/todos-manager";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

// Mock child components
jest.mock("../../../components/navbar/Navbar", () => ({
  Navbar: () => <div data-testid="navbar">Task Buddy</div>,
}));
jest.mock("../CreateTodoModal", () => ({
  CreateTodoModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="create-todo-modal">
        Create New Task <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

jest.mock("../EditTodoModal", () => ({
  EditTodoModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="edit-todo-modal">
        Edit Task<button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../components/list/TodosList", () => ({
  TodosList: () => <div data-testid="todos-list">TodosList</div>,
}));

jest.mock("../components/board/TodosBoard", () => ({
  TodosBoard: () => <div data-testid="todos-board">TodosBoard</div>,
}));

jest.mock("../Filters", () => ({
  Filters: ({ activeTab, setActiveTab, setShowTodoModal }: any) => (
    <div data-testid="filters">
      <button onClick={() => setActiveTab("list")}>List</button>
      <button onClick={() => setActiveTab("board")}>Board</button>
      <button onClick={() => setShowTodoModal(true)}>Add Task</button>
    </div>
  ),
}));

// Setup
const mockStore = configureStore([]);
const mockedDispatch = jest.fn();

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useDispatch
    jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockedDispatch);

    // Mock useAppSelector
    jest
      .spyOn(reduxHooks, "useAppSelector")
      .mockImplementation((selectorFn: any) =>
        selectorFn({ todos: { showEditTodoModal: false } })
      );

    // Mock handleGetTodos
    jest
      .spyOn(todosManager, "handleGetTodos")
      .mockImplementation(() => Promise.resolve());
  });

  const renderWithStore = (
    storeData = { todos: { showEditTodoModal: false } }
  ) => {
    const store = mockStore(storeData);
    return render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  };

  it("should render Navbar and Filters", () => {
    renderWithStore();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("filters")).toBeInTheDocument();
  });

  it("should render TodosList by default", () => {
    renderWithStore();
    expect(screen.getByTestId("todos-list")).toBeInTheDocument();
  });

  it("should switch to board view on tab click", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Board"));
    expect(screen.getByTestId("todos-board")).toBeInTheDocument();
  });

  it("should open CreateTodoModal on button click", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByTestId("create-todo-modal")).toBeInTheDocument();
  });

  it("should open EditTodoModal when state is true", () => {
    jest
      .spyOn(reduxHooks, "useAppSelector")
      .mockImplementation((selectorFn: any) =>
        selectorFn({ todos: { showEditTodoModal: true } })
      );

    renderWithStore({ todos: { showEditTodoModal: true } });
    expect(screen.getByTestId("edit-todo-modal")).toBeInTheDocument();
  });

  it("should call handleGetTodos on mount", () => {
    renderWithStore();
    expect(todosManager.handleGetTodos).toHaveBeenCalledWith({
      dispatch: mockedDispatch,
    });
  });
});
