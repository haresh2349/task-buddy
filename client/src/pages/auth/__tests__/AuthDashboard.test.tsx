import { fireEvent, render, screen } from "@testing-library/react";
import { AuthDashboard } from "../AuthDashboard";

jest.mock("../Login", () => ({
  __esModule: true,
  default: ({ setShowSignup }: { setShowSignup: (value: boolean) => void }) => (
    <div>
      <p>Sign In</p>
      <button onClick={() => setShowSignup(true)}>Create new account</button>
    </div>
  ),
}));

jest.mock("../Signup", () => ({
  __esModule: true,
  default: ({ setShowSignup }: { setShowSignup: (value: boolean) => void }) => (
    <div>
      <p>Sign Up</p>
      <button onClick={() => setShowSignup(false)}>Sign In</button>
    </div>
  ),
}));

describe("Auth Dashboard", () => {
  it("should render login component initially", () => {
    render(<AuthDashboard />);
    expect(screen.getByText("Sign In")).toBeDefined();
  });

  it("should switches to sign up when button clicked", () => {
    render(<AuthDashboard />);
    fireEvent.click(screen.getByText("Create new account"));
    expect(screen.getByText("Sign Up")).toBeDefined();
  });

  it("should switches back to signin from signup", () => {
    render(<AuthDashboard />);
    fireEvent.click(screen.getByText("Create new account"));
    fireEvent.click(screen.getByText("Sign In"));
    expect(screen.getByText("Sign In")).toBeDefined();
  });
});
