import {
  ArrowRight,
  Check,
  LoaderCircle,
  LockKeyhole
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

import '../styles/login-modal.css';
import '../styles/create-store-modal.css';

const DESCRIPTION_MAX = 500;

function validate({ storeName }) {
  const errors = {};

  if (!storeName.trim()) {
    errors.storeName = 'Store name is required.';
  }

  return errors;
}

export default function CreateStoreModal({ trigger, open, onOpenChange, onSuccess }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeRequest = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(closeTimer.current);
      activeRequest.current?.abort();
    };
  }, []);

  const resetForm = () => {
    setStoreName('');
    setDescription('');
    setLocation('');
    setErrors({});
    setStatus(null);
  };

  const handleOpenChange = (nextOpen) => {
    clearTimeout(closeTimer.current);

    if (!nextOpen) {
      activeRequest.current?.abort();
      activeRequest.current = null;

      setLoading(false);
      resetForm();
    }

    setDialogOpen(nextOpen);
  };

  // Focus the first field when the dialog opens, close on Escape
  useEffect(() => {
    if (!dialogOpen) return undefined;

    document.getElementById('store-name')?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleOpenChange(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const clearFieldError = (field) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus(null);
  };

  const submit = async (event) => {
    event.preventDefault();

    const nextErrors = validate({ storeName });

    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length) {
      document.getElementById('store-name')?.focus();
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const baseUrl = 'http://localhost:8080';

      const response = await fetch(`${baseUrl}/create-store`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        // createdAt is set by the server, so it is not sent
        body: JSON.stringify({
          storeName: storeName.trim(),
          description: description.trim() || null,
          location: location.trim() || null
        }),
        signal: controller.signal
      });

      if (controller.signal.aborted) return;

      if (response.status === 201 || response.ok) {
        let createdStore = null;

        try {
          createdStore = await response.json();
        } catch {
          createdStore = null;
        }

        if (controller.signal.aborted) return;

        setStatus({
          tone: 'success',
          text: 'Your store has been created.'
        });

        onSuccess?.(createdStore);

        // Let the success message show briefly, then close
        closeTimer.current = setTimeout(() => {
          handleOpenChange(false);
        }, 900);
      } else if (response.status === 400) {
        setErrors({ storeName: 'Store name cannot be blank.' });
        document.getElementById('store-name')?.focus();
      } else if (response.status === 401) {
        setStatus({
          tone: 'error',
          text: 'Your session has expired. Sign in again to create a store.'
        });
      } else if (response.status === 404) {
        setStatus({
          tone: 'error',
          text: 'You already have an existing store! Please contact support to remove it first!'
        });
      } else {
        setStatus({
          tone: 'error',
          text: 'We couldn’t create your store right now. Please try again.'
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
            aria-labelledby="store-title"
            data-testid="dialog-create-store"
          >
            <div className="login-dialog">

              <div className="login-dialog-kicker">
                <span className="login-kicker-mark">K</span>
                <span>KUMO COMMERCE / NEW STORE</span>
              </div>

              <div className="login-heading">
                <p className="login-eyebrow">
                  SET UP SHOP
                </p>

                <h2 id="store-title" className="login-title">
                  Open your<br />
                  <em>store.</em>
                </h2>

                <p className="login-description">
                  Tell us about your store. You can change these details later.
                </p>
              </div>

              <form
                className="login-form"
                noValidate
                onSubmit={submit}
                aria-label="Create store"
                aria-busy={loading}
              >
                <div className="login-field">
                  <label htmlFor="store-name">
                    Store name <span aria-hidden="true">*</span>
                  </label>

                  <input
                    id="store-name"
                    name="storeName"
                    type="text"
                    value={storeName}
                    disabled={loading}
                    maxLength={100}
                    onChange={(event) => {
                      setStoreName(event.target.value);
                      clearFieldError('storeName');
                    }}
                    placeholder="e.g. Kumo Coffee Roasters"
                    autoComplete="organization"
                    required
                    aria-invalid={Boolean(errors.storeName)}
                    aria-describedby={
                      errors.storeName ? 'store-name-error' : undefined
                    }
                    data-testid="input-store-name"
                  />

                  {errors.storeName && (
                    <span
                      id="store-name-error"
                      className="login-field-error"
                      role="alert"
                      data-testid="error-store-name"
                    >
                      {errors.storeName}
                    </span>
                  )}
                </div>

                <div className="login-field">
                  <label htmlFor="store-description">
                    Description
                  </label>

                  <textarea
                    id="store-description"
                    name="description"
                    className="store-textarea"
                    value={description}
                    disabled={loading}
                    maxLength={DESCRIPTION_MAX}
                    rows={4}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      setStatus(null);
                    }}
                    placeholder="What do you sell, and who is it for?"
                    aria-describedby="store-description-count"
                    data-testid="input-store-description"
                  />

                  <span
                    id="store-description-count"
                    className="store-char-count"
                  >
                    {description.length}/{DESCRIPTION_MAX}
                  </span>
                </div>

                <div className="login-field">
                  <label htmlFor="store-location">
                    Location
                  </label>

                  <input
                    id="store-location"
                    name="location"
                    type="text"
                    value={location}
                    disabled={loading}
                    onChange={(event) => {
                      setLocation(event.target.value);
                      setStatus(null);
                    }}
                    placeholder="City, country"
                    autoComplete="address-level2"
                    data-testid="input-store-location"
                  />
                </div>

                <button
                  className="login-submit"
                  type="submit"
                  disabled={loading}
                  data-testid="button-store-submit"
                >
                  <span>
                    {loading ? 'Creating your store' : 'Create store'}
                  </span>

                  {loading
                    ? <LoaderCircle size={16} className="login-loading-icon" aria-hidden="true" />
                    : <ArrowRight size={16} />}
                </button>

                <div
                  className={`login-status ${status ? `is-${status.tone}` : ''}`}
                  role="status"
                  aria-live="polite"
                  data-testid="status-create-store"
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
                <span>SECURE STORE SETUP</span>
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