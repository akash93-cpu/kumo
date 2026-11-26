import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import '../styles/view-products-style.css';

// ---- Config -------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const PAGE_SIZE_OPTIONS = [10, 20, 30]; // 30 is the maximum
const DEFAULT_PAGE_SIZE = 10;
 
// Your products controller is mounted under /products.
// Check the store controller's prefix too and change STORES_PATH if needed
// (e.g. '/stores/list-store').
const STORES_PATH = '/stores/list-store';
const productsPath = (storeId) => `/products/get-all-products/${storeId}`;
 
// Auth is cookie-based: the browser attaches the cookie for us, so we only
// need credentials: 'include'. The backend must allow it (allowCredentials).
async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error('You’re not signed in, or this session has expired.');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) for ${path}`);
  return res.json();
}
 
// Matches ProductsDto: productId, storeId, productName, description,
// price, stockQuantity, status
const normalizeProduct = (p) => ({
  id: p.productId,
  name: p.productName || 'Untitled product',
  description: p.description || '',
  price: Number(p.price ?? 0),
  stock: p.stockQuantity ?? null,
  status: p.status || '',
});
 
const formatRand = (n) =>
  `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
 
// 1 … 4 5 [6] 7 8 … 20
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('gap-start');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push('gap-end');
  items.push(total);
  return items;
}
 
function ProductCard({ product }) {
  const { name, description, price, stock, status } = product;
  const outOfStock = stock !== null && Number(stock) <= 0;
 
  return (
    <article className="product-card">
      <div className="product-media">
        <span className="product-initial" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
        {status && <span className="product-tag">{status}</span>}
      </div>
      <div className="product-body">
        <h3>{name}</h3>
        {description && <p>{description}</p>}
        <div className="product-foot">
          <strong>{formatRand(price)}</strong>
          {stock !== null && (
            <span className={`stock ${outOfStock ? 'out' : ''}`}>
              {outOfStock ? 'Out of stock' : `${stock} in stock`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
 
function ViewProducts() {
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState('');
 
  // 1) Get the store(s) first -> we need the storeId for the products call
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getJson(STORES_PATH);
        if (cancelled) return;
        setStores(data);
        if (data.length > 0) setStoreId(data[0].storeId);
        console.log(storeId);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoadingStores(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);
 
  // 2) Once we have a storeId, load its products
  useEffect(() => {
    if (storeId == null) return;
    let cancelled = false;
    setLoadingProducts(true);
    setError('');
    (async () => {
      try {
        const data = await getJson(productsPath(storeId));
        if (cancelled) return;
        setProducts(data.map(normalizeProduct));
        setPage(1);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => { cancelled = true; };
  }, [storeId]);
 
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, totalPages);
 
  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);
 
  const rangeStart = products.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, products.length);
 
  const changePage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const changePageSize = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1); // avoid landing on a page that no longer exists
  };
 
  const currentStore = stores.find((s) => s.storeId === storeId);
  const loading = loadingStores || loadingProducts;
 
  return (
    <main className="products-page">
      <header className="products-header">
        <div>
          <p className="eyebrow">{currentStore?.storeName ?? 'Your store'}</p>
          <h1>My products</h1>
        </div>
 
        <div className="products-controls">
          {stores.length > 1 && (
            <label className="control">
              <span>Store</span>
              <select value={storeId ?? ''} onChange={(e) => setStoreId(Number(e.target.value))}>
                {stores.map((s) => (
                  <option key={s.storeId} value={s.storeId}>{s.storeName}</option>
                ))}
              </select>
            </label>
          )}
          <label className="control">
            <span>Per page</span>
            <select value={pageSize} onChange={changePageSize}>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
      </header>
 
      {error && <div className="products-state error" role="alert">Couldn’t load products. {error}</div>}
 
      {loading && !error && (
        <div className="product-grid" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="product-card skeleton" />)}
        </div>
      )}
 
      {!loading && !error && products.length === 0 && (
        <div className="products-state">
          <PackageOpen size={28} />
          <strong>No products yet</strong>
          <span>Add your first product and it will show up here.</span>
        </div>
      )}
 
      {!loading && !error && products.length > 0 && (
        <>
          <div className="product-grid">
            {visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
 
          <nav className="pagination" aria-label="Product pages">
            <span className="pagination-count">
              {rangeStart}–{rangeEnd} of {products.length}
            </span>
 
            <div className="pagination-pages">
              <button
                type="button"
                className="page-btn"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
 
              {getPageItems(currentPage, totalPages).map((item) =>
                typeof item === 'number' ? (
                  <button
                    key={item}
                    type="button"
                    className={`page-btn ${item === currentPage ? 'active' : ''}`}
                    onClick={() => changePage(item)}
                    aria-current={item === currentPage ? 'page' : undefined}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="page-gap">…</span>
                )
              )}
 
              <button
                type="button"
                className="page-btn"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </nav>
        </>
      )}
    </main>
  );
}
 
export default ViewProducts;
 
