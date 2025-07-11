import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  RefreshControl,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../components/common/Card';
import CustomButton from '../components/common/CustomButton';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { formatCurrency, formatDate, getRelativeTime } from '../utils/formatters';
import tenantService from '../services/tenantService';
import roomService from '../services/roomService';
import paymentService from '../services/paymentService';
import hostelService from '../services/hostelService';
import authService from '../services/authService';

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTenants: 0,
      activeTenants: 0,
      totalRooms: 0,
      occupiedBeds: 0,
      totalBeds: 0,
      occupancyRate: 0,
      monthlyRevenue: 0,
      pendingPayments: 0
    },
    recentActivity: [],
    quickActions: []
  });
  const [user, setUser] = useState(null);

  const loadDashboardData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      // For now, we'll use demo data since we don't have hostel selection implemented yet
      // In a real app, you'd get the user's hostels and allow them to select one
      
      const [
        tenants,
        activeTenants,
        rooms,
        paymentStats,
        recentPayments
      ] = await Promise.all([
        tenantService.getTenants(),
        tenantService.getActiveTenants(),
        roomService.getRooms(),
        paymentService.getPaymentStats(),
        paymentService.getPayments({ startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) })
      ]);

      const totalBeds = rooms.reduce((sum, room) => sum + (room.totalBeds || 0), 0);
      const occupiedBeds = rooms.reduce((sum, room) => sum + (room.occupiedBeds || 0), 0);

      setDashboardData({
        stats: {
          totalTenants: tenants.length,
          activeTenants: activeTenants.length,
          totalRooms: rooms.length,
          occupiedBeds,
          totalBeds,
          occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0,
          monthlyRevenue: paymentStats.totalCollected || 0,
          pendingPayments: paymentStats.totalPending || 0
        },
        recentActivity: [
          ...recentPayments.slice(0, 3).map(payment => ({
            id: payment.id,
            type: 'payment',
            title: 'Payment Received',
            subtitle: `${payment.tenantName} - ${formatCurrency(payment.amount)}`,
            time: getRelativeTime(payment.paymentDate),
            icon: 'payment'
          })),
          ...activeTenants.slice(0, 2).map(tenant => ({
            id: tenant.id,
            type: 'checkin',
            title: 'New Check-in',
            subtitle: `${tenant.name} - Room ${tenant.roomNumber || 'N/A'}`,
            time: getRelativeTime(tenant.checkInDate),
            icon: 'person-add'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const StatCard = ({ title, value, subtitle, icon, onPress, color = '#2196F3' }) => (
    <Card style={styles.statCard} onPress={onPress}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Icon name={icon} size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Card>
  );

  const QuickActionCard = ({ title, icon, onPress, color = '#2196F3' }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>
            {user?.userData?.organizationName || user?.userData?.name || 'Hostel Manager'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#757575" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Key Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Tenants"
              value={dashboardData.stats.totalTenants}
              subtitle={`${dashboardData.stats.activeTenants} active`}
              icon="people"
              onPress={() => navigation.navigate('Tenants')}
              color="#4CAF50"
            />
            <StatCard
              title="Occupancy"
              value={`${dashboardData.stats.occupiedBeds}/${dashboardData.stats.totalBeds}`}
              subtitle={`${dashboardData.stats.occupancyRate.toFixed(1)}% occupied`}
              icon="hotel"
              onPress={() => navigation.navigate('Rooms')}
              color="#FF9800"
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(dashboardData.stats.monthlyRevenue)}
              subtitle="This month"
              icon="trending-up"
              onPress={() => navigation.navigate('Payments')}
              color="#2196F3"
            />
            <StatCard
              title="Pending Payments"
              value={formatCurrency(dashboardData.stats.pendingPayments)}
              subtitle="Due this month"
              icon="schedule"
              onPress={() => navigation.navigate('Payments')}
              color="#F44336"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="Add Tenant"
              icon="person-add"
              onPress={() => navigation.navigate('AddTenant')}
              color="#4CAF50"
            />
            <QuickActionCard
              title="Check In/Out"
              icon="login"
              onPress={() => navigation.navigate('CheckInOut')}
              color="#2196F3"
            />
            <QuickActionCard
              title="Add Payment"
              icon="payment"
              onPress={() => navigation.navigate('AddPayment')}
              color="#FF9800"
            />
            <QuickActionCard
              title="Manage Hostels"
              icon="business"
              onPress={() => navigation.navigate('HostelManagement')}
              color="#9C27B0"
            />
            <QuickActionCard
              title="Add Room"
              icon="meeting-room"
              onPress={() => navigation.navigate('AddRoom')}
              color="#607D8B"
            />
            <QuickActionCard
              title="Reports"
              icon="assessment"
              onPress={() => navigation.navigate('Reports')}
              color="#795548"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <View 
                  key={activity.id} 
                  style={[
                    styles.activityItem,
                    index < dashboardData.recentActivity.length - 1 && styles.activityItemBorder
                  ]}
                >
                  <View style={[styles.activityIcon, { backgroundColor: '#E3F2FD' }]}>
                    <Icon name={activity.icon} size={20} color="#2196F3" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                  </View>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="inbox" size={48} color="#E0E0E0" />
                <Text style={styles.emptyStateText}>No recent activity</Text>
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  greeting: {
    fontSize: 16,
    color: '#757575',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  activityCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  activityTime: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 12,
  },
});

export default DashboardScreen;
