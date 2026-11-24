
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  Eye,
  EyeOff, LoaderCircle,  LockKeyhole
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

import '../styles/login-modal.css';

function validate(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export default function LoginModal({ trigger, open, onOpenChange, onSuccess }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;
  const [accountType, setAccountType] = useState('merchant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeRequest = useRef(null);
const closeTimer = useRef(null);

useEffect(() => {
  return () => clearTimeout(closeTimer.current);
}, []);
  const changeRole = (role) => {
    setAccountType(role);
    setStatus(null);
  };

  const handleRoleKeyDown = (event) => {
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();

      const next =
        event.key === 'Home'
          ? 'merchant'
          : event.key === 'End'
            ? 'user'
            : accountType === 'merchant'
              ? 'user'
              : 'merchant';

      changeRole(next);
      document.getElementById(`login-role-${next}`)?.focus();
    }
  };

  const handleOpenChange = (nextOpen) => {
    clearTimeout(closeTimer.current);
    if (!nextOpen) {
      activeRequest.current?.abort();
      activeRequest.current = null;

      setLoading(false);
      setPassword('');
      setStatus(null);
      setErrors({});
    }

    setDialogOpen(nextOpen);
  };

  const submit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(email, password);

    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length) {
      document
        .getElementById(nextErrors.email ? 'login-email' : 'login-password')
        ?.focus();

      return;
    }

    setLoading(true);

    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const baseUrl = 'http://localhost:8080';

      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        }),
        signal: controller.signal
      });

      if (controller.signal.aborted) return;

      if (response.status === 401) {
        setStatus({
          tone: 'error',
          text: 'Those sign-in details don’t match. Check your email and password and try again.'
        });
      } else if (response.status === 403) {
        setStatus({
          tone: 'error',
          text: 'This account is inactive or unavailable. Contact support if you think this is a mistake.'
        });
      } else if (response.ok) {
        setPassword('');

        setStatus({
          tone: 'success',
          text: 'You’re signed in successfully.'
        });
        onSuccess?.();
        // Let the success message show briefly, then close
        closeTimer.current = setTimeout(() => {
          handleOpenChange(false);
        }, 900);
      } else {
        let unavailable = false;

        try {
          const responseText = await response.text();

          unavailable = /disabled|inactive|deactivated|unavailable/i.test(
            responseText
          );
        } catch {
          unavailable = false;
        }

        if (controller.signal.aborted) return;

        setStatus({
          tone: 'error',
          text: unavailable
            ? 'This account is inactive or unavailable. Contact support if you think this is a mistake.'
            : 'We couldn’t complete sign-in right now. Please try again.'
        });
      }
    } catch {
      if (!controller.signal.aborted) {
        setStatus({
          tone: 'error',
          text: 'We couldn’t reach KUMO. Check your connection, backend URL, and CORS settings.'
        });
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <>
      <span
        onClick={() => handleOpenChange(true)}
        style={{ display: 'contents' }}
      >
        {trigger}
      </span>

      {dialogOpen && createPortal(
        <div
          className="login-dialog-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleOpenChange(false);
            }
          }}
        >
          <div
            className="login-dialog-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            data-testid="dialog-login"
          >
            <div className="login-dialog">

              <div className="login-dialog-kicker">
                <span className="login-kicker-mark">K</span>
                <span>KUMO COMMERCE / MEMBER ACCESS</span>
              </div>

              <div className="login-heading">
                <p className="login-eyebrow">
                  YOUR NEXT MOVE, IN FOCUS
                </p>

                <h2 id="login-title" className="login-title">
                  Good to have<br />
                  <em>you back.</em>
                </h2>

                <p className="login-description">
                  Choose your account, then pick up where you left off.
                </p>
              </div>

              <div
                className="login-role-options"
                role="radiogroup"
                aria-label="Choose account type"
              >
                <button
                  id="login-role-merchant"
                  type="button"
                  role="radio"
                  aria-checked={accountType === 'merchant'}
                  tabIndex={accountType === 'merchant' ? 0 : -1}
                  className={`login-role-option ${accountType === 'merchant' ? 'is-selected' : ''}`}
                  onClick={() => changeRole('merchant')}
                  onKeyDown={handleRoleKeyDown}
                  disabled={loading}
                  data-testid="button-login-role-merchant"
                >
                  <BriefcaseBusiness size={17} />
                  <span>Merchant</span>
                  <small>Your store, your numbers</small>
                </button>

                <button
                  id="login-role-user"
                  type="button"
                  role="radio"
                  aria-checked={accountType === 'user'}
                  tabIndex={accountType === 'user' ? 0 : -1}
                  className={`login-role-option ${accountType === 'user' ? 'is-selected' : ''}`}
                  onClick={() => changeRole('user')}
                  onKeyDown={handleRoleKeyDown}
                  disabled={loading}
                  data-testid="button-login-role-user"
                >
                  <CircleUserRound size={17} />
                  <span>User</span>
                  <small>Your KUMO account</small>
                </button>
              </div>

              <form
                className="login-form"
                noValidate
                onSubmit={submit}
                aria-label="Sign in"
                aria-busy={loading}
              >
                <div className="login-field">
                  <label htmlFor="login-email">
                    Email address <span aria-hidden="true">*</span>
                  </label>

                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    value={email}
                    disabled={loading}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        email: undefined
                      }));
                      setStatus(null);
                    }}
                    placeholder="you@yourstore.com"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? 'login-email-error' : undefined
                    }
                    data-testid="input-login-email"
                  />

                  {errors.email && (
                    <span
                      id="login-email-error"
                      className="login-field-error"
                      role="alert"
                      data-testid="error-login-email"
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="login-field">
                  <label htmlFor="login-password">
                    Password <span aria-hidden="true">*</span>
                  </label>

                  <div className={`login-password-wrap ${errors.password ? 'has-error' : ''}`}>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      disabled={loading}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrors((current) => ({
                          ...current,
                          password: undefined
                        }));
                        setStatus(null);
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? 'login-password-error' : undefined
                      }
                      data-testid="input-login-password"
                    />

                    <button
                      type="button"
                      className="login-password-toggle"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      disabled={loading}
                      onClick={() => setShowPassword((shown) => !shown)}
                      data-testid="button-login-toggle-password"
                    >
                      {showPassword
                        ? <EyeOff size={16} />
                        : <Eye size={16} />}
                    </button>
                  </div>

                  {errors.password && (
                    <span
                      id="login-password-error"
                      className="login-field-error"
                      role="alert"
                      data-testid="error-login-password"
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                <button
                  className="login-submit"
                  type="submit"
                  disabled={loading}
                  data-testid="button-login-submit"
                >
                  <span>
                    {loading ? 'Signing you in' : 'Sign in to KUMO'}
                  </span>

                  {loading
                    ? <LoaderCircle size={16} className="login-loading-icon" aria-hidden="true" />
                    : <ArrowRight size={16} />}
                </button>

                <div
                  className={`login-status ${status ? `is-${status.tone}` : ''}`}
                  role="status"
                  aria-live="polite"
                  data-testid="status-login"
                >
                  {status && (
                    <>
                      {status.tone === 'success'
                        ? <Check size={15} />
                        : <LockKeyhole size={15} />}

                      <span>{status.text}</span>
                    </>
                  )}
                </div>
              </form>

              <div className="login-dialog-foot">
                <span>SECURE ACCOUNT ACCESS</span>
                <span>KNOW YOUR NUMBERS.</span>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
