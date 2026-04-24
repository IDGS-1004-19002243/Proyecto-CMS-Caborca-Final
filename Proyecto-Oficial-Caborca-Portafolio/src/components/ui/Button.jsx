// Button Component - Componente base para botones
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-caborca-cafe text-white hover:bg-caborca-negro focus:ring-caborca-cafe',
    secondary: 'bg-white text-caborca-cafe border border-caborca-cafe hover:bg-caborca-cafe hover:text-white focus:ring-caborca-cafe',
    outline: 'border border-white text-white hover:bg-white hover:text-caborca-cafe focus:ring-white'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button