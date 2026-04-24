import { useMemo, useState } from 'react'
import * as ordersApi from '../api/orders.js'
import * as productsApi from '../api/products.js'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatCLP } from '../utils/money.js'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  subCategory: '',
  discountPercent: '0',
}

function buildProductFormData(form, files, removeExistingImages = false) {
  const fd = new FormData()
  Object.entries(form).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) fd.append(k, String(v))
  })
  if (removeExistingImages) fd.append('removeExistingImages', 'true')
  if (files?.length) {
    ;[...files].forEach((f) => fd.append('images', f))
  }
  return fd
}

export function AdminPage() {
  const { products, reloadProducts } = useProducts()
  const [createForm, setCreateForm] = useState(EMPTY_FORM)
  const [createFiles, setCreateFiles] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editFiles, setEditFiles] = useState([])
  const [replaceImages, setReplaceImages] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState('PENDIENTE')
  const [msg, setMsg] = useState('')

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedId) || null,
    [products, selectedId],
  )

  const updateCreate = (key) => (e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))
  const updateEdit = (key) => (e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))

  const selectProduct = (id) => {
    setSelectedId(id)
    const p = products.find((item) => item._id === id)
    if (!p) return
    setEditForm({
      name: p.name || '',
      description: p.description || '',
      price: String(p.price ?? ''),
      stock: String(p.stock ?? ''),
      category: p.category || '',
      subCategory: p.subCategory || '',
      discountPercent: String(p.discountPercent ?? 0),
    })
  }

  const createProduct = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      if (!createFiles.length) throw new Error('Debes subir al menos una imagen')
      const fd = buildProductFormData(createForm, createFiles)
      await productsApi.createProduct(fd)
      await reloadProducts()
      setCreateForm(EMPTY_FORM)
      setCreateFiles([])
      setMsg('Producto creado correctamente.')
    } catch (err) {
      setMsg(`Error creando producto: ${err.message}`)
    }
  }

  const updateProduct = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!selectedId) return
    try {
      const fd = buildProductFormData(editForm, editFiles, replaceImages)
      await productsApi.updateProduct(selectedId, fd)
      await reloadProducts()
      setMsg('Producto actualizado correctamente.')
    } catch (err) {
      setMsg(`Error actualizando producto: ${err.message}`)
    }
  }

  const removeProduct = async (id) => {
    const ok = window.confirm('¿Seguro que quieres eliminar este producto?')
    if (!ok) return
    setMsg('')
    try {
      await productsApi.deleteProduct(id)
      await reloadProducts()
      if (selectedId === id) setSelectedId('')
      setMsg('Producto eliminado correctamente.')
    } catch (err) {
      setMsg(`Error eliminando producto: ${err.message}`)
    }
  }

  const patchOrderStatus = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await ordersApi.updateOrderStatus(orderId, orderStatus)
      setMsg('Estado de orden actualizado.')
    } catch (err) {
      setMsg(`Error actualizando orden: ${err.message}`)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Panel admin</h1>
      <p className="mt-2 text-sm text-ink/70">
        Gestión completa de endpoints protegidos: <code>POST/PUT/DELETE /api/products</code> y <code>PATCH /api/orders/:id/status</code>.
      </p>

      {msg ? <p className="mt-4 rounded-xl bg-surface px-4 py-2 text-sm">{msg}</p> : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Crear producto</h2>
          <form className="mt-4 grid gap-3" onSubmit={createProduct}>
            <input required placeholder="Nombre" value={createForm.name} onChange={updateCreate('name')} className="rounded-xl border border-line px-3 py-2 text-sm" />
            <textarea required minLength={5} placeholder="Descripción" value={createForm.description} onChange={updateCreate('description')} className="min-h-24 rounded-xl border border-line px-3 py-2 text-sm" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input required type="number" min={0} placeholder="Precio" value={createForm.price} onChange={updateCreate('price')} className="rounded-xl border border-line px-3 py-2 text-sm" />
              <input required type="number" min={0} placeholder="Stock" value={createForm.stock} onChange={updateCreate('stock')} className="rounded-xl border border-line px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Categoría" value={createForm.category} onChange={updateCreate('category')} className="rounded-xl border border-line px-3 py-2 text-sm" />
              <input placeholder="Subcategoría" value={createForm.subCategory} onChange={updateCreate('subCategory')} className="rounded-xl border border-line px-3 py-2 text-sm" />
            </div>
            <input type="number" min={0} max={100} placeholder="Descuento %" value={createForm.discountPercent} onChange={updateCreate('discountPercent')} className="rounded-xl border border-line px-3 py-2 text-sm" />
            <input type="file" multiple accept="image/*" onChange={(e) => setCreateFiles(e.target.files || [])} className="rounded-xl border border-line px-3 py-2 text-sm" />
            <button className="rounded-full bg-brand py-2.5 text-sm font-bold text-white hover:bg-brand-dark">Crear producto</button>
          </form>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Actualizar producto</h2>
          <select value={selectedId} onChange={(e) => selectProduct(e.target.value)} className="mt-4 w-full rounded-xl border border-line px-3 py-2 text-sm">
            <option value="">Selecciona un producto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name} · {formatCLP(p.price)}</option>
            ))}
          </select>

          {selectedProduct ? (
            <form className="mt-4 grid gap-3" onSubmit={updateProduct}>
              <input required placeholder="Nombre" value={editForm.name} onChange={updateEdit('name')} className="rounded-xl border border-line px-3 py-2 text-sm" />
              <textarea required minLength={5} placeholder="Descripción" value={editForm.description} onChange={updateEdit('description')} className="min-h-24 rounded-xl border border-line px-3 py-2 text-sm" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input required type="number" min={0} placeholder="Precio" value={editForm.price} onChange={updateEdit('price')} className="rounded-xl border border-line px-3 py-2 text-sm" />
                <input required type="number" min={0} placeholder="Stock" value={editForm.stock} onChange={updateEdit('stock')} className="rounded-xl border border-line px-3 py-2 text-sm" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Categoría" value={editForm.category} onChange={updateEdit('category')} className="rounded-xl border border-line px-3 py-2 text-sm" />
                <input placeholder="Subcategoría" value={editForm.subCategory} onChange={updateEdit('subCategory')} className="rounded-xl border border-line px-3 py-2 text-sm" />
              </div>
              <input type="number" min={0} max={100} placeholder="Descuento %" value={editForm.discountPercent} onChange={updateEdit('discountPercent')} className="rounded-xl border border-line px-3 py-2 text-sm" />
              <input type="file" multiple accept="image/*" onChange={(e) => setEditFiles(e.target.files || [])} className="rounded-xl border border-line px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-xs text-ink/70">
                <input type="checkbox" checked={replaceImages} onChange={(e) => setReplaceImages(e.target.checked)} />
                Reemplazar imágenes existentes (removeExistingImages)
              </label>
              <div className="flex gap-2">
                <button className="flex-1 rounded-full bg-accent py-2.5 text-sm font-bold text-white hover:bg-orange-600">Guardar cambios</button>
                <button type="button" onClick={() => removeProduct(selectedId)} className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">
                  Eliminar
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-4 text-sm text-ink/60">Selecciona un producto para editarlo.</p>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Actualizar estado de orden</h2>
        <p className="mt-1 text-sm text-ink/70">Si tu API solo expone órdenes del usuario actual, aquí puedes cambiar estado por ID directo.</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]" onSubmit={patchOrderStatus}>
          <input required placeholder="ID de orden" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="rounded-xl border border-line px-3 py-2 text-sm" />
          <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="rounded-xl border border-line px-3 py-2 text-sm">
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="DESPACHADO">DESPACHADO</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
          <button className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
            Actualizar
          </button>
        </form>
      </section>
    </div>
  )
}
