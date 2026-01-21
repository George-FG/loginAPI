import { useState } from 'react';
import type { AuthResponse } from './auth';
import { login, signup } from './auth';
import './App.css';



function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<AuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to get redirectTo param from URL
  function getRedirectTo(): string | null {
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirectTo');
    return redirectTo ? decodeURIComponent(redirectTo) : null;
  }

  const handleLogin = async () => {
    setError(null);
    setResponse(null);
    try {
      const res = await login({ username, password });
      setResponse(res);
      // Redirect if no error and redirectTo param exists
      if (!res?.message && getRedirectTo()) {
        window.location.href = getRedirectTo()!;
      }
    } catch (err: unknown) {
      const error = err as { message?: string; body?: unknown };
      setError(error?.message || 'Login failed');
      setResponse((error?.body as AuthResponse) || null);
    }
  };

  const handleSignup = async () => {
    setError(null);
    setResponse(null);
    try {
      const res = await signup({ username, password });
      setResponse(res);
      // Redirect if no error and redirectTo param exists
      if (!res?.message && getRedirectTo()) {
        window.location.href = getRedirectTo()!;
      }
    } catch (err: unknown) {
      const error = err as { message?: string; body?: unknown };
      setError(error?.message || 'Signup failed');
      setResponse((error?.body as AuthResponse) || null);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        <div className="form-card">
          <h1>Login/Signup</h1>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="button-group">
            <button onClick={handleLogin} className="btn btn-primary">
              Login
            </button>
            <button onClick={handleSignup} className="btn btn-secondary">
              Sign Up
            </button>
          </div>
        </div>
      </div>
      {(response || error) && (
        <div >
          {error && <div className="error-message">{error}</div>}
          {!error && response && <div className="success-message">Successful!</div>}
        </div>
      )}
    </div>
  );
}

export default App;
