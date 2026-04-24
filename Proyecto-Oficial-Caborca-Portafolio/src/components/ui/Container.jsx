// Container Component - Componente base para contenedores
const Container = ({ children, size = 'default', className = '' }) => {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full'
  }
  
  const classes = `container mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default Container