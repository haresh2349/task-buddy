import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../Signup";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/store";

jest.mock("../managers/signup-manager", () => ({
  handleSubmitSignup: jest.fn(),
}));

jest.mock("../GoogleLogin", () => ({
  default: () => <div>Sign in with Google</div>,
}));

const mockedHandleSubmitSignup =
  require("../managers/signup-manager").handleSubmitSignup;

describe("Signup Component", () => {
  const setShowSignupMock = jest.fn();

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <Signup setShowSignup={setShowSignupMock} />;
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields and submit button", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Username")).toBeDefined();
    expect(screen.getByPlaceholderText("you@example.com")).toBeDefined();
    expect(screen.getByPlaceholderText("••••••••")).toBeDefined();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeDefined();
  });

  it("should allow typing into the fields", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "john_doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "john123" },
    });

    expect(screen.getByPlaceholderText("Username")).toHaveValue("john_doe");
    expect(screen.getByPlaceholderText("you@example.com")).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByPlaceholderText("••••••••")).toHaveValue("john123");
  });

  it('calls setShowSignup(false) when "Sign In" is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText("Sign In"));
    expect(setShowSignupMock).toHaveBeenCalledWith(false);
  });

  it("submits the form correctly", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "jane_doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "securepassword" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockedHandleSubmitSignup).toHaveBeenCalled();
      const args = mockedHandleSubmitSignup.mock.calls[0][0];
      expect(args.formData).toEqual({
        username: "jane_doe",
        email: "jane@example.com",
        password: "securepassword",
      });
    });
  });
});
