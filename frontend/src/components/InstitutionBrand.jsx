export function InstitutionLogo({ size = 'md', className = '' }) {
  return (
    <div className={`institution-logo institution-logo-${size} ${className}`} aria-label="Institution crest">
      <img src="/institution-logo.png" alt="" aria-hidden="true" />
    </div>
  )
}

export function InstitutionBrand({ title = 'RMS Portal', subtitle = 'Research Management System', size = 'md' }) {
  return (
    <div className={`institution-brand institution-brand-${size}`}>
      <InstitutionLogo size={size} />
      <div className="institution-brand-text">
        <span className="institution-brand-title">{title}</span>
        <span className="institution-brand-subtitle">{subtitle}</span>
      </div>
    </div>
  )
}
