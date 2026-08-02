import { useState } from 'react'
import toast from 'react-hot-toast'

/* ── Publication Types ── */
const PUB_TYPES = [
  'Conference Proceeding',
  'Journal Publishing',
  'Chapters',
  'Books Authored',
  'Books Edited',
  'Patent',
  'Copy Rights',
]

const TYPE_ICONS = {
  'Conference Proceeding': '🏛️',
  'Journal Publishing': '📄',
  'Chapters': '📖',
  'Books Authored': '📚',
  'Books Edited': '✏️',
  'Patent': '⚙️',
  'Copy Rights': '©️',
}

const initialPubs = [
  { id: 1, scholarName: 'Alex Thompson', scholarId: 'SCH-2024-001', title: 'Optimization of Neural Networks', journal: 'IEEE Transactions on Pattern Analysis', indexType: 'SCI', issue: 'Vol. 45, No. 2, pp. 120-135', status: 'Pending', pubType: 'Journal Publishing' },
  { id: 2, scholarName: 'Sarah Mitchell', scholarId: 'SCH-2023-452', title: 'Sustainable Energy Systems', journal: 'Nature Energy', indexType: 'Scopus', issue: 'Article 2024.11', status: 'Approved', pubType: 'Journal Publishing' },
  { id: 3, scholarName: 'David Wilson', scholarId: 'SCH-2024-118', title: 'Advanced Materials for Energy Storage', journal: 'Material Research Express', indexType: 'Other', issue: 'Conf. ID 99312', status: 'Pending', pubType: 'Conference Proceeding' },
]

/* ── Default form state ── */
const defaultForm = () => ({
  pubType: 'Conference Proceeding',
  title: '', year: '', status: 'Published', doi: '', url: '',
  scholarName: '', scholarId: '',
  // Conference
  conferenceName: '', conferenceLocation: '', pages: '', proceedingsPublisher: '', indexed: 'Scopus',
  // Journal
  journalName: '', volume: '', issue: '', impactFactor: '', journalIndexed: 'SCI', issn: '',
  // Chapter
  bookTitle: '', chapterNo: '', chapterPublisher: '', chapterISBN: '', chapterEditors: '', chapterPages: '',
  // Books Authored
  bookAuthoredPublisher: '', bookAuthoredISBN: '', bookAuthoredEdition: '', bookAuthoredPages: '',
  // Books Edited
  bookEditedPublisher: '', bookEditedISBN: '', bookEditedEdition: '',
  // Patent
  patentNumber: '', patentOffice: '', patentFilingDate: '', patentGrantDate: '', patentStatus: 'Filed', inventors: '',
  // Copy Rights
  copyrightNumber: '', copyrightOffice: '', copyrightDate: '', copyrightNature: '',
})

function typeDescription(type) {
  const desc = {
    'Conference Proceeding': 'Papers presented at academic conferences',
    'Journal Publishing': 'Articles in peer-reviewed journals (SCI, Scopus…)',
    'Chapters': 'Chapters contributed to edited books',
    'Books Authored': 'Full books written and authored',
    'Books Edited': 'Books edited/compiled from multiple authors',
    'Patent': 'Inventions filed or granted as patents',
    'Copy Rights': 'Registered copyrights for creative/IP works',
  }
  return desc[type] || ''
}

