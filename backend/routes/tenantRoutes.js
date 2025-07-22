const express = require('express');
const router = express.Router();
const {
  addTenant,
  getTenants,
  updateTenant,
  deleteTenant,
} = require('../controllers/tenantController');

router.post('/tenants', addTenant);
router.get('/tenants', getTenants);
router.put('/tenants/:id', updateTenant);
router.delete('/tenants/:id', deleteTenant);

module.exports = router;
