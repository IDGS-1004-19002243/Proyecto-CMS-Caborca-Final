import { Container } from './ui/index.jsx'

const Footer = () => {
  return (
    <footer className="bg-caborca-beige-suave border-t border-gray-300 pt-10 pb-0 mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-8 text-center md:text-left">
          <div>
            <img src="https://i0.wp.com/caborcaboots.com/wp-content/uploads/2023/07/Logo-Caborca-B_Mesa-de-trabajo-1-e1755802893697.png?resize=1536%2C534&ssl=1" alt="Caborca Boots" className="h-20 mb-3 mx-auto md:mx-0" />
            <p className="text-caborca-cafe text-xs leading-relaxed">Artesanía mexicana de lujo. Cada bota es una obra maestra hecha a mano con pasión y precisión.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-caborca-cafe text-sm">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-caborca-negro text-sm">
              <li><a href="/">Inicio</a></li>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-caborca-cafe text-sm">Más Información</h4>
            <ul className="space-y-2 text-caborca-negro text-sm">
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/responsabilidad-ambiental">Responsabilidad ambiental</a></li>
              <li><a href="/distribuidores">Distribuidores</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-caborca-cafe text-sm">Atención al Cliente</h4>
            <ul className="space-y-2 text-caborca-negro text-sm">
              <li>Política de privacidad</li>
              <li>Términos y condiciones</li>
              <li>Envíos</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-caborca-cafe">
          <p>© 2026 Caborca Boots. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white/80 transition">Facebook</a>
            <a href="#" className="hover:text-white/80 transition">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
