import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  RefreshControl,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../components/common/Card';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { formatDate, formatPhoneNumber, getStatusColor } from '../utils/formatters';
import tenantService from '../services/tenantService';

const TenantListScreen = ({ navigation }) => {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadTenants = async () => {
    try {
      const tenantsData = await tenantService.getTenants();
      setTenants(tenantsData);
      filterTenants(tenantsData, searchQuery, filterStatus);
    } catch (error) {
      console.error('Error loading tenants:', error);
      Alert.alert('Error', 'Failed to load tenants');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTenants = (tenantsData, query, status) => {
    let filtered = tenantsData;

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === status);
    }

    // Filter by search query
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(tenant =>
        tenant.name?.toLowerCase().includes(lowercaseQuery) ||
        tenant.email?.toLowerCase().includes(lowercaseQuery) ||
        tenant.phone?.includes(query) ||
        tenant.roomNumber?.toString().includes(query)
      );
    }

    setFilteredTenants(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      loadTenants();
    }, [])
  );

  useEffect(() => {
    filterTenants(tenants, searchQuery, filterStatus);
  }, [searchQuery, filterStatus, tenants]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTenants();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const handleDeleteTenant = (tenantId, tenantName) => {
    Alert.alert(
      'Delete Tenant',
      `Are you sure you want to delete ${tenantName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tenantService.deleteTenant(tenantId);
              Alert.alert('Success', 'Tenant deleted successfully');
              loadTenants();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete tenant');
            }
          }
        }
      ]
    );
  };

  const TenantCard = ({ tenant }) => (
    <Card 
      style={styles.tenantCard} 
      onPress={() => navigation.navigate('TenantDetails', { tenantId: tenant.id })}
    >
      <View style={styles.tenantHeader}>
        <View style={styles.tenantInfo}>
          <Text style={styles.tenantName}>{tenant.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(tenant.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(tenant.status) }]}>
              {tenant.status?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
            </Text>
          </View>
        </View>
        <View style={styles.tenantActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('TenantDetails', { tenantId: tenant.id })}
          >
            <Icon name="visibility" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteTenant(tenant.id, tenant.name)}
          >
            <Icon name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tenantDetails}>
        <View style={styles.detailRow}>
          <Icon name="email" size={16} color="#757575" />
          <Text style={styles.detailText}>{tenant.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color="#757575" />
          <Text style={styles.detailText}>{formatPhoneNumber(tenant.phone)}</Text>
        </View>
        {tenant.roomNumber && (
          <View style={styles.detailRow}>
            <Icon name="hotel" size={16} color="#757575" />
            <Text style={styles.detailText}>Room {tenant.roomNumber}</Text>
          </View>
        )}
        {tenant.checkInDate && (
          <View style={styles.detailRow}>
            <Icon name="event" size={16} color="#757575" />
            <Text style={styles.detailText}>Check-in: {formatDate(tenant.checkInDate)}</Text>
          </View>
        )}
      </View>
    </Card>
  );

  const FilterChip = ({ title, status, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading tenants..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tenants</Text>
        <CustomButton
          title="Add Tenant"
          onPress={() => navigation.navigate('AddTenant')}
          size="small"
          style={styles.addButton}
        />
      </View>

      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search tenants..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon="search"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filtersContainer}>
        <FilterChip
          title="All"
          status="all"
          isActive={filterStatus === 'all'}
          onPress={() => handleStatusFilter('all')}
        />
        <FilterChip
          title="Active"
          status="active"
          isActive={filterStatus === 'active'}
          onPress={() => handleStatusFilter('active')}
        />
        <FilterChip
          title="Checked In"
          status="checked-in"
          isActive={filterStatus === 'checked-in'}
          onPress={() => handleStatusFilter('checked-in')}
        />
        <FilterChip
          title="Checked Out"
          status="checked-out"
          isActive={filterStatus === 'checked-out'}
          onPress={() => handleStatusFilter('checked-out')}
        />
      </View>

      <FlatList
        data={filteredTenants}
        renderItem={({ item }) => <TenantCard tenant={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={64} color="#E0E0E0" />
            <Text style={styles.emptyStateTitle}>No tenants found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Add your first tenant to get started'
              }
            </Text>
            {!searchQuery && filterStatus === 'all' && (
              <CustomButton
                title="Add First Tenant"
                onPress={() => navigation.navigate('AddTenant')}
                style={styles.emptyStateButton}
              />
            )}
          </View>
        }
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2196F3',
  },
  filterChipText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tenantCard: {
    marginBottom: 12,
    padding: 16,
  },
  tenantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tenantActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  tenantDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 32,
  },
});

export default TenantListScreen;
