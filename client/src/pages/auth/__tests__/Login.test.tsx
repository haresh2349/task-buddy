// src/pages/auth/Login.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import Login from "../Login";
import { handleSubmitLogin } from "../managers/login-manager";

// Mocks client\src\hooks\app.hooks.ts
jest.mock("../../../hooks/app.hooks", () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock("react-router-dom", () => {
  useNavigate: jest.fn();
});
jest.mock("../managers/login-manager", () => ({
  handleSubmitLogin: jest.fn(),
}));

jest.mock("../GoogleLogin", () => ({
  default: () => <div>Sign in with Google</div>,
}));

describe("Login Component", () => {
  const mockSetShowSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password inputs", () => {
    render(<Login setShowSignup={mockSetShowSignup} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("triggers handleSubmitLogin on form submit", () => {
    // const { handleSubmitLogin } = require("./managers/login-manager");

    render(<Login setShowSignup={mockSetShowSignup} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123", name: "password" },
    });

    // fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    fireEvent.submit(screen.getByRole("form"));

    expect(handleSubmitLogin).toHaveBeenCalled();
  });

  it("calls setShowSignup when 'Create new account' is clicked", () => {
    render(<Login setShowSignup={mockSetShowSignup} />);
    fireEvent.click(screen.getByText(/create new account/i));
    expect(mockSetShowSignup).toHaveBeenCalledWith(true);
  });
});
