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

exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const { name, contact, roomId } = req.body;
  try {
    const tenant = await Tenant.findByPk(id);
    if (tenant) {
      tenant.name = name;
      tenant.contact = contact;
      tenant.roomId = roomId;
      await tenant.save();
      res.json(tenant);
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  const { id } = req.params;
  try {
    const tenant = await Tenant.findByPk(id);
    if (tenant) {
      await tenant.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
