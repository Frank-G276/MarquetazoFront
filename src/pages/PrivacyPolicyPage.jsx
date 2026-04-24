export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Privacidad</h1>
      <div className="mt-6 space-y-3 rounded-2xl border border-line bg-white p-6 text-sm text-ink/80">
        <p>Tus datos se usan únicamente para autenticación, despacho y gestión de pedidos.</p>
        <p>La sesión se maneja con cookie httpOnly emitida por el backend.</p>
        <p>No compartimos información personal con terceros ajenos al proyecto.</p>
      </div>
    </div>
  )
}
