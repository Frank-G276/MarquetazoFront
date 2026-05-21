import React from 'react'

/**
 * Componente de paginación altamente estilizado y responsivo.
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Página actual (1-indexed)
 * @param {number} props.totalPages - Total de páginas
 * @param {function} props.onPageChange - Callback al cambiar de página
 */
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Genera el arreglo de páginas con puntos suspensivos si es necesario
  const getPages = () => {
    const pages = []
    const range = 1 // Cantidad de páginas a mostrar a los lados de la página activa

    // Siempre incluir la primera página
    pages.push(1)

    const start = Math.max(2, currentPage - range)
    const end = Math.min(totalPages - 1, currentPage + range)

    if (start > 2) {
      pages.push('ellipsis-start')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis-end')
    }

    // Siempre incluir la última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPages()

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Paginación de resultados">
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 items-center justify-center rounded-xl border border-line bg-white px-3 text-xs sm:text-sm font-semibold text-ink/75 transition-all hover:bg-slate-50 hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm active:scale-95"
      >
        <span className="mr-1">←</span> Anterior
      </button>

      {/* Páginas numéricas */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 w-8 sm:w-10 items-center justify-center text-xs sm:text-sm font-semibold text-ink/40 select-none"
              >
                ...
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                isActive
                  ? 'bg-brand text-white border border-brand'
                  : 'border border-line bg-white text-ink/75 hover:bg-slate-50 hover:text-ink'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Botón Siguiente */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 items-center justify-center rounded-xl border border-line bg-white px-3 text-xs sm:text-sm font-semibold text-ink/75 transition-all hover:bg-slate-50 hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm active:scale-95"
      >
        Siguiente <span className="ml-1">→</span>
      </button>
    </nav>
  )
}
