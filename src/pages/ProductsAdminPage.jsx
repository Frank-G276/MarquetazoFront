import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import * as productsApi from '../api/products.js'
import { useCategories } from '../context/CategoriesContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { Pagination } from '../components/Pagination.jsx'
import { formatCLP } from '../utils/money.js'
import { getProductPrimaryImage } from '../utils/productImage.js'

const ITEMS_PER_PAGE = 8

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  subCategory: '',
  discountPercent: '0',
}

function buildFormData(form, files, removeExistingImages = false) {
  const fd = new FormData()
  Object.entries(form).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) fd.append(k, String(v))
  })
  if (removeExistingImages) fd.append('removeExistingImages', 'true')
  if (files?.length) [...files].forEach((f) => fd.append('images', f))
  return fd
}

function StockBadge({ stock }) {
  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
        {stock}
      </span>
    )
  }
  if (stock <= 20) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 text-xs font-bold text-yellow-600">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 inline-block" />
        {stock}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
      {stock}
    </span>
  )
}

export function ProductsAdminPage() {
  const { products, reloadProducts } = useProducts()
  const { categories: categoryList } = useCategories()
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM)
  const [files, setFiles] = useState([])
  const [replaceImages, setReplaceImages] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const fileRef = useRef(null)
  const tableRef = useRef(null)
  const modalRef = useRef(null)
  const modalPanelRef = useRef(null)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const notify = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  // Animación de entrada de filas de la tabla
  const animateTableRows = () => {
    if (!tableRef.current) return
    const rows = tableRef.current.querySelectorAll('.product-row')
    if (!rows.length) return
    gsap.killTweensOf(rows)
    gsap.fromTo(
      rows,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      }
    )
  }

  // Ejecutar animación al montar y al cambiar de página
  useEffect(() => {
    animateTableRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, products, search])

  // Reiniciar página al buscar
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Animación del modal al abrir
  useEffect(() => {
    if (modal && modalPanelRef.current) {
      gsap.fromTo(
        modalPanelRef.current,
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'power3.out' }
      )
    }
  }, [modal])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFiles([])
    setReplaceImages(false)
    setEditingProduct(null)
    setModal('create')
  }

  const openEdit = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
      category: product.category || '',
      subCategory: product.subCategory || '',
      discountPercent: String(product.discountPercent ?? 0),
    })
    setFiles([])
    setReplaceImages(false)
    setEditingProduct(product)
    setModal('edit')
  }

  const closeModal = () => {
    if (modalPanelRef.current) {
      gsap.to(modalPanelRef.current, {
        opacity: 0,
        scale: 0.94,
        y: 12,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          setModal(null)
          setEditingProduct(null)
          if (fileRef.current) fileRef.current.value = ''
        },
      })
    } else {
      setModal(null)
      setEditingProduct(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (modal === 'create' && !files.length) {
      notify('err', 'Debes subir al menos una imagen')
      return
    }
    setSaving(true)
    try {
      const fd = buildFormData(form, files, replaceImages)
      if (modal === 'create') {
        await productsApi.createProduct(fd)
        notify('ok', 'Producto creado correctamente')
      } else {
        await productsApi.updateProduct(editingProduct._id, fd)
        notify('ok', 'Producto actualizado correctamente')
      }
      await reloadProducts()
      closeModal()
    } catch (err) {
      notify('err', err.message || 'Ocurrió un error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?\nEsta acción no se puede deshacer.`)) return
    try {
      await productsApi.deleteProduct(product._id)
      await reloadProducts()
      notify('ok', `"${product.name}" eliminado correctamente`)
    } catch (err) {
      notify('err', err.message || 'Error al eliminar el producto')
    }
  }

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase()),
      )
    : products

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const inputClass =
    'w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-ink/30'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 animate-fade-in">

      {/* Banner / Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl mb-8 p-6 md:p-8 border border-slate-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-brand/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -right-20 -bottom-20 h-44 w-44 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
            🛒 Catálogo
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            Gestión de Productos
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-medium">
            {products.length} producto{products.length !== 1 ? 's' : ''} en el catálogo activo
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-accent hover:bg-orange-600 px-5 py-3 text-sm font-extrabold text-white transition-all duration-200 shadow-lg shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo producto
          </button>
        </div>
      </div>

      {/* Feedback */}
      {msg ? (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold animate-fade-in ${
            msg.type === 'ok'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.type === 'ok' ? '✓ ' : '✗ '}
          {msg.text}
        </div>
      ) : null}

      {/* Buscador */}
      <div className="mb-5">
        <div className="relative w-full max-w-sm">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o categoría…"
            className="w-full rounded-2xl border border-line bg-white pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand shadow-sm"
          />
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="rounded-3xl border border-line bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm font-semibold text-ink/40">
              {search ? 'Sin resultados para esa búsqueda.' : 'No hay productos aún. Crea el primero.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-slate-50/70">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">Imagen</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">Producto</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">Categoría</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-ink/40">Precio</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-ink/40">Stock</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-ink/40">Dcto.</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-ink/40">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {paginated.map((p) => {
                  const img = getProductPrimaryImage(p)
                  return (
                    <tr
                      key={p._id}
                      className="product-row transition-colors hover:bg-slate-50/60 group"
                    >
                      <td className="px-5 py-3.5">
                        {img ? (
                          <div className="h-11 w-11 overflow-hidden rounded-xl border border-line bg-white shadow-sm flex items-center justify-center p-0.5">
                            <img src={img} alt={p.name} className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div className="h-11 w-11 rounded-xl bg-surface border border-line flex items-center justify-center text-[10px] text-ink/30 font-semibold">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <div className="font-bold text-ink truncate">{p.name}</div>
                        {p.subCategory ? (
                          <div className="text-[10px] text-ink/40 mt-0.5">{p.subCategory}</div>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-ink/60 capitalize">
                          {p.category || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-ink">{formatCLP(p.price)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {p.discountPercent > 0 ? (
                          <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                            {p.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-ink/30 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink transition-all hover:border-brand/40 hover:text-brand hover:shadow-sm active:scale-95 cursor-pointer"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 transition-all hover:bg-red-100 hover:border-red-200 active:scale-95 cursor-pointer"
                          >
                            🗑 Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setCurrentPage(p)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {/* Contador de resultados */}
      {filtered.length > 0 && (
        <p className="mt-4 text-center text-xs text-ink/40">
          Mostrando {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} de {filtered.length} productos
        </p>
      )}

      {/* Modal de creación / edición */}
      {modal ? (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div
            ref={modalPanelRef}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl border border-line"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h2 className="text-lg font-black text-ink">
                  {modal === 'create' ? '✨ Nuevo Producto' : '✏️ Editar Producto'}
                </h2>
                <p className="text-xs text-ink/40 mt-0.5">
                  {modal === 'create' ? 'Completa los campos para agregar al catálogo.' : `Editando: ${editingProduct?.name}`}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="h-8 w-8 flex items-center justify-center rounded-xl text-ink/40 hover:bg-slate-100 hover:text-ink transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6">

              {/* Nombre */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Nombre *</label>
                <input
                  required
                  placeholder="Ej: Leche entera 1L"
                  value={form.name}
                  onChange={update('name')}
                  className={inputClass}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Descripción *</label>
                <textarea
                  required
                  minLength={5}
                  rows={3}
                  placeholder="Descripción detallada del producto"
                  value={form.description}
                  onChange={update('description')}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Precio (CLP) *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.price}
                    onChange={update('price')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Stock *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                    value={form.stock}
                    onChange={update('stock')}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Categoría y Subcategoría */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Categoría *</label>
                  <select
                    required
                    value={form.category}
                    onChange={update('category')}
                    className={inputClass}
                  >
                    <option value="">Seleccionar...</option>
                    {categoryList.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Subcategoría</label>
                  <input
                    placeholder="Ej: Lácteos"
                    value={form.subCategory}
                    onChange={update('subCategory')}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Descuento */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">Descuento (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0"
                  value={form.discountPercent}
                  onChange={update('discountPercent')}
                  className={inputClass}
                />
              </div>

              {/* Imágenes */}
              <div className="rounded-2xl border border-dashed border-line bg-slate-50/60 p-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                  {modal === 'create' ? 'Imágenes * (máx. 6)' : 'Imágenes (máx. 6)'}
                </label>

                {modal === 'edit' && editingProduct?.imageUrls?.length > 0 ? (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {editingProduct.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`img-${i}`}
                        className="h-14 w-14 rounded-xl border border-line object-cover shadow-sm"
                      />
                    ))}
                  </div>
                ) : null}

                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files || [])}
                  className="w-full text-xs text-ink/60 file:mr-3 file:rounded-xl file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white file:cursor-pointer hover:file:bg-brand-dark"
                />

                {modal === 'edit' ? (
                  <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-ink/50">
                    <input
                      type="checkbox"
                      checked={replaceImages}
                      onChange={(e) => setReplaceImages(e.target.checked)}
                      className="rounded accent-brand"
                    />
                    Reemplazar imágenes existentes
                  </label>
                ) : null}
              </div>

              {/* Acciones del modal */}
              <div className="flex gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-line py-2.5 text-sm font-bold text-ink hover:bg-surface transition-all cursor-pointer active:scale-98"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-brand hover:bg-brand-dark py-2.5 text-sm font-extrabold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-brand/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Guardando…</span>
                    </>
                  ) : modal === 'create' ? (
                    'Crear producto'
                  ) : (
                    'Guardar cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
