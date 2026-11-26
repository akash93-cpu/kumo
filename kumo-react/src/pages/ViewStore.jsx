import {
    CalendarDays,
    LoaderCircle,
    MapPin,
    RefreshCw,
    Store,
    TriangleAlert,
    UserRound,
    X, ArrowRight
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import '../styles/view-store-modal.css';

const DEFAULT_URL = 'http://localhost:8080/stores/list-store';

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export default function ViewStoreModal({
  trigger,
  open,
  onOpenChange,
  url = DEFAULT_URL
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeRequest = useRef(null);

  const loadStores = useCallback(async () => {
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      if (controller.signal.aborted) return;

      if (response.status === 401 || response.status === 403) {
        setError('You don’t have access to these stores. Sign in and try again.');
        return;
      }

      if (!response.ok) {
        setError('We couldn’t load the stores right now. Please try again.');
        return;
      }

      const data = await response.json();
      if (controller.signal.aborted) return;

      setStores(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      if (!controller.signal.aborted) {
        setError('We couldn’t reach KUMO. Check your connection, backend URL, and CORS settings.');
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }, [url]);

  // Fetch whenever the modal opens; abort if it closes mid-request
  useEffect(() => {
    if (!dialogOpen) return undefined;

    loadStores();

    return () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [dialogOpen, loadStores]);

  // Close on Escape
  useEffect(() => {
    if (!dialogOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDialogOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dialogOpen, setDialogOpen]);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      activeRequest.current?.abort();
      activeRequest.current = null;
      setLoading(false);
      setError(null);
    }

    setDialogOpen(nextOpen);
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
          className="store-dialog-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleOpenChange(false);
            }
          }}
        >
          <div
            className="store-dialog-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-title"
            data-testid="dialog-view-store"
          >
            <div className="store-dialog">

              <div className="store-dialog-kicker">
                <span className="store-kicker-mark">K</span>
                <span>KUMO COMMERCE / STORE DIRECTORY</span>
                <button
                  type="button"
                  className="store-close"
                  aria-label="Close"
                  onClick={() => handleOpenChange(false)}
                  data-testid="button-store-close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="store-heading">
                <p className="store-eyebrow">YOUR STORE, AT A GLANCE</p>

                <h2 id="store-title" className="store-title">
                  This<br />
                  <em>is your store.</em>
                </h2>

                <p className="store-description">
                  See who runs each store, where it is and when it opened.
                </p>
              </div>

              <div
                className="store-body"
                aria-busy={loading}
                data-testid="store-list"
              >
                {loading && (
                  <div className="store-state" role="status" aria-live="polite">
                    <LoaderCircle size={16} className="store-loading-icon" aria-hidden="true" />
                    <span>Loading stores</span>
                  </div>
                )}

                {!loading && error && (
                  <div className="store-state is-error" role="alert" data-testid="status-store-error">
                    <TriangleAlert size={15} aria-hidden="true" />
                    <span>{error}</span>
                    <button
                      type="button"
                      className="store-retry"
                      onClick={loadStores}
                      data-testid="button-store-retry"
                    >
                      <RefreshCw size={13} aria-hidden="true" />
                      Try again
                    </button>
                  </div>
                )}

                {!loading && !error && stores.length === 0 && (
                  <div className="store-state" data-testid="status-store-empty">
                    <Store size={15} aria-hidden="true" />
                    <span>No stores have been created yet.</span>
                  </div>
                )}

                {!loading && !error && stores.length > 0 && (
                  <ul className="store-list">
                    {stores.map((store) => (
                      <li
                        key={store.storeId}
                        className="store-card"
                        data-testid={`card-store-${store.storeId}`}
                      >
                        <h3 className="store-card-name">
                          {store.storeName || 'Untitled store'}
                        </h3>

                        <p className="store-card-desc">
                          {store.description || 'No description provided.'}
                        </p>

                        <dl className="store-meta">
                          <div className="store-meta-row">
                            <dt>
                              <UserRound size={13} aria-hidden="true" />
                              <span>Owner</span>
                            </dt>
                            <dd>{store.merchant?.userName || '—'}</dd>
                          </div>

                          <div className="store-meta-row">
                            <dt>
                              <MapPin size={13} aria-hidden="true" />
                              <span>Location</span>
                            </dt>
                            <dd>{store.location || '—'}</dd>
                          </div>

                          <div className="store-meta-row">
                            <dt>
                              <CalendarDays size={13} aria-hidden="true" />
                              <span>Created</span>
                            </dt>
                            <dd>
                              <time dateTime={store.createdAt}>
                                {formatDate(store.createdAt)}
                              </time>
                            </dd>
                          </div>
                        </dl>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
<div className="store-cta-wrap">
  <a
    href="/view-products"   // or use <Link to="..."> / <button onClick={...}>
    className="button button-gold store-cta"
    data-testid="button-view-store-products"
  >
    View store products
    <ArrowRight size={14} aria-hidden="true" />
  </a>
</div>
              <div className="store-dialog-foot">
                <span>
                  {!loading && !error
                    ? `${stores.length} ${stores.length === 1 ? 'STORE' : 'STORES'}`
                    : 'STORE DIRECTORY'}
                </span>
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
