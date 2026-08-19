import { apiFetch } from '../../utils/api'
import { useState } from 'react'
import toast from 'react-hot-toast'

/* ── Sample data ── */
const myPubs = [
  { id: 1, title: 'Deep Learning for Medical Image Classification', venue: 'IEEE Access', year: 2023, type: 'Journal Publishing', indexed: 'SCI', status: 'Published', citations: 12, impactFactor: 3.9, doi: '10.1109/ACCESS.2023.123456' },
  { id: 2, title: 'AI-Driven Diagnostics: A Comprehensive Survey', venue: 'ICML 2023', year: 2023, type: 'Conference Proceeding', indexed: 'Scopus', status: 'Published', citations: 5, impactFactor: null, doi: '10.5120/ijca2023923001' },
  { id: 3, title: 'Federated Learning Approaches in Clinical Settings', venue: 'Springer LNCS', year: 2024, type: 'Chapters', indexed: 'Scopus', status: 'Under Review', citations: 0, impactFactor: null, doi: '' },
  { id: 4, title: 'Explainable AI for Diagnostic Decision Support', venue: 'Expert Systems with Applications', year: 2024, type: 'Journal Publishing', indexed: 'SCI', status: 'Draft', citations: 0, impactFactor: 8.5, doi: '' },
]

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

const FILTER_TYPES = ['All', ...PUB_TYPES]
const STATUS_CLS = { Published: 'badge-success', 'Under Review': 'badge-warning', Draft: 'badge-gray', Accepted: 'badge-info' }

/* ── Default form state per type ── */
const defaultForm = () => ({
  pubType: 'Conference Proceeding',
  // Common
  title: '',
  year: '',
  status: 'Published',
  doi: '',
  url: '',
  // Conference Proceeding
  conferenceName: '',
  conferenceLocation: '',
  pages: '',
  proceedingsPublisher: '',
  indexed: 'Scopus',
  // Journal
  journalName: '',
  volume: '',
  issue: '',
  impactFactor: '',
  journalIndexed: 'SCI',
  issn: '',
  // Chapter
  bookTitle: '',
  chapterNo: '',
  chapterPublisher: '',
  chapterISBN: '',
  chapterEditors: '',
  chapterPages: '',
  // Books Authored
  bookAuthoredTitle: '',
  bookAuthoredPublisher: '',
  bookAuthoredISBN: '',
  bookAuthoredEdition: '',
  bookAuthoredPages: '',
  // Books Edited
  bookEditedTitle: '',
  bookEditedPublisher: '',
  bookEditedISBN: '',
  bookEditedEdition: '',
  // Patent
  patentTitle: '',
  patentNumber: '',
  patentOffice: '',
  patentFilingDate: '',
  patentGrantDate: '',
  patentStatus: 'Filed',
  inventors: '',
  // Copy Rights
  copyrightTitle: '',
  copyrightNumber: '',
  copyrightOffice: '',
  copyrightDate: '',
  copyrightNature: '',
})

