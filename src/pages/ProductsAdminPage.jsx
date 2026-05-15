import { useRef, useState } from 'react'
import * as productsApi from '../api/products.js'
import { useCategories } from '../context/CategoriesContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatCLP } from '../utils/money.js'
import { getProductPrimaryImage } from '../utils/productImage.js'

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
  const color =
    stock <= 5
      ? 'bg-red-100 text-red-700'
      : stock <= 20
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-green-100 text-green-700'
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{stock}</span>
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
  const [msg, setMsg] = useState(null) // { type: 'ok'|'err', text }
  const [search, setSearch] = useState('')
  const fileRef = useRef(null)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const notify = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

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
    setModal(null)
    setEditingProduct(null)
    if (fileRef.current) fileRef.current.value = ''
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

  const inputClass =
    'w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gestión de Productos</h1>
          <p className="mt-1 text-sm text-ink/60">
            {products.length} producto{products.length !== 1 ? 's' : ''} en catálogo
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Feedback */}
      {msg ? (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      {/* Search */}
      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría…"
          className="w-full max-w-sm rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink/50">
            {search ? 'Sin resultados para esa búsqueda.' : 'No hay productos aún. Crea el primero.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-surface">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-ink/70">Imagen</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink/70">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink/70">Categoría</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink/70">Precio</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink/70">Stock</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink/70">Desc.</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink/70">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => {
                  const img = getProductPrimaryImage(p)
                  return (
                    <tr key={p._id} className="transition-colors hover:bg-surface/50">
                      <td className="px-4 py-3">
                        {img ? (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-white p-0.5">
                            <img src={img} alt={p.name} className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-xs text-ink/30">
                            Sin img
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink">{p.name}</div>
                        {p.subCategory ? (
                          <div className="text-xs text-ink/50">{p.subCategory}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 capitalize text-ink/70">{p.category}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCLP(p.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="px-4 py-3 text-right text-ink/70">
                        {p.discountPercent > 0 ? `${p.discountPercent}%` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-line"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                          >
                            Eliminar
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

      {/* Modal */}
      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-lg font-bold text-ink">
                {modal === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-ink/50 hover:bg-surface hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">Nombre *</label>
                <input
                  required
                  placeholder="Ej: Leche entera 1L"
                  value={form.name}
                  onChange={update('name')}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">
                  Descripción *
                </label>
                <textarea
                  required
                  minLength={5}
                  rows={3}
                  placeholder="Descripción del producto"
                  value={form.description}
                  onChange={update('description')}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink/70">
                    Precio (CLP) *
                  </label>
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
                  <label className="mb-1 block text-xs font-semibold text-ink/70">Stock *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink/70">
                    Categoría *
                  </label>
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
                  <label className="mb-1 block text-xs font-semibold text-ink/70">
                    Subcategoría
                  </label>
                  <input
                    placeholder="Ej: Leches"
                    value={form.subCategory}
                    onChange={update('subCategory')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">
                  Descuento (%)
                </label>
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

              {/* Images */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/70">
                  {modal === 'create' ? 'Imágenes * (máx. 6)' : 'Imágenes (máx. 6)'}
                </label>

                {modal === 'edit' && editingProduct?.imageUrls?.length > 0 ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {editingProduct.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`img-${i}`}
                        className="h-14 w-14 rounded-lg border border-line object-cover"
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
                  className={inputClass}
                />

                {modal === 'edit' ? (
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-ink/60">
                    <input
                      type="checkbox"
                      checked={replaceImages}
                      onChange={(e) => setReplaceImages(e.target.checked)}
                      className="rounded"
                    />
                    Reemplazar imágenes existentes
                  </label>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-full border border-line py-2.5 text-sm font-semibold text-ink hover:bg-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-brand py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {saving
                    ? 'Guardando…'
                    : modal === 'create'
                    ? 'Crear producto'
                    : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