/* ═══════════════════════════════════════════════
   Add Publication Modal
═══════════════════════════════════════════════ */
function AddPublicationModal({ onClose, onSave }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(defaultForm())

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const inp = (label, key, props = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-control" value={form[key]} onChange={e => set(key, e.target.value)} {...props} />
    </div>
  )
  const sel = (label, key, options) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-control form-select" value={form[key]} onChange={e => set(key, e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Please enter a title'); return }
    if (!form.year) { toast.error('Please enter the year'); return }
    if (!form.scholarName.trim()) { toast.error('Please enter scholar name'); return }
    onSave(form)
  }

  /* ── Step 1: Type Selector ── */
  if (step === 1) {
    return (
      <div className="modal-backdrop">
        <div className="modal" style={{ maxWidth: 620 }}>
          <div className="modal-header">
            <span className="modal-title">Add Publication — Select Type</span>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Choose the type of publication to add. Each type has its own specific fields.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {PUB_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => { set('pubType', type); setStep(2) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 18px', border: '2px solid var(--border)',
                    borderRadius: 'var(--radius-md)', background: 'var(--bg-card)',
                    cursor: 'pointer', textAlign: 'left', transition: '0.2s',
                    fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = '#F5F3FF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                >
                  <span style={{ fontSize: '26px' }}>{TYPE_ICONS[type]}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>{type}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{typeDescription(type)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Step 2: Form ── */
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 760 }}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>{TYPE_ICONS[form.pubType]}</span>
            <div>
              <div className="modal-title" style={{ color: '#fff' }}>Add Publication</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{form.pubType}</div>
            </div>
          </div>
          <button className="modal-close" style={{ color: '#fff' }} onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{ marginBottom: '18px' }}>
            <button onClick={() => setStep(1)} style={{ fontSize: '12.5px', color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              ← Change Publication Type
            </button>
          </div>

          {/* Scholar fields (always shown) */}
          <div className="grid-2" style={{ marginBottom: '8px' }}>
            {inp('Scholar Name *', 'scholarName', { placeholder: 'Full name of the scholar' })}
            {inp('Scholar ID', 'scholarId', { placeholder: 'e.g. SCH-2024-001' })}
          </div>

          {/* ─── CONFERENCE PROCEEDING ─── */}
          {form.pubType === 'Conference Proceeding' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Paper Title *</label>
                <input className="form-control" placeholder="Full title of the paper" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Conference Name *</label>
                <input className="form-control" placeholder="e.g. IEEE ICCV 2024, NeurIPS 2024" value={form.conferenceName} onChange={e => set('conferenceName', e.target.value)} />
              </div>
              {inp('Proceedings Publisher', 'proceedingsPublisher', { placeholder: 'e.g. IEEE, ACM, Springer' })}
              {inp('Conference Location', 'conferenceLocation', { placeholder: 'e.g. Paris, France' })}
              {inp('Publication Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('Page Numbers', 'pages', { placeholder: 'e.g. 123–130' })}
              {inp('DOI', 'doi', { placeholder: '10.xxxx/xxxxx' })}
              {inp('Paper URL', 'url', { placeholder: 'https://...' })}
              {sel('Indexing', 'indexed', ['Scopus', 'SCI', 'UGC Care', 'DBLP', 'Other'])}
              {sel('Status', 'status', ['Published', 'Accepted', 'Under Review', 'Draft'])}
            </div>
          )}

          {/* ─── JOURNAL PUBLISHING ─── */}
          {form.pubType === 'Journal Publishing' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Article Title *</label>
                <input className="form-control" placeholder="Full title of the article" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Journal Name *</label>
                <input className="form-control" placeholder="e.g. IEEE Transactions on Neural Networks" value={form.journalName} onChange={e => set('journalName', e.target.value)} />
              </div>
              {inp('ISSN', 'issn', { placeholder: 'e.g. 1234-5678' })}
              {inp('Impact Factor', 'impactFactor', { type: 'number', step: '0.01', placeholder: '3.5' })}
              {inp('Volume', 'volume', { placeholder: 'e.g. 45' })}
              {inp('Issue / Number', 'issue', { placeholder: 'e.g. 2' })}
              {inp('Page Numbers', 'pages', { placeholder: 'e.g. 120–135' })}
              {inp('Publication Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('DOI', 'doi', { placeholder: '10.xxxx/xxxxx' })}
              {sel('Indexing', 'journalIndexed', ['SCI', 'SCI-E', 'Scopus', 'UGC Care', 'ESCI', 'PubMed', 'Other'])}
              {sel('Status', 'status', ['Published', 'Accepted', 'Under Review', 'Draft', 'Revision Submitted'])}
            </div>
          )}

          {/* ─── CHAPTERS ─── */}
          {form.pubType === 'Chapters' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Chapter Title *</label>
                <input className="form-control" placeholder="Title of the chapter" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Book Title *</label>
                <input className="form-control" placeholder="Title of the book containing this chapter" value={form.bookTitle} onChange={e => set('bookTitle', e.target.value)} />
              </div>
              {inp('Chapter Number', 'chapterNo', { placeholder: 'e.g. Chapter 4' })}
              {inp('Page Numbers', 'chapterPages', { placeholder: 'e.g. 75–98' })}
              {inp('Publisher *', 'chapterPublisher', { placeholder: 'e.g. Springer, Elsevier, Wiley' })}
              {inp('ISBN', 'chapterISBN', { placeholder: 'e.g. 978-3-030-12345-6' })}
              {inp('Editor(s)', 'chapterEditors', { placeholder: 'Names of book editors' })}
              {inp('Publication Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('DOI / URL', 'doi', { placeholder: '10.xxxx/xxxxx' })}
              {sel('Status', 'status', ['Published', 'Accepted', 'Under Review', 'Draft'])}
            </div>
          )}

          {/* ─── BOOKS AUTHORED ─── */}
          {form.pubType === 'Books Authored' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Book Title *</label>
                <input className="form-control" placeholder="Full title of the book" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              {inp('Publisher *', 'bookAuthoredPublisher', { placeholder: 'e.g. Springer, CRC Press, Oxford University Press' })}
              {inp('ISBN', 'bookAuthoredISBN', { placeholder: 'e.g. 978-3-030-12345-6' })}
              {inp('Edition', 'bookAuthoredEdition', { placeholder: 'e.g. 1st, 2nd' })}
              {inp('Total Pages', 'bookAuthoredPages', { placeholder: 'e.g. 320' })}
              {inp('Publication Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('DOI / URL', 'doi', { placeholder: '10.xxxx/xxxxx or https://...' })}
              {sel('Status', 'status', ['Published', 'Accepted', 'Under Review', 'In Press', 'Draft'])}
            </div>
          )}

          {/* ─── BOOKS EDITED ─── */}
          {form.pubType === 'Books Edited' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Book Title *</label>
                <input className="form-control" placeholder="Full title of the edited book" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              {inp('Publisher *', 'bookEditedPublisher', { placeholder: 'e.g. Springer, Elsevier, Wiley' })}
              {inp('ISBN', 'bookEditedISBN', { placeholder: 'e.g. 978-3-030-12345-6' })}
              {inp('Edition', 'bookEditedEdition', { placeholder: 'e.g. 1st, 2nd' })}
              {inp('Publication Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('DOI / URL', 'doi', { placeholder: '10.xxxx/xxxxx or https://...' })}
              {sel('Status', 'status', ['Published', 'Accepted', 'Under Review', 'In Press', 'Draft'])}
            </div>
          )}

          {/* ─── PATENT ─── */}
          {form.pubType === 'Patent' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Patent Title *</label>
                <input className="form-control" placeholder="Title of the invention" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              {inp('Patent Number', 'patentNumber', { placeholder: 'e.g. IN202341012345 / US11234567B2' })}
              {inp('Patent Office', 'patentOffice', { placeholder: 'e.g. Indian Patent Office, USPTO, EPO' })}
              {inp('Filing Date', 'patentFilingDate', { type: 'date' })}
              {inp('Grant Date', 'patentGrantDate', { type: 'date' })}
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Inventor(s)</label>
                <input className="form-control" placeholder="Names of all inventors, comma separated" value={form.inventors} onChange={e => set('inventors', e.target.value)} />
              </div>
              {inp('Application Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('Patent URL', 'url', { placeholder: 'https://...' })}
              {sel('Patent Status', 'patentStatus', ['Filed', 'Published', 'Granted', 'Abandoned', 'Under Examination'])}
            </div>
          )}

          {/* ─── COPY RIGHTS ─── */}
          {form.pubType === 'Copy Rights' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Title of Work *</label>
                <input className="form-control" placeholder="Title of the copyrighted work" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              {inp('Copyright Registration Number', 'copyrightNumber', { placeholder: 'e.g. SW-12345/2024' })}
              {inp('Issuing Office / Authority', 'copyrightOffice', { placeholder: 'e.g. Copyright Office, Ministry of Education, India' })}
              {inp('Registration Date', 'copyrightDate', { type: 'date' })}
              {inp('Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('URL / Reference', 'url', { placeholder: 'https://...' })}
              {sel('Nature of Work', 'copyrightNature', ['Software', 'Literary Work', 'Artistic Work', 'Musical Work', 'Dramatic Work', 'Database', 'Other'])}
              {sel('Status', 'status', ['Registered', 'Applied', 'Pending'])}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)', minWidth: 140 }}
            onClick={handleSave}
          >
            ＋ Add Publication
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   View Publication Modal
═══════════════════════════════════════════════ */
function ViewPublicationModal({ pub, onClose, onAction }) {
  if (!pub) return null
  const statusColor = { Approved: '#10B981', Verified: '#3B82F6', Pending: '#F59E0B' }
  const rows = [
    { label: 'Scholar Name', value: pub.scholarName },
    { label: 'Scholar ID', value: pub.scholarId },
    { label: 'Publication Type', value: pub.pubType || 'Journal Publishing' },
    { label: 'Journal / Conference', value: pub.journal },
    { label: 'Issue / Volume', value: pub.issue || '—' },
    { label: 'Index Type', value: pub.indexType },
    { label: 'Current Status', value: pub.status },
  ]
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 580 }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>{TYPE_ICONS[pub.pubType] || '📄'}</span>
            <div>
              <div className="modal-title" style={{ color: '#fff' }}>Publication Details</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{pub.pubType || 'Journal Publishing'}</div>
            </div>
          </div>
          <button className="modal-close" style={{ color: '#fff' }} onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: '28px' }}>
          {/* Title banner */}
          <div style={{ background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '20px', borderLeft: '4px solid #6C63FF' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6C63FF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Paper Title</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{pub.title}</div>
          </div>

          {/* Details grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ width: '160px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>{r.label}</div>
                <div style={{ flex: 1, fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {r.label === 'Current Status' ? (
                    <span style={{
                      padding: '3px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700,
                      background: statusColor[r.value] ? statusColor[r.value] + '22' : '#F1F5F9',
                      color: statusColor[r.value] || 'var(--text-secondary)',
                      border: `1.5px solid ${statusColor[r.value] || '#CBD5E1'}`,
                    }}>{r.value}</span>
                  ) : r.label === 'Index Type' ? (
                    <span className={`badge ${r.value === 'SCI' ? 'badge-warning' : r.value === 'Scopus' ? 'badge-info' : 'badge-gray'}`}>{r.value}</span>
                  ) : r.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { onAction(pub.id, 'Verified'); onClose() }}
          >
            ✅ Mark Verified
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}
            onClick={() => { onAction(pub.id, 'Approved'); onClose() }}
          >
            🏆 Approve
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════ */
export default function PublicationsReview() {
  const [pubs, setPubs] = useState(initialPubs)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [viewPub, setViewPub] = useState(null)

  const handleAction = (id, newStatus) => {
    setPubs(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    toast.success(`Publication ${newStatus === 'Approved' ? 'Approved' : 'Verified'}`)
  }

  const filtered = pubs.filter(p => {
    const matchesSearch = p.scholarName.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'All' || p.indexType === filterType
    return matchesSearch && matchesType
  })

  const handleSave = (form) => {
    const newPub = {
      id: Date.now(),
      scholarName: form.scholarName,
      scholarId: form.scholarId || 'SCH-NEW',
      title: form.title,
      journal: form.conferenceName || form.journalName || form.bookTitle || form.bookAuthoredPublisher || form.bookEditedPublisher || form.patentOffice || form.copyrightOffice || '—',
      indexType: form.indexed || form.journalIndexed || 'Other',
      issue: form.year ? `Year: ${form.year}` : '',
      status: 'Pending',
      pubType: form.pubType,
    }
    setPubs(prev => [newPub, ...prev])
    setShowModal(false)
    toast.success(`${form.pubType} added for review!`)
  }

  return (
    <div className="animate-fade">
      {showModal && <AddPublicationModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {viewPub && <ViewPublicationModal pub={viewPub} onClose={() => setViewPub(null)} onAction={handleAction} />}

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Publications Review</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Verify and approve scholar research publications for graduation credit</span>
        </div>
        <div className="topbar-actions">
          <button
            id="add-publication-supervisor-btn"
            className="btn btn-secondary btn-sm"
            style={{ marginRight: '8px' }}
            onClick={() => setShowModal(true)}
          >
            ＋ Add Publication
          </button>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }}>📥 Export Report</button>
        </div>
      </div>

      <div className="page-body">
        {/* KPI Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Submissions', value: pubs.length, sub: '+12%', icon: '📰', color: 'purple' },
            { label: 'Pending Review', value: pubs.filter(p => p.status === 'Pending').length, sub: 'Urgent', icon: '⏳', color: 'red' },
            { label: 'Scopus Indexed', value: pubs.filter(p => p.indexType === 'Scopus').length, sub: 'Verified', icon: '🏆', color: 'blue' },
            { label: 'SCI Indexed', value: pubs.filter(p => p.indexType === 'SCI').length, sub: 'High impact', icon: '⭐', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: '11px', marginTop: '2px' }} className={s.sub === 'Urgent' ? 'text-danger' : 'text-muted'}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                className="form-control"
                placeholder="Search papers or scholars..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'SCI', 'Scopus', 'Other'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === 'All' ? 'All' : type)}
                  className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-ghost'}`}
                  style={filterType === type ? { background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' } : {}}
                >
                  {type === 'All' ? 'All Types' : type}
                </button>
              ))}
            </div>

            <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--text-secondary)' }}>{filtered.length} publications</span>
          </div>

          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Paper Title</th>
                  <th>Journal / Conference</th>
                  <th>Type</th>
                  <th>Index Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar avatar-sm" style={{ background: '#6C63FF' }}>{p.scholarName.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.scholarName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.scholarId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13.5px', fontWeight: 600, maxWidth: '240px' }}>{p.title}</td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{p.journal}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.issue}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '18px' }} title={p.pubType || 'Journal Publishing'}>
                        {TYPE_ICONS[p.pubType] || '📄'}
                      </span>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '90px' }}>{p.pubType || 'Journal'}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.indexType === 'SCI' ? 'badge-warning' : p.indexType === 'Scopus' ? 'badge-info' : 'badge-gray'}`}>
                        {p.indexType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Verified' ? 'badge-info' : 'badge-warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleAction(p.id, 'Verified')}>Verify</button>
                        <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(90deg,#6C63FF,#4F46E5)' }} onClick={() => handleAction(p.id, 'Approved')}>Approve</button>
                        <button className="btn btn-ghost btn-sm" title="View Details" onClick={() => setViewPub(p)}>👁️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