/* ═══════════════════════════════════════════════
   Add Publication Modal
═══════════════════════════════════════════════ */
function AddPublicationModal({ onClose, onSave }) {
  const [step, setStep] = useState(1)          // 1 = select type, 2 = fill form
  const [form, setForm] = useState(defaultForm())

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const inp = (label, key, props = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        {...props}
      />
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
    onSave(form)
  }

  /* ── Type Selector Step ── */
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
              Choose the type of publication you want to add. Each type has its own specific fields.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {PUB_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => { set('pubType', type); setStep(2) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 18px', border: `2px solid ${form.pubType === type ? '#10B981' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)', background: form.pubType === type ? '#F0FDF4' : 'var(--bg-card)',
                    cursor: 'pointer', textAlign: 'left', transition: '0.2s',
                    fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#F0FDF4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                >
                  <span style={{ fontSize: '26px' }}>{TYPE_ICONS[type]}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>{type}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
                      {typeDescription(type)}
                    </div>
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

  /* ── Form Step ── */
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 760 }}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
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
          {/* Change type link */}
          <div style={{ marginBottom: '18px' }}>
            <button
              onClick={() => setStep(1)}
              style={{ fontSize: '12.5px', color: '#10B981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              ← Change Publication Type
            </button>
          </div>

          {/* ─── CONFERENCE PROCEEDING ─── */}
          {form.pubType === 'Conference Proceeding' && (
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Paper Title *</label>
                <input className="form-control" placeholder="Full title of the paper" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              {inp('Conference Name *', 'conferenceName', { placeholder: 'e.g. IEEE ICCV 2024, NeurIPS 2024', style: { gridColumn: '1/-1' } })}
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
                {inp('Journal Name *', 'journalName', { placeholder: 'e.g. IEEE Transactions on Neural Networks, Nature Energy' })}
              </div>
              {inp('ISSN', 'issn', { placeholder: 'e.g. 1234-5678' })}
              {inp('Impact Factor', 'impactFactor', { type: 'number', step: '0.01', placeholder: '3.5' })}
              {inp('Volume', 'volume', { placeholder: 'e.g. 45' })}
              {inp('Issue / Number', 'issue', { placeholder: 'e.g. 2' })}
              {inp('Page Numbers', 'pages', { placeholder: 'e.g. 120–135' })}
              {inp('Publication Year *', 'year', { type: 'number', placeholder: '2024', min: '2000', max: '2030' })}
              {inp('DOI', 'doi', { placeholder: '10.xxxx/xxxxx' })}
              {inp('Journal URL', 'url', { placeholder: 'https://...' })}
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
                {inp('Book Title *', 'bookTitle', { placeholder: 'Title of the book in which the chapter appears' })}
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
                {inp('Inventor(s)', 'inventors', { placeholder: 'Names of all inventors, comma separated' })}
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
            style={{ background: 'linear-gradient(90deg,#10B981,#059669)', minWidth: 140 }}
            onClick={handleSave}
          >
            ＋ Add Publication
          </button>
        </div>
      </div>
    </div>
  )
}

function typeDescription(type) {
  const desc = {
    'Conference Proceeding': 'Papers presented at academic conferences',
    'Journal Publishing': 'Articles in peer-reviewed journals (SCI, Scopus…)',
    'Chapters': 'Chapters contributed to edited books',
    'Books Authored': 'Full books written and authored by you',
    'Books Edited': 'Books edited/compiled from multiple authors',
    'Patent': 'Inventions filed or granted as patents',
    'Copy Rights': 'Registered copyrights for creative/IP works',
  }
  return desc[type] || ''
}

/* ═══════════════════════════════════════════════
   Edit Publication Modal
═══════════════════════════════════════════════ */
function EditPublicationModal({ pub, onClose, onUpdate }) {
  const [title, setTitle] = useState(pub.title)
  const [venue, setVenue] = useState(pub.venue)
  const [year, setYear] = useState(pub.year || '')
  const [doi, setDoi] = useState(pub.doi || '')
  const [indexed, setIndexed] = useState(pub.indexed || 'Scopus')
  const [impactFactor, setImpactFactor] = useState(pub.impactFactor || '')
  const [status, setStatus] = useState(pub.status || 'Published')

  const handleUpdate = () => {
    if (!title.trim()) { toast.error('Title is required'); return }
    onUpdate(pub.id, { title, venue, year: parseInt(year), doi, indexed, impactFactor: impactFactor ? parseFloat(impactFactor) : null, status })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>{TYPE_ICONS[pub.type] || '📄'}</span>
            <div>
              <div className="modal-title" style={{ color: '#fff' }}>Edit Publication</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{pub.type}</div>
            </div>
          </div>
          <button className="modal-close" style={{ color: '#fff' }} onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: '24px 28px' }}>
          <div className="grid-2">
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Title *</label>
              <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Publication title" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Journal / Conference / Venue</label>
              <input className="form-control" value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. IEEE Access, ICML 2024" />
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input type="number" className="form-control" value={year} onChange={e => setYear(e.target.value)} placeholder="2024" min="2000" max="2030" />
            </div>
            <div className="form-group">
              <label className="form-label">DOI</label>
              <input className="form-control" value={doi} onChange={e => setDoi(e.target.value)} placeholder="10.xxxx/xxxxx" />
            </div>
            <div className="form-group">
              <label className="form-label">Indexing</label>
              <select className="form-control form-select" value={indexed} onChange={e => setIndexed(e.target.value)}>
                {['SCI', 'SCI-E', 'Scopus', 'UGC Care', 'ESCI', 'PubMed', 'DBLP', 'Other'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Impact Factor</label>
              <input type="number" step="0.01" className="form-control" value={impactFactor} onChange={e => setImpactFactor(e.target.value)} placeholder="e.g. 3.5" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Status</label>
              <select className="form-control form-select" value={status} onChange={e => setStatus(e.target.value)}>
                {['Published', 'Accepted', 'Under Review', 'Draft', 'Revision Submitted', 'Filed', 'Granted', 'Registered'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ background: 'linear-gradient(90deg,#10B981,#059669)', minWidth: 130 }}
            onClick={handleUpdate}
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════ */
export default function ScholarPublications() {
  const [pubs, setPubs] = useState([])
  const [filterType, setFilterType] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editPub, setEditPub] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem('rms_token')
      const storedUser = localStorage.getItem('rms_user')
      const userObj = storedUser ? JSON.parse(storedUser) : null
      const scholarId = userObj?.id || userObj?._id || ''

      const response = await apiFetch(`/api/publication?scholarId=${scholarId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      
      const mapped = data.map(p => ({
        id: p.id || p._id,
        title: p.title,
        venue: p.journal || '—',
        year: p.date ? new Date(p.date).getFullYear() : '—',
        type: p.pubType || 'Journal Publishing',
        indexed: p.indexed || '—',
        status: p.status || 'Published',
        citations: p.citations || 0,
        impactFactor: p.impactFactor || null,
        doi: p.doi || '',
        date: p.date || '',
        fileUrl: p.fileUrl || ''
      }))
      setPubs(mapped)
    } catch (err) {
      toast.error('Failed to load publications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications()
  }, [])

  const handleSave = async (form) => {
    try {
      const token = localStorage.getItem('rms_token')
      const payload = {
        title: form.title,
        journal: form.journalName || form.conferenceName || form.bookTitle || form.bookAuthoredTitle || form.bookEditedTitle || form.patentOffice || form.copyrightOffice || '—',
        pubType: form.pubType,
        doi: form.doi || '',
        status: form.status || form.patentStatus || 'Published',
        date: form.year ? `${form.year}-01-01` : new Date().toISOString().slice(0, 10)
      }

      const response = await apiFetch('/api/publication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error()
      toast.success(`${form.pubType} added successfully!`)
      setShowModal(false)
      fetchPublications()
    } catch (err) {
      toast.error('Failed to save publication')
    }
  }

  const handleUpdate = async (id, changes) => {
    try {
      const token = localStorage.getItem('rms_token')
      const payload = {
        title: changes.title,
        journal: changes.venue || changes.journal || changes.journalName || changes.conferenceName,
        pubType: changes.type || changes.pubType,
        doi: changes.doi || '',
        status: changes.status || 'Published'
      }

      const response = await apiFetch(`/api/publication/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error()
      toast.success('Publication updated!')
      setEditPub(null)
      fetchPublications()
    } catch (err) {
      toast.error('Failed to update publication')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        const token = localStorage.getItem('rms_token')
        const response = await apiFetch(`/api/publication/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error()
        toast.success('Publication deleted successfully')
        fetchPublications()
      } catch (err) {
        toast.error('Failed to delete publication')
      }
    }
  }

  const filtered = pubs.filter(p => filterType === 'All' || p.type === filterType)

  /* ── Stats ── */
  const stats = [
    { label: 'Total Publications', value: pubs.length, icon: '📰', color: 'purple' },
    { label: 'Published', value: pubs.filter(p => p.status === 'Published' || p.status === 'Granted' || p.status === 'Registered').length, icon: '✅', color: 'green' },
    { label: 'Total Citations', value: pubs.reduce((a, p) => a + (p.citations || 0), 0), icon: '🔗', color: 'blue' },
    { label: 'SCI / High Impact', value: pubs.filter(p => p.indexed === 'SCI' || p.indexed === 'SCI-E').length, icon: '⭐', color: 'orange' },
  ]

  return (
    <div className="animate-fade">
      {showModal && <AddPublicationModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {editPub && <EditPublicationModal pub={editPub} onClose={() => setEditPub(null)} onUpdate={handleUpdate} />}

      {/* ── Topbar ── */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Publications</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage your research publications and citations
          </span>
        </div>
        <div className="topbar-actions">
          <button
            id="add-publication-btn"
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(90deg,#10B981,#059669)', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowModal(true)}
          >
            <span style={{ fontSize: '16px' }}>＋</span> Add Publication
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* ── KPI Cards ── */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '--' : s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Publication Type Summary Chips ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
          {PUB_TYPES.map(type => {
            const count = pubs.filter(p => p.type === type).length
            if (count === 0) return null
            return (
              <div key={type} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                fontSize: '12.5px', fontWeight: 600, color: '#065F46',
              }}>
                <span>{TYPE_ICONS[type]}</span> {type}
                <span style={{ background: '#10B981', color: '#fff', borderRadius: '999px', padding: '1px 7px', fontSize: '11px', marginLeft: '2px' }}>{count}</span>
              </div>
            )
          })}
        </div>

        {/* ── Filter + List ── */}
        <div className="card">
          <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {FILTER_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-ghost'}`}
                  style={filterType === t ? { background: 'linear-gradient(90deg,#10B981,#059669)' } : {}}
                >
                  {t === 'All' ? 'All' : `${TYPE_ICONS[t]} ${t}`}
                </button>
              ))}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--text-secondary)' }}>{filtered.length} publications</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                Loading publication history...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                <div style={{ fontWeight: 600 }}>No publications found</div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>Click "Add Publication" to get started</div>
              </div>
            ) : (
              filtered.map((pub) => (
                <div
                  key={pub.id}
                  style={{ padding: '18px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'box-shadow 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                      <span style={{ fontSize: '20px', marginTop: '1px' }}>{TYPE_ICONS[pub.type] || '📄'}</span>
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{pub.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <span className={`badge ${STATUS_CLS[pub.status] || 'badge-gray'}`}>{pub.status}</span>
                      <span className="badge badge-primary" style={{ fontSize: '10px', background: '#EDE9FE', color: '#4F46E5' }}>{pub.type}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', paddingLeft: '30px' }}>
                    <strong>{pub.venue}</strong> · {pub.year}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', paddingLeft: '30px' }}>
                    {pub.doi && (
                      <span style={{ fontSize: '12px', color: '#3B82F6', cursor: 'pointer' }}>🔗 DOI: {pub.doi}</span>
                    )}
                    {pub.indexed && pub.indexed !== '—' && (
                      <span className={`badge ${pub.indexed === 'SCI' || pub.indexed === 'SCI-E' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '11px' }}>
                        {pub.indexed}
                      </span>
                    )}
                    {pub.impactFactor && (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>IF: {pub.impactFactor}</span>
                    )}
                    {pub.citations > 0 && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📖 {pub.citations} citations</span>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditPub(pub)}>✏️ Edit</button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#EF4444' }}
                        onClick={() => handleDelete(pub.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
