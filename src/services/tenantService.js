import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class TenantService {
  constructor() {
    this.collectionName = 'tenants';
  }

  async addTenant(tenantData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...tenantData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      return { id: docRef.id, ...tenantData };
    } catch (error) {
      console.error('Error adding tenant:', error);
      throw error;
    }
  }

  async getTenants(hostelId = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (hostelId) {
        q = query(q, where('hostelId', '==', hostelId));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const tenants = [];
      
      querySnapshot.forEach((doc) => {
        tenants.push({ id: doc.id, ...doc.data() });
      });
      
      return tenants;
    } catch (error) {
      console.error('Error getting tenants:', error);
      throw error;
    }
  }

  async getTenantById(tenantId) {
    try {
      const docRef = doc(db, this.collectionName, tenantId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Tenant not found');
      }
    } catch (error) {
      console.error('Error getting tenant:', error);
      throw error;
    }
  }

  async updateTenant(tenantId, updateData) {
    try {
      const docRef = doc(db, this.collectionName, tenantId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id: tenantId, ...updateData };
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }

  async deleteTenant(tenantId) {
    try {
      const docRef = doc(db, this.collectionName, tenantId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  async checkInTenant(tenantId, roomId, bedId) {
    try {
      const updateData = {
        roomId,
        bedId,
        checkInDate: new Date(),
        status: 'checked-in',
        updatedAt: new Date()
      };
      
      return await this.updateTenant(tenantId, updateData);
    } catch (error) {
      console.error('Error checking in tenant:', error);
      throw error;
    }
  }

  async checkOutTenant(tenantId) {
    try {
      const updateData = {
        checkOutDate: new Date(),
        status: 'checked-out',
        roomId: null,
        bedId: null,
        updatedAt: new Date()
      };
      
      return await this.updateTenant(tenantId, updateData);
    } catch (error) {
      console.error('Error checking out tenant:', error);
      throw error;
    }
  }

  async getActiveTenants(hostelId = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (hostelId) {
        q = query(q, where('hostelId', '==', hostelId), where('status', '==', 'checked-in'));
      } else {
        q = query(q, where('status', '==', 'checked-in'));
      }
      
      const querySnapshot = await getDocs(q);
      const tenants = [];
      
      querySnapshot.forEach((doc) => {
        tenants.push({ id: doc.id, ...doc.data() });
      });
      
      return tenants;
    } catch (error) {
      console.error('Error getting active tenants:', error);
      throw error;
    }
  }
}

export default new TenantService();
