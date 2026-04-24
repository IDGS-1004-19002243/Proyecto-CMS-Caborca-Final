import React from 'react'

export const Container = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 ${className}`}>{children}</div>
)

export const Section = ({ children, padding = 'md', className = '' }) => {
  const map = { sm: 'py-6', md: 'py-10', lg: 'py-16' }
  return <section className={`${map[padding] || map.md} ${className}`}>{children}</section>
}

export default Container
