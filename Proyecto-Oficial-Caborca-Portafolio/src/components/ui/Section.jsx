// Section Component - Componente base para secciones
const Section = ({ 
  children, 
  className = '', 
  padding = 'default',
  background = 'transparent',
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'py-8 sm:py-12',
    default: 'py-12 sm:py-16 lg:py-20',
    lg: 'py-16 sm:py-20 lg:py-24',
    xl: 'py-20 sm:py-28 lg:py-36'
  }
  
  const backgrounds = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    light: 'bg-gray-50',
    caborca: 'bg-caborca-cafe text-white',
    beige: 'bg-stone-100'
  }
  
  const classes = `${paddings[padding]} ${backgrounds[background]} ${className}`
  
  return (
    <section className={classes} {...props}>
      {children}
    </section>
  )
}

export default Section