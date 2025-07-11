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

class HostelService {
  constructor() {
    this.collectionName = 'hostels';
  }

  async addHostel(hostelData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...hostelData,
        totalRooms: 0,
        totalBeds: 0,
        occupiedBeds: 0,
        availableBeds: 0,
        totalTenants: 0,
        activeTenants: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      return { id: docRef.id, ...hostelData };
    } catch (error) {
      console.error('Error adding hostel:', error);
      throw error;
    }
  }

  async getHostels(ownerId = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (ownerId) {
        q = query(q, where('ownerId', '==', ownerId));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const hostels = [];
      
      querySnapshot.forEach((doc) => {
        hostels.push({ id: doc.id, ...doc.data() });
      });
      
      return hostels;
    } catch (error) {
      console.error('Error getting hostels:', error);
      throw error;
    }
  }

  async getHostelById(hostelId) {
    try {
      const docRef = doc(db, this.collectionName, hostelId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Hostel not found');
      }
    } catch (error) {
      console.error('Error getting hostel:', error);
      throw error;
    }
  }

  async updateHostel(hostelId, updateData) {
    try {
      const docRef = doc(db, this.collectionName, hostelId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id: hostelId, ...updateData };
    } catch (error) {
      console.error('Error updating hostel:', error);
      throw error;
    }
  }

  async deleteHostel(hostelId) {
    try {
      const docRef = doc(db, this.collectionName, hostelId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting hostel:', error);
      throw error;
    }
  }

  async updateHostelStats(hostelId) {
    try {
      // Get all rooms for this hostel
      const roomsQuery = query(
        collection(db, 'rooms'),
        where('hostelId', '==', hostelId)
      );
      const roomsSnapshot = await getDocs(roomsQuery);
      
      let totalRooms = 0;
      let totalBeds = 0;
      let occupiedBeds = 0;
      
      roomsSnapshot.forEach((doc) => {
        const room = doc.data();
        totalRooms++;
        totalBeds += room.totalBeds || 0;
        occupiedBeds += room.occupiedBeds || 0;
      });
      
      // Get all tenants for this hostel
      const tenantsQuery = query(
        collection(db, 'tenants'),
        where('hostelId', '==', hostelId)
      );
      const tenantsSnapshot = await getDocs(tenantsQuery);
      
      let totalTenants = 0;
      let activeTenants = 0;
      
      tenantsSnapshot.forEach((doc) => {
        const tenant = doc.data();
        totalTenants++;
        if (tenant.status === 'checked-in') {
          activeTenants++;
        }
      });
      
      // Update hostel with calculated stats
      await this.updateHostel(hostelId, {
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        totalTenants,
        activeTenants,
        occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0
      });
      
      return {
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        totalTenants,
        activeTenants,
        occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0
      };
    } catch (error) {
      console.error('Error updating hostel stats:', error);
      throw error;
    }
  }

  async getHostelOverview(hostelId) {
    try {
      const hostel = await this.getHostelById(hostelId);
      const stats = await this.updateHostelStats(hostelId);
      
      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Get recent check-ins
      const recentCheckInsQuery = query(
        collection(db, 'tenants'),
        where('hostelId', '==', hostelId),
        where('checkInDate', '>=', thirtyDaysAgo),
        orderBy('checkInDate', 'desc')
      );
      const recentCheckInsSnapshot = await getDocs(recentCheckInsQuery);
      const recentCheckIns = [];
      
      recentCheckInsSnapshot.forEach((doc) => {
        recentCheckIns.push({ id: doc.id, ...doc.data() });
      });
      
      // Get recent payments
      const recentPaymentsQuery = query(
        collection(db, 'payments'),
        where('hostelId', '==', hostelId),
        where('paymentDate', '>=', thirtyDaysAgo),
        orderBy('paymentDate', 'desc')
      );
      const recentPaymentsSnapshot = await getDocs(recentPaymentsQuery);
      const recentPayments = [];
      
      recentPaymentsSnapshot.forEach((doc) => {
        recentPayments.push({ id: doc.id, ...doc.data() });
      });
      
      return {
        hostel: { ...hostel, ...stats },
        recentCheckIns: recentCheckIns.slice(0, 5), // Last 5 check-ins
        recentPayments: recentPayments.slice(0, 5), // Last 5 payments
        monthlyRevenue: recentPayments.reduce((sum, payment) => {
          return payment.status === 'completed' ? sum + (payment.amount || 0) : sum;
        }, 0)
      };
    } catch (error) {
      console.error('Error getting hostel overview:', error);
      throw error;
    }
  }
}

export default new HostelService();