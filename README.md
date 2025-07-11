# 🏨 Tenant Management Mobile Application

A modern, comprehensive React Native mobile application for managing hostels, tenants, rooms, payments, and generating reports. Built with Firebase backend for secure, scalable operations.

## ✨ Features

### 📱 Core Functionality
- **User Registration & Authentication** - Email-based registration without verification requirement
- **Hostel/Organization Management** - Add and manage multiple hostels
- **Comprehensive Dashboard** - Real-time overview of all operations
- **Tenant Management** - Complete tenant lifecycle management
- **Room & Bed Management** - Detailed room allocation and bed tracking
- **Check-in/Check-out System** - Streamlined guest management
- **Payment Tracking** - Complete payment history and pending dues
- **Date-based Reports** - Detailed analytics and reporting

### 🎨 User Experience
- **Modern UI/UX** - Beautiful, intuitive interface with Material Design
- **Dark/Light Theme Support** - Consistent design language
- **Offline-first Architecture** - Works without internet connectivity
- **Pull-to-refresh** - Real-time data updates
- **Search & Filter** - Advanced filtering across all modules
- **Real-time Notifications** - Instant updates on important events

### 🔒 Security & Scalability
- **Firebase Authentication** - Secure user management
- **Cloud Firestore** - Real-time database with offline support
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Robust error management
- **Responsive Design** - Works on all device sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tenant-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update `src/config/firebase.js` with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Run the application**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # Start Metro bundler
   npm start
   ```

## 📁 Project Structure

```
tenant-management-app/
├── src/
│   ├── components/
│   │   └── common/           # Reusable UI components
│   │       ├── Card.js
│   │       ├── CustomButton.js
│   │       ├── CustomInput.js
│   │       └── LoadingOverlay.js
│   ├── config/
│   │   └── firebase.js       # Firebase configuration
│   ├── navigation/
│   │   └── AppNavigator.js   # Navigation setup
│   ├── screens/              # All application screens
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── TenantListScreen.js
│   │   ├── AddTenantScreen.js
│   │   ├── RoomManagementScreen.js
│   │   ├── PaymentTrackingScreen.js
│   │   ├── ReportsScreen.js
│   │   └── ...
│   ├── services/             # API and business logic
│   │   ├── authService.js
│   │   ├── tenantService.js
│   │   ├── roomService.js
│   │   ├── paymentService.js
│   │   └── hostelService.js
│   └── utils/
│       └── formatters.js     # Utility functions
├── App.js
├── package.json
└── README.md
```

## 📱 Screen Overview

### Authentication
- **Login Screen** - Email/password authentication
- **Signup Screen** - User registration with organization details

### Main Application
- **Dashboard** - Overview with key metrics and quick actions
- **Tenants Tab** - Tenant list with search and filter
- **Rooms Tab** - Room and bed management
- **Payments Tab** - Payment tracking and history
- **Reports Tab** - Analytics and reporting

### Detail Screens
- **Add Tenant** - Complete tenant registration form
- **Tenant Details** - Individual tenant information and history
- **Check-in/Check-out** - Guest management workflow
- **Add Payment** - Payment entry and tracking
- **Hostel Management** - Organization settings
- **Add Room** - Room creation and configuration

## 🎯 Key Features Detail

### Dashboard
- **Real-time Statistics** - Total tenants, occupancy rates, revenue
- **Quick Actions** - One-tap access to common tasks
- **Recent Activity** - Latest check-ins, payments, and updates
- **Performance Metrics** - Occupancy rates, collection efficiency

### Tenant Management
- **Complete Profile** - Name, contact details, ID verification
- **Status Tracking** - Active, checked-in, checked-out
- **Search & Filter** - Find tenants by name, room, status
- **History** - Complete tenant interaction history

### Room Management
- **Room Configuration** - Room details, bed count, pricing
- **Bed Allocation** - Individual bed assignment and tracking
- **Occupancy Tracking** - Real-time availability status
- **Room Reports** - Utilization and revenue analytics

### Payment System
- **Payment Recording** - Manual and automated payment entry
- **Due Tracking** - Overdue payment alerts and management
- **Payment History** - Complete transaction records
- **Revenue Analytics** - Monthly/yearly revenue tracking

### Reporting
- **Occupancy Reports** - Date-range based analysis
- **Revenue Reports** - Income tracking and projections
- **Tenant Reports** - Check-in/out patterns
- **Export Functionality** - Data export for external analysis

## 🛠 Technology Stack

- **Frontend**: React Native, React Navigation
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **UI Library**: React Native Vector Icons, Material Design
- **State Management**: React Hooks (useState, useEffect)
- **Development**: Expo CLI for rapid development

## 📦 Dependencies

```json
{
  "dependencies": {
    "@react-navigation/bottom-tabs": "^7.4.2",
    "@react-navigation/native": "^7.1.14",
    "@react-navigation/native-stack": "^7.3.21",
    "expo": "~53.0.17",
    "firebase": "^11.10.0",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-vector-icons": "^10.2.0"
  }
}
```

## 🔧 Configuration

### Firebase Firestore Collections
The app uses the following Firestore collections:

- **users** - User authentication and profile data
- **hostels** - Hostel/organization information
- **rooms** - Room details and bed configurations
- **tenants** - Tenant profiles and status
- **payments** - Payment records and transactions

### Security Rules
Ensure proper Firestore security rules are configured for data protection.

## 📱 Usage Instructions

1. **Registration**: Create account with organization details
2. **Setup**: Add hostel information and room configurations
3. **Tenant Management**: Register tenants and assign rooms
4. **Daily Operations**: Handle check-ins, check-outs, and payments
5. **Monitoring**: Use dashboard for real-time insights
6. **Reporting**: Generate reports for business analysis

## 🚀 Deployment

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -scheme TenantManagement -configuration Release archive
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@tenantmanager.com
- Documentation: [Wiki](link-to-wiki)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Firebase team for robust backend services
- Material Design for UI/UX guidelines
- Contributors and testers

---

**Built with ❤️ for efficient hostel management**