import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext.jsx'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const containerRef = useRef(null)

  useEffect(() => {
    // Animate left panel elements
    gsap.killTweensOf('.login-animate-left')
    gsap.fromTo(
      '.login-animate-left',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity' }
    )

    // Animate right panel elements
    gsap.killTweensOf('.login-animate-right')
    gsap.fromTo(
      '.login-animate-right',
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' }
    )
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert('Por favor, ponte en contacto con soporte técnico para restablecer tu contraseña: soporte@marquetazo.com')
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col lg:flex-row bg-surface overflow-hidden">
      {/* Left side: Premium Visual Panel (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden border-r border-slate-800">
        {/* Background decorative patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        {/* Ambient floating blobs */}
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-brand/10 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float pointer-events-none" />

        {/* Logo / Brand */}
        <div className="login-animate-left relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-brand-dark flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20">
            M
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Marquetazo
          </span>
        </div>

        {/* Dynamic Graphic Asset Container */}
        <div className="login-animate-left relative z-10 flex flex-col items-center justify-center flex-1 py-6">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 shadow-2xl flex items-center justify-center transition-all duration-300 hover:border-white/20">
            {/* Inner neon rings */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand/5 to-accent/5 opacity-50" />
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-accent/20 blur-sm animate-float-slow pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-brand/20 blur-sm animate-float pointer-events-none" />
            
            <img
              src="/login_illustration.png"
              alt="Marquetazo Market"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.35)] animate-float"
            />
          </div>
        </div>

        {/* Marketing Tagline */}
        <div className="login-animate-left relative z-10 space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-white">Tu mercado favorito, siempre cerca.</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Disfruta de la frescura y variedad que te encanta directamente en la puerta de tu hogar.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-surface min-h-screen relative">
        {/* Floating blobs for mobile screens */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand/5 rounded-full blur-3xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl lg:hidden pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile Logo (Only visible on medium/small screens) */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-brand-dark flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20">
              M
            </div>
            <span className="text-2xl font-black tracking-tight text-ink">
              Marquetazo
            </span>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="login-animate-right text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              ¡Hola de nuevo! 👋
            </h2>
            <p className="login-animate-right text-sm text-ink/60">
              Ingresa tus credenciales para acceder a tu cuenta.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="login-animate-right rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-800 flex items-start gap-3 shadow-sm">
              <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-animate-right space-y-6" onSubmit={onSubmit}>
            {/* Email Field */}
            <div className="group relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 mb-2 transition-colors group-focus-within:text-brand">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink/30 group-focus-within:text-brand transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-line rounded-2xl text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-sm group-hover:border-slate-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 transition-colors group-focus-within:text-brand">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink/30 group-focus-within:text-brand transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-line rounded-2xl text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-sm group-hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink/30 hover:text-ink/60 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-2xl bg-brand hover:bg-brand-dark py-4 text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Ingresando...</span>
                </>
              ) : (
                <>
                  <span>Ingresar</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="login-animate-right pt-2 border-t border-line text-center text-sm text-ink/75">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-brand hover:text-brand-dark hover:underline transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
