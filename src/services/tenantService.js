const API_URL = 'http://localhost:3000/api';

class TenantService {
  async addTenant(tenantData) {
    const response = await fetch(`${API_URL}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });
    return response.json();
  }

  async getTenants() {
    const response = await fetch(`${API_URL}/tenants`);
    return response.json();
  }

  async updateTenant(tenantId, updateData) {
    const response = await fetch(`${API_URL}/tenants/${tenantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return response.json();
  }

  async deleteTenant(tenantId) {
    const response = await fetch(`${API_URL}/tenants/${tenantId}`, {
      method: 'DELETE',
    });
    return response.status === 204;
  }
}

export default new TenantService();
