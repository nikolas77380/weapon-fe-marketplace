"use client";

interface AuthSwitcherProps {
  authMode: "login" | "register";
  onAuthModeChange: (mode: "login" | "register") => void;
}

const AuthSwitcher = ({ authMode, onAuthModeChange }: AuthSwitcherProps) => {
  return (
    <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
      <input
        type="checkbox"
        id="filter"
        checked={authMode === "register"}
        onChange={(e) =>
          onAuthModeChange(e.target.checked ? "register" : "login")
        }
      />
      <span>Login</span>
      <span>Register</span>
    </label>
  );
};

export default AuthSwitcher;
