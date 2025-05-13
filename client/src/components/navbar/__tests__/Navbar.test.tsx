import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navbar } from "../Navbar";
import { Provider } from "react-redux";
import * as navbarManager from "../navbar-manager";
import { store } from "../../../store/store";

const mockDispatch = jest.fn();

// Mock getUserDetails and handleLogout
jest.mock("../navbar-manager", () => ({
  getUserDetails: jest.fn(),
  handleLogout: jest.fn(),
}));

describe("Navbar Component", () => {
  const mockUser = {
    id: "123",
    username: "john",
    email: "john@example.com",
  };

  const setup = () => {
    localStorage.setItem("loginUser", mockUser.id);
    return render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Task Buddy heading", () => {
    setup();
    expect(screen.getByText(/task buddy/i)).toBeInTheDocument();
  });

  it("calls getUserDetails on mount", () => {
    setup();
    expect(navbarManager.getUserDetails).toHaveBeenCalledWith({
      id: mockUser.id,
      setterMethod: expect.any(Function),
    });
  });

  it("shows avatar button with initial (username first letter)", async () => {
    (navbarManager.getUserDetails as jest.Mock).mockImplementation(
      ({ setterMethod }) => setterMethod(mockUser)
    );

    setup();

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("J");
    });
  });

  it("shows popover on avatar click", async () => {
    (navbarManager.getUserDetails as jest.Mock).mockImplementation(
      ({ setterMethod }) => setterMethod(mockUser)
    );

    setup();

    const avatarBtn = screen.getByTestId("avatar-btn");
    fireEvent.click(avatarBtn);

    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls handleLogout when logout button is clicked", async () => {
    (navbarManager.getUserDetails as jest.Mock).mockImplementation(
      ({ setterMethod }) => setterMethod(mockUser)
    );

    setup();

    const avatarBtn = screen.getByTestId("avatar-btn");
    fireEvent.click(avatarBtn);

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(navbarManager.handleLogout as jest.Mock).toHaveBeenCalledWith(
      expect.any(Function)
    );
    // expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  //   it("closes popover on outside click", async () => {
  //     (navbarManager.getUserDetails as jest.Mock).mockImplementation(
  //       ({ setterMethod }) => setterMethod(mockUser)
  //     );

  //     const { container } = setup();

  //     const avatarBtn = screen.getByTestId("avatar-btn");
  //     fireEvent.click(avatarBtn);

  //     expect(screen.getByText(mockUser.username)).toBeInTheDocument();

  //     // Click outside (on the container)
  //     fireEvent.mouseDown(container);

  //     await waitFor(() => {
  //       expect(screen.queryByText(mockUser.username)).not.toBeInTheDocument();
  //     });
  //   });
});
