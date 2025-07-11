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
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class PaymentService {
  constructor() {
    this.collectionName = 'payments';
  }

  async addPayment(paymentData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...paymentData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: paymentData.status || 'completed'
      });
      return { id: docRef.id, ...paymentData };
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }

  async getPayments(filters = {}) {
    try {
      let q = collection(db, this.collectionName);
      
      // Apply filters
      if (filters.tenantId) {
        q = query(q, where('tenantId', '==', filters.tenantId));
      }
      
      if (filters.hostelId) {
        q = query(q, where('hostelId', '==', filters.hostelId));
      }
      
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      if (filters.startDate && filters.endDate) {
        q = query(q, 
          where('paymentDate', '>=', Timestamp.fromDate(filters.startDate)),
          where('paymentDate', '<=', Timestamp.fromDate(filters.endDate))
        );
      }
      
      q = query(q, orderBy('paymentDate', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      
      return payments;
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }

  async getPaymentById(paymentId) {
    try {
      const docRef = doc(db, this.collectionName, paymentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Payment not found');
      }
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }

  async updatePayment(paymentId, updateData) {
    try {
      const docRef = doc(db, this.collectionName, paymentId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id: paymentId, ...updateData };
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async deletePayment(paymentId) {
    try {
      const docRef = doc(db, this.collectionName, paymentId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  async getTenantPayments(tenantId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('tenantId', '==', tenantId),
        orderBy('paymentDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      
      return payments;
    } catch (error) {
      console.error('Error getting tenant payments:', error);
      throw error;
    }
  }

  async getPendingPayments(hostelId = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (hostelId) {
        q = query(q, where('hostelId', '==', hostelId), where('status', '==', 'pending'));
      } else {
        q = query(q, where('status', '==', 'pending'));
      }
      
      q = query(q, orderBy('dueDate', 'asc'));
      
      const querySnapshot = await getDocs(q);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      
      return payments;
    } catch (error) {
      console.error('Error getting pending payments:', error);
      throw error;
    }
  }

  async getPaymentStats(hostelId = null, startDate = null, endDate = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (hostelId) {
        q = query(q, where('hostelId', '==', hostelId));
      }
      
      if (startDate && endDate) {
        q = query(q, 
          where('paymentDate', '>=', Timestamp.fromDate(startDate)),
          where('paymentDate', '<=', Timestamp.fromDate(endDate))
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      let totalCollected = 0;
      let totalPending = 0;
      let totalOverdue = 0;
      let paymentCount = 0;
      
      const currentDate = new Date();
      
      querySnapshot.forEach((doc) => {
        const payment = doc.data();
        paymentCount++;
        
        if (payment.status === 'completed') {
          totalCollected += payment.amount || 0;
        } else if (payment.status === 'pending') {
          totalPending += payment.amount || 0;
          
          // Check if overdue
          const dueDate = payment.dueDate?.toDate() || new Date();
          if (dueDate < currentDate) {
            totalOverdue += payment.amount || 0;
          }
        }
      });
      
      return {
        totalCollected,
        totalPending,
        totalOverdue,
        paymentCount,
        collectionRate: paymentCount > 0 ? (totalCollected / (totalCollected + totalPending)) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  }

  async markPaymentAsCompleted(paymentId, paymentDate = new Date()) {
    try {
      return await this.updatePayment(paymentId, {
        status: 'completed',
        paymentDate: paymentDate,
        completedAt: new Date()
      });
    } catch (error) {
      console.error('Error marking payment as completed:', error);
      throw error;
    }
  }
}

export default new PaymentService();