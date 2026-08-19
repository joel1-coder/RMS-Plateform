import { useState, useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'

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
        password: userToEdit.plainPassword || '', // display plain text password for admin edit
        role: userToEdit.role ? userToEdit.role.charAt(0).toUpperCase() + userToEdit.role.slice(1) : 'Scholar',
        dept: userToEdit.dept || 'Computer Science',
        status: userToEdit.status || 'Active'
      })
    }
  }, [userToEdit])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email || (!userToEdit && !form.password)) {
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
                <label className="form-label">Login Password {userToEdit ? '(Leave empty to keep current)' : '*'}</label>
                <input name="password" type="text" required={!userToEdit} className="form-control" placeholder="e.g. secret123" value={form.password} onChange={handleChange} />
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
  const [loading, setLoading] = useState(true)

  const abortRef = useRef(null)

  const fetchUsers = useCallback(async (role, status, searchTerm) => {
    // Cancel any previous in-flight request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    try {
      const token = localStorage.getItem('rms_token')
      const roleParam = role === 'All' ? '' : role.toLowerCase()
      const statusParam = status === 'All' ? '' : status
      const response = await fetch(
        `/api/users?role=${roleParam}&status=${statusParam}&search=${searchTerm}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: abortRef.current.signal
        }
      )
      if (!response.ok) throw new Error('Failed to load users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      if (err.name === 'AbortError') return // Ignore cancelled requests
      toast.error('Failed to load users from backend database')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce: only call API 500ms after user stops typing/changing filters
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(filterRole, filterStatus, search)
    }, search ? 500 : 0)
    return () => clearTimeout(timer)
  }, [filterRole, filterStatus, search, fetchUsers])

  const handleAddOrEdit = async (formData) => {
    try {
      const token = localStorage.getItem('rms_token')
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role.toLowerCase(),
        dept: formData.dept,
        status: formData.status
      }

      // Only send password if provided
      if (formData.password) {
        payload.password = formData.password
      }

      if (editingUser) {
        // Edit mode
        const response = await fetch(`/api/users/${editingUser.id || editingUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to update user')
        }
        toast.success('User updated successfully!')
        setEditingUser(null)
      } else {
        // Add mode
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...payload,
            joined: new Date().toISOString().slice(0, 10)
          })
        })
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to create user')
        }
        toast.success('User registered successfully!')
      }
      fetchUsers(filterRole, filterStatus, search)
    } catch (err) {
      toast.error(err.message || 'An error occurred during save operation')
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      const token = localStorage.getItem('rms_token')
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
      const response = await fetch(`/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      toast.success('Status toggled successfully')
      fetchUsers(filterRole, filterStatus, search)
    } catch (err) {
      toast.error('Failed to toggle status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('rms_token')
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to delete user')
        toast.success('User deleted successfully')
        fetchUsers(filterRole, filterStatus, search)
      } catch (err) {
        toast.error('Failed to delete user')
      }
    }
  }

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
            { label: 'Scholars', value: users.filter(u => u.role?.toLowerCase() === 'scholar').length, icon: '🎓', color: 'blue' },
            { label: 'Supervisors', value: users.filter(u => u.role?.toLowerCase() === 'supervisor').length, icon: '👨‍🏫', color: 'orange' },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '--' : s.value}</div>
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
              {users.length} users listed
            </span>
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No users found
              </div>
            ) : (
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
                  {users.map((user, i) => (
                    <tr key={user.id || user._id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar avatar-sm" style={{ background: `hsl(${((user.id || user._id).toString().charCodeAt(0) * 60) % 360}, 60%, 55%)` }}>
                            {user.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 600 }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{user.plainPassword || '—'}</td>
                      <td><span className={`badge ${ROLE_COLORS[user.role?.toLowerCase()] || 'badge-gray'}`}>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}</span></td>
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
                            onClick={() => handleToggleStatus(user)}
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
                            onClick={() => handleDelete(user.id || user._id)}
                            title="Delete"
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span className="pagination-info">Showing {users.length} entries</span>
            <button className="page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
