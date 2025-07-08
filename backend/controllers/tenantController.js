const { Tenant } = require('../models');

exports.addTenant = async (req, res) => {
  const { name, contact, roomId } = req.body;
  try {
    const tenant = await Tenant.create({ name, contact, roomId });
    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTenants = async (req, res) => {
  const tenants = await Tenant.findAll();
  res.json(tenants);
};
