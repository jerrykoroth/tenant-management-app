const express = require('express');
const router = express.Router();
const { addTenant, getTenants } = require('../controllers/tenantController');

router.post('/tenants', addTenant);
router.get('/tenants', getTenants);

module.exports = router;
