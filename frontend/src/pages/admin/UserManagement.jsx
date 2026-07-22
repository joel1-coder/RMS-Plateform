import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const DEFAULT_USERS = [
  { id: 1, name: 'Dr. Priya Kumar', email: 'supervisor@rms.edu', password: 'super123', role: 'supervisor', dept: 'Computer Science', status: 'Active', joined: '2023-06-01', scholars: 8 },
  { id: 2, name: 'Rahul Sharma', email: 'scholar@rms.edu', password: 'scholar123', role: 'scholar', dept: 'Computer Science', status: 'Active', joined: '2023-08-15', scholars: '-' },
  { id: 3, name: 'Prof. Anita Verma', email: 'hod@rms.edu', password: 'hod123', role: 'hod', dept: 'Computer Science', status: 'Active', joined: '2022-01-10', scholars: '-' },
  { id: 4, name: 'Dr. Mohan Reddy', email: 'drc@rms.edu', password: 'drc123', role: 'drc', dept: 'Research Committee', status: 'Active', joined: '2022-03-20', scholars: '-' },
  { id: 5, name: 'Neha Patel', email: 'neha@rms.edu', password: 'scholar123', role: 'scholar', dept: 'Electronics', status: 'Inactive', joined: '2024-01-05', scholars: '-' },
  { id: 6, name: 'Dr. Rajan Mehta', email: 'rajan@rms.edu', password: 'super123', role: 'supervisor', dept: 'Mechanical', status: 'Active', joined: '2021-09-01', scholars: 5 },
  { id: 7, name: 'Amit Kumar', email: 'amit@rms.edu', password: 'scholar123', role: 'scholar', dept: 'Civil', status: 'Active', joined: '2024-07-01', scholars: '-' },
  { id: 8, name: 'Ms. Deepa Nair', email: 'librarian@rms.edu', password: 'library123', role: 'librarian', dept: 'Central Library', status: 'Active', joined: '2020-05-15', scholars: '-' },
  { id: 9, name: 'Dr. Admin Singh', email: 'admin@rms.edu', password: 'admin123', role: 'admin', dept: 'Administration', status: 'Active', joined: '2020-01-01', scholars: '-' },
]

const ROLES = ['All', 'Admin', 'Supervisor', 'Scholar', 'HOD', 'DRC', 'Librarian']
const STATUSES = ['All', 'Active', 'Inactive']
const ROLE_COLORS = {
  admin: 'badge-danger', supervisor: 'badge-info', scholar: 'badge-primary',
  hod: 'badge-warning', drc: 'badge-success', librarian: 'badge-gray',
}

function UserModal({ onClose, onSave, userToEdit = null }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Scholar',
    dept: 'Computer Science',
    status: 'Active'
  })

  useEffect(() => {
    if (userToEdit) {
      setForm({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: userToEdit.password || '',
        role: userToEdit.role || 'Scholar',
        dept: userToEdit.dept || 'Computer Science',
        status: userToEdit.status || 'Active'
      })
    }
  }, [userToEdit])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required.')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{userToEdit ? 'Edit User Details' : 'Add New User'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="name" required className="form-control" placeholder="Dr. John Doe" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input name="email" type="email" required className="form-control" placeholder="john@rms.edu" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Login Password *</label>
                <input name="password" type="text" required className="form-control" placeholder="e.g. secret123" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">System Role *</label>
                <select name="role" className="form-control form-select" value={form.role} onChange={handleChange}>
                  {ROLES.filter(r => r !== 'All').map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department / Unit</label>
                <select name="dept" className="form-control form-select" value={form.dept} onChange={handleChange}>
                  {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemistry', 'Research Committee', 'Central Library', 'Administration'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Account Status</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                {['Active', 'Inactive'].map(s => (
                  <label className="form-check" key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} className="form-check-input" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(90deg, #6C63FF, #4F46E5)' }}>
              {userToEdit ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Initialize from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('rms_all_users')
    if (stored) {
      try {
        // Normalize roles to lowercase to prevent route mismatch loops
        const parsed = JSON.parse(stored).map(u => ({ ...u, role: u.role ? u.role.toLowerCase() : u.role }))
        setUsers(parsed)
        // Re-save normalized data back
        localStorage.setItem('rms_all_users', JSON.stringify(parsed))
      } catch (e) {
        setUsers(DEFAULT_USERS)
      }
    } else {
      setUsers(DEFAULT_USERS)
      localStorage.setItem('rms_all_users', JSON.stringify(DEFAULT_USERS))
    }
  }, [])

  const saveToStorage = (updatedUsers) => {
    setUsers(updatedUsers)
    localStorage.setItem('rms_all_users', JSON.stringify(updatedUsers))
  }

  const handleAddOrEdit = (formData) => {
    if (editingUser) {
      // Edit mode
      const updated = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u)
      saveToStorage(updated)
      toast.success('User updated successfully!')
      setEditingUser(null)
    } else {
      // Add mode
      const newUser = {
        ...formData,
        id: Date.now(),
        joined: new Date().toISOString().slice(0, 10),
        scholars: formData.role?.toLowerCase() === 'supervisor' ? 0 : '-'
      }
      const updated = [newUser, ...users]
      saveToStorage(updated)
      toast.success('User registered successfully!')
    }
  }

  const handleToggleStatus = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)
    saveToStorage(updated)
    toast.success('Status toggled successfully')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== id)
      saveToStorage(updated)
      toast.success('User deleted successfully')
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'All' || u.role?.toLowerCase() === filterRole.toLowerCase()
    const matchStatus = filterStatus === 'All' || u.status === filterStatus
    return matchSearch && matchRole && matchStatus
  })

  return (
    <div className="animate-fade">
      {(showModal || editingUser) && (
        <UserModal
          userToEdit={editingUser}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
          onSave={handleAddOrEdit}
        />
      )}
      
      <div className="topbar">
        <div>
          <div className="topbar-title">User Management</div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage all users, credentials, and role assignments
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" style={{ background: 'linear-gradient(90deg, #6C63FF, #4F46E5)' }} onClick={() => setShowModal(true)} id="add-user-btn">
            ＋ Add User
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Summary Cards */}
        <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {[
            { label: 'Total Users', value: users.length, icon: '👥', color: 'purple' },
            { label: 'Active', value: users.filter(u => u.status === 'Active').length, icon: '✅', color: 'green' },
            { label: 'Scholars', value: users.filter(u => u.role === 'Scholar').length, icon: '🎓', color: 'blue' },
            { label: 'Supervisors', value: users.filter(u => u.role === 'Supervisor').length, icon: '👨‍🏫', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                className="form-control"
                placeholder="Search by name, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="user-search"
              />
            </div>
            <select
              className="form-control form-select"
              style={{ width: '140px' }}
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
            >
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            <select
              className="form-control form-select"
              style={{ width: '130px' }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
              {filtered.length} of {users.length} users
            </span>
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={user.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{ background: `hsl(${(user.id * 60) % 360}, 60%, 55%)` }}>
                          {user.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{user.password || '—'}</td>
                    <td><span className={`badge ${ROLE_COLORS[user.role] || 'badge-gray'}`}>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{user.dept}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{user.joined}</td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-gray'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'Active' ? '⏸' : '▶'}
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setEditingUser(user)}
                          title="Edit"
                        >✏️</button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#EF4444' }}
                          onClick={() => handleDelete(user.id)}
                          title="Delete"
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length} entries</span>
            <button className="page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
