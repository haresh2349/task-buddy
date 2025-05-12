import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

jest.mock("./pages/dashboard/Dashboard.tsx", () => ({
  Dashboard: () => <div>Task Buddy</div>,
}));

jest.mock("./pages/auth/AuthDashboard.tsx", () => ({
  AuthDashboard: () => <div>Sign In</div>,
}));

const mockStore = configureStore([]);

describe("App Component", () => {
  it("renders Dashboard when user is authenticated", () => {
    const store = mockStore({
      auth: { isAuthenticated: true },
      common: {
        isSnackbarOpen: false,
        snackbarMessage: "",
        snackbarSeverity: "",
        showTime: 3000,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const heading = screen.getByText("Task Buddy");

    expect(heading).toBeDefined();
  });

  it("renders Auth Dashboard when user is not authenticated", () => {
    const store = mockStore({
      auth: { isAuthenticated: false },
      common: {
        isSnackbarOpen: false,
        snackbarMessage: "",
        snackbarSeverity: "",
        showTime: 3000,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const heading = screen.getByText("Sign In");

    expect(heading).toBeDefined();
  });

  it("renders Snackbar when open", () => {
    const store = mockStore({
      auth: { isAuthenticated: true },
      common: {
        isSnackbarOpen: true,
        snackbarMessage: "Test Message",
        snackbarSeverity: "success",
        showTime: 3000,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText("Test Message")).toBeDefined();
  });
});
