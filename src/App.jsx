import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './colors';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import ServicesScreen from './screens/ServicesScreen';
import FAQScreen from './screens/FAQScreen';
import AboutScreen from './screens/AboutScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import LoginScreen from './screens/LoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PaymentScreen from './screens/PaymentScreen';

const DEFAULT_SUBMISSIONS = [
  {
    id: '1',
    resiId: 'SIM-2026-8786',
    nama: 'Satria',
    nik: '3174052208900002',
    noHp: '081298765432',
    email: 'satria@gmail.com',
    jenisSim: 'SIM C',
    satpas: 'SATPAS Polres Metro Jakarta Timur',
    serviceTitle: 'Pendaftaran SIM Baru',
    date: '25/08/2026',
    status: 'Pending',
  },
  {
    id: '2',
    resiId: 'SIM-2026-7866',
    nama: 'Budi Santoso',
    nik: '3174052208900001',
    noHp: '081298765432',
    email: 'budi@gmail.com',
    jenisSim: 'SIM A',
    satpas: 'SATPAS Polres Metro Jakarta Selatan',
    serviceTitle: 'Perpanjangan SIM Nasional',
    date: '25/08/2026',
    status: 'Pending',
  },
  {
    id: '3',
    resiId: 'SIM-2026-0822-412',
    nama: 'Raka Pratama',
    nik: '9213917237217321',
    noHp: '085712345678',
    email: 'raka@gmail.com',
    jenisSim: 'SIM Internasional',
    satpas: 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
    serviceTitle: 'Pendaftaran SIM Internasional',
    date: '22/08/2026',
    status: 'Approved',
  },
  {
    id: '4',
    resiId: 'SIM-2026-0822-889',
    nama: 'Dedi Kurniawan',
    nik: '3174052208900009',
    noHp: '081398765432',
    email: 'dedi@gmail.com',
    jenisSim: 'SIM A',
    satpas: 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
    serviceTitle: 'Perpanjangan SIM Nasional',
    date: '22/08/2026',
    status: 'Rejected',
  },
];

export default function App() {
  // Read persisted currentUser on initial load
  const [currentUser, setCurrentUser] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const savedUser = window.localStorage.getItem('jejaksim_user');
        return savedUser ? JSON.parse(savedUser) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Read persisted activeTab on initial load
  const [activeTab, setActiveTab] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const savedTab = window.localStorage.getItem('jejaksim_tab');
        return savedTab || 'home';
      } catch (e) {
        return 'home';
      }
    }
    return 'home';
  });

  const [selectedService, setSelectedService] = useState(null);

  // Read persisted submissions on initial load
  // Read live submissions from server / default
  const [submissions, setSubmissions] = useState(DEFAULT_SUBMISSIONS);

  // Fetch live submissions from backend MySQL server
  const fetchSubmissions = () => {
    fetch('http://127.0.0.1:5000/api/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.submissions) && data.submissions.length > 0) {
          setSubmissions(data.submissions);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenService = (service) => {
    setSelectedService(service);
  };

  const handleBackToServices = () => {
    setSelectedService(null);
  };

  const handleAddSubmission = (newSubmission) => {
    setSubmissions((prev) => [newSubmission, ...prev]);
    fetchSubmissions();
  };

  const handleUpdateStatus = (submissionId, newStatus) => {
    let mappedStatus = newStatus;
    if (newStatus === 'Disetujui' || newStatus === 'Approved') mappedStatus = 'Approved';
    if (newStatus === 'Ditolak' || newStatus === 'Rejected') mappedStatus = 'Rejected';

    setSubmissions((prev) =>
      prev.map((sub) =>
        (sub.id === submissionId || sub.resiId === submissionId || sub.resi_id === submissionId)
          ? { ...sub, status: mappedStatus }
          : sub
      )
    );

    // Sync to MySQL backend
    fetch(`http://127.0.0.1:5000/api/submissions/${submissionId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: mappedStatus }),
    })
      .then(() => fetchSubmissions())
      .catch(() => {});
  };

  const handleTabChange = (tab) => {
    setSelectedService(null);
    setActiveTab(tab);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('jejaksim_tab', tab);
      } catch (e) {}
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setSelectedService(null);
    setActiveTab('home');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('jejaksim_user', JSON.stringify(userData));
        window.localStorage.setItem('jejaksim_tab', 'home');
      } catch (e) {}
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedService(null);
    setActiveTab('home');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('jejaksim_user');
        window.localStorage.removeItem('jejaksim_tab');
      } catch (e) {}
    }
  };

  // 1. Initial Authentication Gate: User MUST Login First (If Not Persisted)
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <Header />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  // 2. Admin Role View (Persisted Across Refresh)
  if (currentUser.role === 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <AdminDashboardScreen
          submissions={submissions}
          onUpdateStatus={handleUpdateStatus}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }

  // 3. Customer Role View (Persisted Across Refresh)
  const renderCustomerScreen = () => {
    if (selectedService) {
      return (
        <ServiceDetailScreen
          service={selectedService}
          onBack={handleBackToServices}
          onSubmitApplication={handleAddSubmission}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onSelectService={handleOpenService}
            onNavigateToTab={(tab) => handleTabChange(tab)}
          />
        );
      case 'services':
        return <ServicesScreen onSelectService={handleOpenService} />;
      case 'payment':
        return (
          <PaymentScreen
            submissions={submissions}
            onUpdateStatus={handleUpdateStatus}
          />
        );
      case 'faq':
        return <FAQScreen />;
      case 'about':
        return <AboutScreen />;
      default:
        return (
          <HomeScreen
            onSelectService={handleOpenService}
            onNavigateToTab={(tab) => handleTabChange(tab)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Main Header with User Profile Badge & Logout Button */}
      <Header currentUser={currentUser} onLogout={handleLogout} />

      {/* Main Navigation Tab Bar */}
      <Navigation
        activeTab={selectedService ? 'services' : activeTab}
        setActiveTab={(tab) => handleTabChange(tab)}
      />

      {/* Main Content Area */}
      <View style={styles.mainContent}>{renderCustomerScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    ...Platform.select({
      web: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
    }),
  },
  mainContent: {
    flex: 1,
    width: '100%',
  },
});
