import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from './ui/index.jsx'

const Header = ({ transparent = false, className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { key: 'botas', name: 'BOTAS', href: '/catalogo-hombre' },
    { key: 'nosotros', name: 'NOSOTROS', href: '/nosotros' },
    { key: 'responsabilidad', name: 'RESPONSABILIDAD AMBIENTAL', href: '/responsabilidad-ambiental' },
    { key: 'distribuidores', name: 'DISTRIBUIDORES', href: '/distribuidores' },
    { key: 'contacto', name: 'CONTACTO', href: '/contacto' }
  ]

  const headerClasses = transparent
    ? `fixed top-0 w-full z-[100] bg-black/20 backdrop-blur-sm ${className}`
    : `fixed top-0 w-full z-[100] bg-caborca-cafe shadow-sm ${className}`

  return (
    <>
      <header className={headerClasses}>
        <Container>
          <div className="py-3 lg:py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/">
                <img src="https://i0.wp.com/caborcaboots.com/wp-content/uploads/2023/07/Logo-Caborca-B_Mesa-de-trabajo-1-e1755802893697.png?resize=1536%2C534&ssl=1" alt="Caborca" className="h-10 lg:h-12 w-auto" />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-8 text-xs xl:text-sm font-medium tracking-wider">
              {navigationItems.map(item => (
                <Link key={item.key} to={item.href} className="text-white hover:text-gray-200 transition-colors">
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex gap-3">
                <button className="hover:opacity-75 transition-opacity" title="Español">🇲🇽</button>
                <button className="hover:opacity-75 transition-opacity" title="English">🇺🇸</button>
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white hover:text-gray-200 transition-colors" aria-label="Toggle mobile menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Simple mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-caborca-cafe border-t border-gray-600 pt-20">
          <Container>
            <nav className="py-4 space-y-4">
              {navigationItems.map(item => (
                <Link key={item.key} to={item.href} className="block text-white font-medium tracking-wider py-2" onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </>
  )
}

export default Header
