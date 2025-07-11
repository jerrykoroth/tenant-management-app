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

class RoomService {
  constructor() {
    this.collectionName = 'rooms';
  }

  async addRoom(roomData) {
    try {
      const beds = [];
      for (let i = 1; i <= roomData.totalBeds; i++) {
        beds.push({
          bedNumber: i,
          isOccupied: false,
          tenantId: null,
          rent: roomData.rentPerBed || 0
        });
      }

      const docRef = await addDoc(collection(db, this.collectionName), {
        ...roomData,
        beds,
        availableBeds: roomData.totalBeds,
        occupiedBeds: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { id: docRef.id, ...roomData, beds };
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  }

  async getRooms(hostelId = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (hostelId) {
        q = query(q, where('hostelId', '==', hostelId));
      }
      
      q = query(q, orderBy('roomNumber', 'asc'));
      
      const querySnapshot = await getDocs(q);
      const rooms = [];
      
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      
      return rooms;
    } catch (error) {
      console.error('Error getting rooms:', error);
      throw error;
    }
  }

  async getRoomById(roomId) {
    try {
      const docRef = doc(db, this.collectionName, roomId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Room not found');
      }
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  }

  async updateRoom(roomId, updateData) {
    try {
      const docRef = doc(db, this.collectionName, roomId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { id: roomId, ...updateData };
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async deleteRoom(roomId) {
    try {
      const docRef = doc(db, this.collectionName, roomId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  async assignBed(roomId, bedNumber, tenantId) {
    try {
      const room = await this.getRoomById(roomId);
      const updatedBeds = room.beds.map(bed => {
        if (bed.bedNumber === bedNumber) {
          return {
            ...bed,
            isOccupied: true,
            tenantId: tenantId
          };
        }
        return bed;
      });

      const occupiedCount = updatedBeds.filter(bed => bed.isOccupied).length;
      
      await this.updateRoom(roomId, {
        beds: updatedBeds,
        occupiedBeds: occupiedCount,
        availableBeds: room.totalBeds - occupiedCount
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning bed:', error);
      throw error;
    }
  }

  async releaseBed(roomId, bedNumber) {
    try {
      const room = await this.getRoomById(roomId);
      const updatedBeds = room.beds.map(bed => {
        if (bed.bedNumber === bedNumber) {
          return {
            ...bed,
            isOccupied: false,
            tenantId: null
          };
        }
        return bed;
      });

      const occupiedCount = updatedBeds.filter(bed => bed.isOccupied).length;
      
      await this.updateRoom(roomId, {
        beds: updatedBeds,
        occupiedBeds: occupiedCount,
        availableBeds: room.totalBeds - occupiedCount
      });
      
      return true;
    } catch (error) {
      console.error('Error releasing bed:', error);
      throw error;
    }
  }

  async getAvailableRooms(hostelId = null) {
    try {
      let q = collection(db, this.collectionName);
      
      if (hostelId) {
        q = query(q, where('hostelId', '==', hostelId), where('availableBeds', '>', 0));
      } else {
        q = query(q, where('availableBeds', '>', 0));
      }
      
      const querySnapshot = await getDocs(q);
      const rooms = [];
      
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      
      return rooms;
    } catch (error) {
      console.error('Error getting available rooms:', error);
      throw error;
    }
  }
}

export default new RoomService();