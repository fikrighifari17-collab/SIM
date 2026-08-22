import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { useAuthStore } from '../store/authStore';

const MENU_ITEMS = [
  { id: 'data_diri', icon: 'person-outline', label: 'Data Diri' },
  { id: 'riwayat', icon: 'document-text-outline', label: 'Riwayat Pengajuan' },
  { id: 'keamanan', icon: 'shield-checkmark-outline', label: 'Keamanan Akun' },
  { id: 'faq', icon: 'help-circle-outline', label: 'FAQ & Bantuan' },
  { id: 'about', icon: 'information-circle-outline', label: 'Tentang Aplikasi' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation<any>();

  // State untuk Modal Popup
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleMenuPress = (id: string) => {
    if (id === 'riwayat') {
      navigation.navigate('Status');
    } else {
      setActiveModal(id);
    }
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={COLORS.surface} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.nik && (
              <View style={styles.nikBadge}>
                <Ionicons name="card-outline" size={12} color={COLORS.accent} />
                <Text style={styles.nikText}>NIK Terverifikasi</Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.warning} />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <Text style={styles.version}>JEJAK SIM v1.0.0 — Digital Korlantas POLRI</Text>
      </ScrollView>

      {/* --- MODAL POPUPS --- */}

      {/* 1. Modal Data Diri */}
      <Modal visible={activeModal === 'data_diri'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Data Diri Pengguna</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={{ padding: 16 }}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nama Lengkap</Text>
                <Text style={styles.infoValue}>{user?.name || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NIK (Nomor Induk Kependudukan)</Text>
                <Text style={styles.infoValue}>{user?.nik || 'Belum diisi'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nomor HP</Text>
                <Text style={styles.infoValue}>{user?.no_hp || 'Belum diisi'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Peran Akun</Text>
                <Text style={styles.infoValue}>{user?.role?.toUpperCase() || 'CUSTOMER'}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 3. Modal Keamanan Akun */}
      <Modal visible={activeModal === 'keamanan'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Keamanan Akun</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </Pressable>
            </View>
            <View style={{ padding: 20 }}>
              <View style={styles.securityBox}>
                <Ionicons name="shield-checkmark" size={32} color={COLORS.accent} />
                <Text style={styles.securityTitle}>Enkripsi & Keamanan Aktif</Text>
                <Text style={styles.securityDesc}>
                  Sesi dan token autentikasi Anda dilindungi dengan enkripsi SecureStore pada perangkat Android Anda.
                </Text>
              </View>
              <TouchableOpacity style={styles.primaryModalBtn} onPress={() => { setActiveModal(null); Alert.alert('Informasi', 'Fitur Ubah Password tersedia di sesi berikutnya.'); }}>
                <Text style={styles.primaryModalBtnText}>Ubah Kata Sandi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Modal FAQ & Bantuan */}
      <Modal visible={activeModal === 'faq'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FAQ & Bantuan</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={{ padding: 16 }}>
              <Text style={styles.faqQ}>Q: Berapa lama proses perpanjangan SIM?</Text>
              <Text style={styles.faqA}>A: Verifikasi berkas oleh admin membutuhkan waktu 1x24 jam kerja.</Text>

              <Text style={styles.faqQ}>Q: Dokumen apa saja yang wajib diupload?</Text>
              <Text style={styles.faqA}>A: Foto KTP, SIM lama yang masih berlaku, dan hasil verifikasi wajah (Liveness Check).</Text>

              <Text style={styles.faqQ}>Q: Bagaimana metode pembayarannya?</Text>
              <Text style={styles.faqA}>A: Pembayaran dilakukan secara resmi melalui BNI Virtual Account.</Text>

              <View style={styles.helpBox}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                <Text style={styles.helpText}>Layanan Bantuan Korlantas POLRI: 1500669</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 5. Modal Tentang Aplikasi */}
      <Modal visible={activeModal === 'about'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tentang Aplikasi</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </Pressable>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
              <View style={styles.aboutLogo}>
                <Ionicons name="shield-checkmark" size={40} color={COLORS.surface} />
              </View>
              <Text style={styles.aboutAppName}>JEJAK SIM Mobile</Text>
              <Text style={styles.aboutTagline}>Aplikasi Layanan SIM Digital Korlantas POLRI</Text>
              <Text style={styles.aboutVersion}>Versi 1.0.0 (Expo SDK 57)</Text>

              <Text style={styles.aboutDesc}>
                Aplikasi ini dikembangkan untuk mempermudah pendaftaran, perpanjangan, dan pengawasan registrasi SIM A/C serta SIM Internasional secara terintegrasi dengan database Korlantas.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 20, paddingHorizontal: 20,
  },
  headerTitle: { color: COLORS.surface, fontSize: 22, fontWeight: '800' },
  userCard: {
    backgroundColor: COLORS.surface, margin: 16,
    padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatar: {
    width: 60, height: 60, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  userEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  nikBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  nikText: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },
  menuSection: { marginHorizontal: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 15, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuIconWrap: { width: 32, height: 32, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, margin: 16, padding: 14,
    borderWidth: 1, borderColor: COLORS.warning, backgroundColor: COLORS.surface,
  },
  logoutText: { color: COLORS.warning, fontWeight: '700', fontSize: 15 },
  version: { textAlign: 'center', fontSize: 11, color: COLORS.textSecondary, marginBottom: 32 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  infoRow: { marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  securityBox: { alignItems: 'center', padding: 20, backgroundColor: COLORS.background, borderRadius: 8, marginBottom: 20 },
  securityTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 },
  securityDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
  primaryModalBtn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
  primaryModalBtnText: { color: COLORS.surface, fontWeight: '700', fontSize: 14 },
  faqQ: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginTop: 12 },
  faqA: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginBottom: 10, lineHeight: 18 },
  helpBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.background, padding: 14, borderRadius: 8, marginTop: 16 },
  helpText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  aboutLogo: { width: 70, height: 70, backgroundColor: COLORS.primary, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  aboutAppName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  aboutTagline: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  aboutVersion: { fontSize: 12, color: COLORS.accent, fontWeight: '600', marginTop: 6, marginBottom: 16 },
  aboutDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});

