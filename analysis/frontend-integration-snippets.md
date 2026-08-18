# Frontend Integration Snippets

This document provides concrete code snippets showing how to wire the React frontend screens (such as Login, User Management, Assign Scholar, and File Upload) to a backend Node.js/Express API.

---

## 1. Authentication (Login)
Integrating `LoginPage.jsx` with `POST /api/auth/login`.

```javascript
import axios from 'axios';

const handleLoginSubmit = async (email, password, role) => {
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password,
      role
    });

    const { token, user } = response.data;
    
    // Save credentials to local storage
    localStorage.setItem('rms_token', token);
    localStorage.setItem('rms_user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Login failed';
    throw new Error(errorMsg);
  }
};
```

---

## 2. User Management (CRUD)
Integrating `UserManagement.jsx` with user create/update/delete endpoints.

### Create User (POST)
```javascript
const createUser = async (userData) => {
  const token = localStorage.getItem('rms_token');
  try {
    const response = await axios.post('/api/users', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user', error);
    throw error;
  }
};
```

### Update User (PUT)
```javascript
const updateUser = async (userId, updatedFields) => {
  const token = localStorage.getItem('rms_token');
  try {
    const response = await axios.put(`/api/users/${userId}`, updatedFields, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user', error);
    throw error;
  }
};
```

---

## 3. Assign Scholar to Supervisor
Integrating `AssignScholar.jsx` with supervisor matching endpoint.

```javascript
const assignSupervisor = async (scholarId, supervisorId) => {
  const token = localStorage.getItem('rms_token');
  try {
    const response = await axios.put(`/api/users/${scholarId}/assign-supervisor`, 
      { supervisorId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns updated Scholar document
  } catch (error) {
    console.error('Supervisor assignment failed', error);
    throw error;
  }
};
```

---

## 4. File Upload (Synopsis/Thesis Submissions)
Integrating `ScholarSynopsis.jsx` and `ScholarThesis.jsx` with multipart upload.

```javascript
const uploadSynopsis = async (topic, file) => {
  const token = localStorage.getItem('rms_token');
  const formData = new FormData();
  formData.append('topic', topic);
  formData.append('file', file); // The raw file from input type="file"

  try {
    const response = await axios.post('/api/submissions/synopsis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Submission upload failed', error);
    throw error;
  }
};
```

On the backend, handle this using a library like `multer`:
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/synopsis/' });

app.post('/api/submissions/synopsis', upload.single('file'), async (req, res) => {
  const { topic } = req.body;
  const file = req.file; // req.file.path contains storage location
  
  // Save file metadata to MongoDB submissions collection
  const submission = new Submission({
    scholarId: req.user.id,
    scholarName: req.user.name,
    topic: topic,
    type: 'synopsis',
    fileUrl: `/uploads/synopsis/${file.filename}`,
    status: 'Pending Supervisor Approval',
    submittedAt: new Date()
  });
  
  await submission.save();
  res.status(201).json(submission);
});
```
