import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function LoginScreen({ onLoginSuccess }) {
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // Pre-registered Accounts State (Includes Customer Demo & New Registrations)
  const [registeredAccounts, setRegisteredAccounts] = useState([
    {
      email: 'budi@example.com',
      password: 'user123',
      name: 'Budi Santoso (Dummy)',
      nik: '3174052208900001',
      phone: '0800-0000-0001',
    },
    {
      email: 'siti@example.com',
      password: 'user123',
      name: 'Siti Rahmawati (Dummy)',
      nik: '3175021205950003',
      phone: '0800-0000-0002',
    },
  ]);

  // Unified Login Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Register Form State
  const [regNama, setRegNama] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Unified Login Handler (Detects Customer vs Admin automatically)
  const handleLogin = () => {
    if (!emailInput || !passwordInput) {
      const msg = 'Harap isi Alamat Gmail/Email dan Password Anda.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Perhatian', msg);
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();

    // 1. Check Admin Credentials
    if (
      (cleanEmail.startsWith('admin') ||
       cleanEmail === 'admin@jejaksim.polri.go.id' ||
       cleanEmail === 'admin@jejak-sim.id' ||
       cleanEmail === 'admin@example.com' ||
       cleanEmail === 'admin') &&
      passwordInput === 'admin123'
    ) {
      onLoginSuccess({
        role: 'admin',
        name: 'Petugas SATPAS Presisi',
        email: cleanEmail,
      });
      return;
    }

    // Try API login if server running
    fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: passwordInput }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          onLoginSuccess({
            role: data.user.role || 'customer',
            name: data.user.name,
            nik: data.user.nik,
            phone: data.user.no_hp,
            email: data.user.email,
          });
        } else {
          fallbackLocalLogin();
        }
      })
      .catch(() => {
        fallbackLocalLogin();
      });

    const fallbackLocalLogin = () => {
      // 2. Check Customer Credentials
      const matchedCustomer = registeredAccounts.find(
        (acc) =>
          acc.email.toLowerCase() === cleanEmail && acc.password === passwordInput
      );

      if (matchedCustomer) {
        onLoginSuccess({
          role: 'customer',
          name: matchedCustomer.name,
          nik: matchedCustomer.nik,
          phone: matchedCustomer.phone,
          email: matchedCustomer.email,
        });
        return;
      }

      const msg = 'Email atau Password salah. Silakan periksa kembali atau klik "Daftar Akun Baru".';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Login Gagal', msg);
    };
  };

  // Register Handler for New Customer Accounts
  const handleRegister = () => {
    if (!regNama || !regNik || !regPhone || !regEmail || !regPassword) {
      const msg = 'Harap lengkapi Nama, NIK KTP (16 digit), No Handphone, Gmail, dan Password.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Perhatian', msg);
      return;
    }

    if (regNik.length < 16) {
      const msg = 'NIK KTP harus berjumlah 16 digit.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Perhatian', msg);
      return;
    }

    const newAcc = {
      email: regEmail.trim(),
      password: regPassword,
      name: regNama,
      nik: regNik,
      phone: regPhone,
    };

    setRegisteredAccounts((prev) => [...prev, newAcc]);

    const msg = `Pendaftaran Akun Berhasil!\n\nSelamat datang, Bpk/Ibu ${regNama}. Akun Anda telah aktif.`;
    if (Platform.OS === 'web') alert(msg);

    // Auto login with new customer account
    onLoginSuccess({
      role: 'customer',
      name: regNama,
      nik: regNik,
      phone: regPhone,
      email: regEmail.trim(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.loginGrid}>
        {/* Left Column: Explanation & App Overview Panel */}
        <View style={styles.leftExplanationCol}>
          <View style={styles.explanationCard}>
            <View style={styles.badgeRow}>
              <View style={styles.appBadge}>
                <Text style={styles.appBadgeText}>PORTAL RESMI PRESISI</Text>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.dotActive} />
                <Text style={styles.statusText}>Server 24/7 Aktif</Text>
              </View>
            </View>

            <Text style={styles.expTitle}>Layanan Digital SIM Terpadu (JEJAK SIM)</Text>
            <Text style={styles.expSubtitle}>
              Platform resmi untuk mempermudah pendaftaran dan perpanjangan SIM A, SIM C, serta SIM Internasional secara terintegrasi dan aman.
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="flash-outline" size={20} color="#60A5FA" />
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Tanpa Antrean SATPAS</Text>
                  <Text style={styles.featureDesc}>
                    Seluruh proses pengajuan data, ujian teori, & verifikasi dilakukan daring dari rumah.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="scan-outline" size={20} color="#60A5FA" />
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Autentikasi Biometrik E-KTP</Text>
                  <Text style={styles.featureDesc}>
                    Verifikasi wajah Face Recognition terhubung langsung dengan basis data kependudukan E-KTP.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="car-outline" size={20} color="#60A5FA" />
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Pengiriman Kurir Pos ke Rumah</Text>
                  <Text style={styles.featureDesc}>
                    Kartu fisik SIM yang dicetak dikirim langsung ke alamat domisili dengan lacak resi realtime.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contactFooter}>
              <Ionicons name="headset-outline" size={16} color="#94A3B8" />
              <Text style={styles.contactText}>
                Layanan Bantuan 24 Jam: Call Center 0800-1234-5678 | info@jejak-sim.id
              </Text>
            </View>
          </View>
        </View>

        {/* Right Column: Unified Form Card (Flush Left layout) */}
        <View style={styles.rightFormCol}>
          <View style={styles.loginCard}>
            {authView === 'login' ? (
              /* 1. Unified Login Form (Customer & Admin in Same Screen) */
              <View style={styles.formBody}>
                <View style={styles.formTopGroup}>
                  <Text style={styles.formTitle}>Masuk ke Aplikasi JEJAK SIM</Text>
                  <Text style={styles.formSubtitle}>
                    Masukkan Alamat Gmail/Email dan Password Anda untuk masuk ke sistem.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Alamat Email / Username</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Masukkan alamat email Anda..."
                      value={emailInput}
                      onChangeText={setEmailInput}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Masukkan password Anda..."
                      value={passwordInput}
                      onChangeText={setPasswordInput}
                      secureTextEntry={true}
                    />
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.submitBtn,
                      pressed && styles.submitBtnPressed,
                    ]}
                    onPress={handleLogin}
                  >
                    <Text style={styles.submitBtnText}>Masuk Sekarang</Text>
                    <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Bottom Link for Registration */}
                <View style={styles.switchAuthRow}>
                  <Text style={styles.switchAuthText}>Belum memiliki akun?</Text>
                  <Pressable onPress={() => setAuthView('register')}>
                    <Text style={styles.switchAuthLink}>Daftar Akun Baru</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              /* 2. Register Form for New Customer Accounts */
              <View style={styles.formBody}>
                <View style={styles.formTopGroup}>
                  <Text style={styles.formTitle}>Daftar Akun Baru JEJAK SIM</Text>
                  <Text style={styles.formSubtitle}>
                    Lengkapi data identitas KTP dan Email Anda untuk mendaftarkan akun pemohon SIM baru.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nama Lengkap (Sesuai KTP)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Contoh: Budi Santoso"
                      value={regNama}
                      onChangeText={setRegNama}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nomor Induk Kependudukan (NIK 16 Digit)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="3174052208xxxxxx"
                      value={regNik}
                      onChangeText={setRegNik}
                      keyboardType="numeric"
                      maxLength={16}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nomor Handphone (Aktif)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0800xxxxxxxx"
                      value={regPhone}
                      onChangeText={setRegPhone}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Alamat Email Active</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="nama@example.com"
                      value={regEmail}
                      onChangeText={setRegEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Buat Password Akun Baru</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Buat password unik..."
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry={true}
                    />
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.submitBtn,
                      pressed && styles.submitBtnPressed,
                    ]}
                    onPress={handleRegister}
                  >
                    <Text style={styles.submitBtnText}>Daftar Akun Baru</Text>
                    <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Bottom Link back to Login */}
                <View style={styles.switchAuthRow}>
                  <Text style={styles.switchAuthText}>Sudah memiliki akun terdaftar?</Text>
                  <Pressable onPress={() => setAuthView('login')}>
                    <Text style={styles.switchAuthLink}>Kembali ke Login</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
    flexGrow: 1,
  },
  loginGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  leftExplanationCol: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
  },
  rightFormCol: {
    flex: 1.2,
    minWidth: Platform.OS === 'web' ? 340 : '100%',
  },
  explanationCard: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  appBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  appBadgeText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotActive: {
    width: 7,
    height: 7,
    borderRadius: 0,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
  expTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  expSubtitle: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  featuresList: {
    gap: 10,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  contactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactText: {
    color: '#94A3B8',
    fontSize: 11,
    flex: 1,
  },
  loginCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    height: '100%',
    flex: 1,
  },
  formBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formTopGroup: {
    gap: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  credentialInfoBox: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    padding: 8,
    borderRadius: 0,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  credTextCol: {
    flex: 1,
  },
  credTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  credText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  credBold: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitBtnPressed: {
    backgroundColor: COLORS.navySoft,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  switchAuthText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  switchAuthLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  spacer: {
    height: 0,
  },
});
