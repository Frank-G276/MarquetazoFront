import { useEffect, useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import { Line, Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import * as ordersApi from '../api/orders.js'
import * as productsApi from '../api/products.js'
import { formatCLP } from '../utils/money.js'
import { Pagination } from '../components/Pagination.jsx'

/* ── Reveal on scroll ── */
function useReveal(threshold = 0.12) {
	const ref = useRef(null)
	const [visible, setVisible] = useState(false)
	useEffect(() => {
		const el = ref.current
		if (!el) return
		const obs = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
			{ threshold }
		)
		obs.observe(el)
		return () => obs.disconnect()
	}, [threshold])
	return { ref, visible }
}

/* ── KPI Card ── */
function KpiCard({ label, value, delta, icon, valueRef, delay = 0 }) {
	const { ref, visible } = useReveal()
	return (
		<div
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
			className={`relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-700 hover:-translate-y-1.5 hover:shadow-md hover:border-brand/30
				${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
		>
			{/* Fondo decorativo */}
			<div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand/5 blur-2xl" />

			<div className="relative flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{label}</p>
					<p ref={valueRef} className="mt-2 text-2xl font-extrabold tracking-tight text-ink leading-none">{value}</p>
				</div>
				<div className="flex flex-col items-end gap-2 shrink-0">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/8 text-xl">{icon}</div>
					<span className={`text-[11px] font-bold ${delta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
						{delta >= 0 ? `+${delta}%` : `${delta}%`}
					</span>
				</div>
			</div>

			{/* Barra de acento inferior */}
			<div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-brand/0 via-brand/40 to-brand/0" />
		</div>
	)
}

/* ── Badge de estado ── */
function StatusBadge({ status }) {
	const s = String(status).toUpperCase()
	const map = {
		ENTREGADO: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
		DESPACHADO: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
		PENDIENTE: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
		CANCELADO: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
	}
	const cls = map[s] || 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
	const dot = {
		ENTREGADO: 'bg-emerald-500',
		DESPACHADO: 'bg-amber-500',
		PENDIENTE: 'bg-sky-500',
		CANCELADO: 'bg-rose-500',
	}
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${cls}`}>
			<span className={`h-1.5 w-1.5 rounded-full ${dot[s] || 'bg-slate-400'}`} />
			{status}
		</span>
	)
}

/* ── Sección con título ── */
function Section({ title, action, children, className = '' }) {
	const { ref, visible } = useReveal()
	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
		>
			{(title || action) && (
				<div className="mb-4 flex items-center justify-between">
					{title && <h2 className="text-sm font-extrabold uppercase tracking-widest text-ink/50">{title}</h2>}
					{action}
				</div>
			)}
			{children}
		</div>
	)
}

/* ══════════════ DASHBOARD ══════════════ */
export default function DashboardAdmin() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [orders, setOrders] = useState([])
	const [products, setProducts] = useState([])
	const kpiValueRefs = useRef([])
	const [currentPage, setCurrentPage] = useState(1)
	const ITEMS_PER_PAGE = 8

	const [salesChart, setSalesChart] = useState({ labels: [], datasets: [] })
	const [categoryChart, setCategoryChart] = useState({ labels: [], datasets: [] })

	const fetchData = async () => {
		setLoading(true)
		setError('')
		try {
			const [ordersData, productsData] = await Promise.all([
				ordersApi.getOrders(),
				productsApi.getProducts(),
			])
			setOrders(Array.isArray(ordersData) ? ordersData : [])
			setProducts(Array.isArray(productsData) ? productsData : [])
			buildSalesChart(ordersData || [])
			buildCategoryChart(productsData || [])
		} catch (err) {
			setError(err.message || 'No se pudieron cargar métricas')
		} finally {
			setLoading(false)
		}
	}

	const exportCsv = () => {
		try {
			const rows = (orders || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			if (!rows.length) return alert('No hay órdenes para exportar')
			const headers = ['id', 'createdAt', 'totalPrice', 'status', 'customerEmail']
			const csv = [headers.join(',')].concat(rows.map((o) => {
				const email = o?.shipping?.email || o?.email || o?.user?.email || o?.userEmail || ''
				return [o._id, new Date(o.createdAt).toISOString(), Number(o.totalPrice) || 0, String(o.status || ''), `"${email.replace(/"/g, '""')}"`].join(',')
			}))
			const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`
			document.body.appendChild(a)
			a.click()
			a.remove()
			URL.revokeObjectURL(url)
		} catch (err) {
			alert('Error al exportar CSV')
		}
	}

	useEffect(() => { fetchData() }, [])

	const metrics = useMemo(() => {
		const totalSalesWeek = salesChart.datasets?.[0]?.data?.reduce((a, b) => a + (Number(b) || 0), 0) || 0
		const ordersCount = orders.length || 0
		const customersSet = new Set()
		orders.forEach((o) => {
			const email = o?.shipping?.email || o?.email || o?.user?.email || o?.userEmail || o?.buyerEmail
			if (email) customersSet.add(String(email))
		})
		return {
			totalSalesWeek,
			ordersCount,
			customersCount: customersSet.size || 0,
			avgOrder: ordersCount ? orders.reduce((a, o) => a + (Number(o.totalPrice) || 0), 0) / ordersCount : 0,
		}
	}, [orders, salesChart])

	useEffect(() => {
		if (loading) return
		const toAnimate = [metrics.totalSalesWeek, metrics.ordersCount, metrics.customersCount, metrics.avgOrder]
		toAnimate.forEach((target, i) => {
			const el = kpiValueRefs.current[i]
			if (!el) return
			const obj = { v: 0 }
			gsap.to(obj, {
				v: Number(target) || 0,
				duration: 1.1,
				ease: 'power3.out',
				onUpdate: () => {
					el.innerText = (i === 0 || i === 3)
						? formatCLP(Math.round(obj.v))
						: Math.round(obj.v).toLocaleString('es-CL')
				},
			})
		})
	}, [loading, metrics])

	function buildSalesChart(ordersList) {
		const days = Array.from({ length: 7 }).map((_, i) => {
			const d = new Date()
			d.setDate(d.getDate() - (6 - i))
			return d
		})
		const labels = days.map((d) => d.toLocaleDateString('es-CL', { weekday: 'short' }))
		const data = days.map((day) => {
			const start = new Date(day); start.setHours(0, 0, 0, 0)
			const end = new Date(day); end.setHours(23, 59, 59, 999)
			return ordersList
				.filter((o) => { const c = new Date(o.createdAt); return c >= start && c <= end && String(o.status).toUpperCase() !== 'CANCELADO' })
				.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0)
		})
		setSalesChart({
			labels,
			datasets: [{
				label: 'Ventas (CLP)',
				data,
				borderColor: 'rgba(249,115,22,1)',
				backgroundColor: 'rgba(249,115,22,0.06)',
				tension: 0.4,
				fill: true,
				pointRadius: 4,
				pointBackgroundColor: 'rgba(249,115,22,1)',
				pointBorderColor: '#fff',
				pointBorderWidth: 2,
			}],
		})
	}

	function buildCategoryChart(productsList) {
		const map = new Map()
		productsList.forEach((p) => { const cat = p.category || 'Sin categoría'; map.set(cat, (map.get(cat) || 0) + 1) })
		const labels = Array.from(map.keys())
		const data = Array.from(map.values())
		const colors = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
		setCategoryChart({ labels, datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderWidth: 0, hoverOffset: 8 }] })
	}

	const lineOptions = {
		responsive: true, maintainAspectRatio: false,
		plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 10, titleFont: { size: 12 }, bodyFont: { size: 12 } } },
		scales: {
			x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } }, border: { display: false } },
			y: { grid: { color: 'rgba(148,163,184,0.1)', drawBorder: false }, ticks: { color: '#94a3b8', font: { size: 11 }, callback: (v) => formatCLP(v) }, border: { display: false } },
		},
	}

	const pieOptions = {
		responsive: true, maintainAspectRatio: false,
		plugins: {
			legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, borderRadius: 3, padding: 16, color: '#64748b', font: { size: 11 } } },
			tooltip: { backgroundColor: '#1e293b', padding: 10, bodyFont: { size: 12 } },
		},
	}

	const sortedOrders = useMemo(() => (orders || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [orders])
	const totalPages = Math.max(1, Math.ceil(sortedOrders.length / ITEMS_PER_PAGE))
	const pageItems = sortedOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

	return (
		<div className="min-h-screen bg-surface">

			{/* ── HERO ── */}
			<section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-16 text-white">
				{/* Dot grid */}
				<div className="pointer-events-none absolute inset-0 opacity-10"
					style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
				{/* Glows */}
				<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

				<div className="relative mx-auto max-w-6xl px-6">
					<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
						<div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">
								📊 Panel de control
							</span>
							<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
								Dashboard
								<span className="block text-white/40 text-lg font-semibold tracking-wide mt-0.5">administrador</span>
							</h1>
							<p className="mt-2 text-sm text-white/50 max-w-sm">Métricas en tiempo real · Estado de pedidos · Exportación de datos</p>
						</div>

						{/* Botones */}
						<div className="flex items-center gap-3">
							<button onClick={() => exportCsv()} className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20">Exportar CSV</button>
							<button onClick={() => fetchData()} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Actualizar</button>
						</div>
					</div>

					{/* Quick stats strip */}
					<div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
						{[
							{ label: 'Pedidos hoy', value: sortedOrders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length },
							{ label: 'Entregados', value: orders.filter(o => String(o.status).toUpperCase() === 'ENTREGADO').length },
							{ label: 'En tránsito', value: orders.filter(o => String(o.status).toUpperCase() === 'DESPACHADO').length },
							{ label: 'Cancelados', value: orders.filter(o => String(o.status).toUpperCase() === 'CANCELADO').length },
						].map(({ label, value }) => (
							<div key={label}>
								<p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{label}</p>
								<p className="mt-0.5 text-xl font-extrabold text-white">{value}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── CONTENIDO ── */}
			<div className="mx-auto max-w-6xl px-6 py-10 space-y-10">

				{/* Error */}
				{error && (
					<div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
						⚠ {error}
					</div>
				)}

				{/* KPIs */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<KpiCard label="Ventas (7 días)" value={formatCLP(Math.round(metrics.totalSalesWeek))} delta={0} icon="💸" valueRef={el => (kpiValueRefs.current[0] = el)} delay={0} />
					<KpiCard label="Pedidos totales" value={(metrics.ordersCount || 0).toLocaleString('es-CL')} delta={0} icon="🧾" valueRef={el => (kpiValueRefs.current[1] = el)} delay={80} />
					<KpiCard label="Clientes únicos" value={(metrics.customersCount || 0).toLocaleString('es-CL')} delta={0} icon="👥" valueRef={el => (kpiValueRefs.current[2] = el)} delay={160} />
					<KpiCard label="Ticket promedio" value={formatCLP(Math.round(metrics.avgOrder || 0))} delta={0} icon="📈" valueRef={el => (kpiValueRefs.current[3] = el)} delay={240} />
				</div>

				{/* Gráficos */}
				<div className="grid gap-6 lg:grid-cols-3">
					<Section title="Ventas — últimos 7 días" className="lg:col-span-2">
						<div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
							<div className="h-60">
								{loading
									? <div className="flex h-full items-center justify-center text-sm text-ink/40">Cargando...</div>
									: <Line data={salesChart} options={lineOptions} />
								}
							</div>
						</div>
					</Section>

					<Section title="Categorías de productos">
						<div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
							<div className="h-60 flex items-center justify-center">
								{loading
									? <div className="text-sm text-ink/40">Cargando...</div>
									: categoryChart.labels?.length
										? <Pie data={categoryChart} options={pieOptions} />
										: <p className="text-sm text-ink/40">Sin datos</p>
								}
							</div>
						</div>
					</Section>
				</div>

				{/* Tabla de pedidos */}
				<Section
					title="Pedidos recientes"
					action={
						<span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
							{orders.length} total
						</span>
					}
				>
					<div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-line bg-surface">
										<th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-ink/40">ID pedido</th>
										<th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-ink/40">Fecha</th>
										<th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-ink/40">Total</th>
										<th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-ink/40">Estado</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-line">
									{loading ? (
										Array.from({ length: 5 }).map((_, i) => (
											<tr key={i}>
												{Array.from({ length: 4 }).map((_, j) => (
													<td key={j} className="px-5 py-4">
														<div className="h-4 rounded-md bg-slate-100 animate-pulse" style={{ width: ['60%', '80%', '50%', '70%'][j] }} />
													</td>
												))}
											</tr>
										))
									) : pageItems.length === 0 ? (
										<tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-ink/40">Sin pedidos</td></tr>
									) : (
										pageItems.map((o) => (
											<tr key={o._id} className="transition-colors duration-150 hover:bg-brand/[0.02]">
												<td className="px-5 py-4">
													<span className="font-mono text-xs font-bold text-ink/60 bg-slate-100 rounded-md px-2 py-0.5">
														#{o._id.slice(-6).toUpperCase()}
													</span>
												</td>
												<td className="px-5 py-4 text-ink/70 text-xs">
													{new Date(o.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
													<span className="block text-ink/40 text-[10px]">
														{new Date(o.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
													</span>
												</td>
												<td className="px-5 py-4 text-right font-bold text-ink">
													{formatCLP(Number(o.totalPrice) || 0)}
												</td>
												<td className="px-5 py-4">
													<StatusBadge status={o.status} />
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Footer de paginación integrado */}
						{!loading && totalPages > 1 && (
							<div className="border-t border-line px-5 py-3">
								<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
							</div>
						)}
					</div>
				</Section>

			</div>
		</div>
	)
}