const express = require('express');
const users = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../utils/validators');

const router = express.Router();

router.use(authenticate());
router.get('/me', users.getMe);
router.put('/me', users.updateMe);
router.get('/', authorize(['admin', 'hod']), validate(schemas.listUsers, 'query'), users.listUsers);
router.post('/', authorize(['admin']), validate(schemas.createUser), users.createUser);
router.put('/:id', authorize(['admin']), validate(schemas.idParam, 'params'), validate(schemas.updateUser), users.updateUser);
router.delete('/:id', authorize(['admin']), validate(schemas.idParam, 'params'), users.deleteUser);
router.put('/:scholarId/assign-supervisor', authorize(['admin', 'hod']), validate(schemas.scholarIdParam, 'params'), validate(schemas.assignSupervisor), users.assignSupervisor);
router.put('/:scholarId/unassign-supervisor', authorize(['admin', 'hod']), validate(schemas.scholarIdParam, 'params'), users.unassignSupervisor);

module.exports = router;
