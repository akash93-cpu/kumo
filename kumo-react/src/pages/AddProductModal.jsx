import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import '../styles/add-product-style.css';
import { createPortal } from 'react-dom';

// ---- Config -------------------------------------------------------------
const API_BASE = 'http://localhost:8080';
const STORES_PATH = '/stores/list-store';
const ADD_PRODUCT_PATH = '/products/add-product';

// Change these to whatever values your backend expects for `status`.
const STATUS_OPTIONS = ['ACTIVE', 'DRAFT', 'INACTIVE'];

const EMPTY_FORM = {
  productName: '',
  description: '',
  price: '',
  stockQuantity: '0',
  status: STATUS_OPTIONS[0],
};

// Pulls a readable message out of a failed response (Spring validation errors,
// plain text, or JSON with message/errors fields).
async function readError(res) {
  if (res.status === 401 || res.status === 403) {
    return 'You’re not signed in, or this session has expired.';
  }
  try {
    const text = await res.text();
    try {
      const body = JSON.parse(text);
      if (typeof body === 'string') return body;
      if (body.message) return body.message;
      if (Array.isArray(body.errors)) {
        return body.errors.map((e) => e.defaultMessage || e.message || e).join(' ');
      }
      if (body && typeof body === 'object') {
        const values = Object.values(body).filter((v) => typeof v === 'string');
        if (values.length) return values.join(' ');
      }
    } catch {
      if (text) return text;
    }
  } catch {
    /* fall through */
  }
  return `Request failed (${res.status}).`;
}

function AddProductModal({ open, onOpenChange, onProductAdded }) {
  const [stores, setStores] = useState([]);
  const isOpen = open;
  const onClose = () => onOpenChange(false);
  const [storeId, setStoreId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadingStores, setLoadingStores] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const firstFieldRef = useRef(null);

  // 1) Every time the modal opens: reset the form and fetch the store(s) first.
  //    The storeId is required by POST /add-product.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    setForm(EMPTY_FORM);
    setFieldErrors({});
    setError('');
    setStores([]);
    setStoreId(null);
    setLoadingStores(true);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}${STORES_PATH}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error(await readError(res));
        const data = await res.json();
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) {
          setError('You need to create a store before you can add products.');
        } else {
          setStores(data);
          setStoreId(data[0].storeId);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Couldn’t load your store.');
      } finally {
        if (!cancelled) setLoadingStores(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen]);

  // Focus the first field once the store has loaded.
  useEffect(() => {
    if (isOpen && !loadingStores && storeId != null) firstFieldRef.current?.focus();
  }, [isOpen, loadingStores, storeId]);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape' && !saving) onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [field]: '' }));
  };

  // Mirrors the validation rules on ProductsDto.
  const validate = () => {
    const errs = {};
    if (!form.productName.trim()) errs.productName = 'Enter a product name.';
    const price = Number(form.price);
    if (form.price === '' || Number.isNaN(price) || price < 0.01) {
      errs.price = 'Price must be at least R0.01.';
    }
    if (form.stockQuantity !== '') {
      const stock = Number(form.stockQuantity);
      if (!Number.isInteger(stock) || stock < 0) {
        errs.stockQuantity = 'Stock must be a whole number, 0 or more.';
      }
    }
    if (!form.status) errs.status = 'Choose a status.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (storeId == null || saving) return;

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setError('');
    try {
      const payload = {
        // ProductsDto marks productId as @NotNull, so we generate one here.
        // If your backend generates it, remove this line and the @NotNull on the DTO.
        productId: crypto.randomUUID(),
        storeId,
        productName: form.productName.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stockQuantity: form.stockQuantity === '' ? 0 : Number(form.stockQuantity),
        status: form.status,
      };

      const res = await fetch(`${API_BASE}${ADD_PRODUCT_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await readError(res));

      onProductAdded?.(storeId);
      onClose();
    } catch (err) {
      setError(err.message || 'Couldn’t add the product.');
    } finally {
      setSaving(false);
    }
  };

  const currentStore = stores.find((s) => s.storeId === storeId);
  const canSubmit = storeId != null && !saving && !loadingStores;

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
        <header className="modal-header">
          <div>
            <p className="eyebrow">{currentStore?.storeName ?? 'Your store'}</p>
            <h2 id="add-product-title">Add product</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} disabled={saving} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        {error && <div className="form-alert" role="alert">{error}</div>}

        {loadingStores ? (
          <div className="modal-loading" aria-busy="true">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit} noValidate>
            {stores.length > 1 && (
              <label className="field">
                <span>Store</span>
                <select value={storeId ?? ''} onChange={(e) => setStoreId(Number(e.target.value))}>
                  {stores.map((s) => (
                    <option key={s.storeId} value={s.storeId}>{s.storeName}</option>
                  ))}
                </select>
              </label>
            )}

            <label className={`field ${fieldErrors.productName ? 'invalid' : ''}`}>
              <span>Product name</span>
              <input
                ref={firstFieldRef}
                type="text"
                value={form.productName}
                onChange={update('productName')}
                disabled={storeId == null}
                autoComplete="off"
              />
              {fieldErrors.productName && <small>{fieldErrors.productName}</small>}
            </label>

            <label className="field">
              <span>Description (optional)</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={update('description')}
                disabled={storeId == null}
              />
            </label>

            <div className="field-row">
              <label className={`field ${fieldErrors.price ? 'invalid' : ''}`}>
                <span>Price (R)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={update('price')}
                  disabled={storeId == null}
                />
                {fieldErrors.price && <small>{fieldErrors.price}</small>}
              </label>

              <label className={`field ${fieldErrors.stockQuantity ? 'invalid' : ''}`}>
                <span>Stock quantity</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={update('stockQuantity')}
                  disabled={storeId == null}
                />
                {fieldErrors.stockQuantity && <small>{fieldErrors.stockQuantity}</small>}
              </label>
            </div>

            <label className={`field ${fieldErrors.status ? 'invalid' : ''}`}>
              <span>Status</span>
              <select value={form.status} onChange={update('status')} disabled={storeId == null}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {fieldErrors.status && <small>{fieldErrors.status}</small>}
            </label>

            <footer className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!canSubmit}>
                {saving ? 'Adding…' : 'Add product'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

export default AddProductModal;