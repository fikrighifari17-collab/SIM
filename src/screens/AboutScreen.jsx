import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function AboutScreen() {
  const [selectedHelpModal, setSelectedHelpModal] = useState(null);

  const helpDetails = {
    callCenter: {
      title: 'Call Center NTMC POLRI',
      icon: 'call-outline',
      phone: '1500669',
      whatsapp: '0811-2115-006',
      desc: 'Pusat bantuan resmi 24 jam Korlantas POLRI untuk informasi SIM, pengaduan keluhan, serta informasi lalu lintas nasional.',
      features: [
        'Layanan Hotline 24 Jam (Telepon: 1500669)',
        'WhatsApp Official NTMC: 0811-2115-006',
        'Bantuan kendala pengajuan SIM & E-Rikkes / EPPsi',
        'Informasi pengiriman SIM fisik PT Pos Indonesia',
      ],
    },
    email: {
      title: 'Email Layanan Pelanggan',
      icon: 'mail-outline',
      emailAddress: 'support@jejaksim.polri.go.id',
      officialEmail: 'ntmc@korlantas.polri.go.id',
      desc: 'Layanan dukungan pelanggan resmi via surel untuk bantuan verifikasi dokumen, perubahan data, dan klaim pengiriman.',
      features: [
        'Support Email: support@jejaksim.polri.go.id',
        'Email Resmi Korlantas: ntmc@korlantas.polri.go.id',
        'Waktu Respon Balasan: Maksimal 1x24 jam kerja',
        'Sertakan Nomor Resi Pengajuan SIM saat mengirim email',
      ],
    },
    privacy: {
      title: 'Kebijakan Privasi & Syarat Ketentuan',
      icon: 'document-text-outline',
      desc: 'Standar regulasi perlindungan data pribadi pemohon SIM sesuai Undang-Undang No. 27 Tahun 2022.',
      features: [
        'Enkripsi Data Biometrik Wajah & NIK KTP level militer AES-256 bit',
        'Integrasi resmi terverifikasi dengan Dukcapil Kemendagri RI',
        'Data pribadi pengguna tidak pernah diperjualbelikan kepada pihak ketiga',
        'SIM fisik dikirim dalam amplop tertutup bersegel aman POLRI',
      ],
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Digital ID Card Preview */}
      <View style={styles.sectionMargin}>
        <Text style={styles.sectionTitle}>DIGITAL ID SAYA</Text>
      </View>

      <View style={styles.idCard}>
        <View style={styles.idCardHeader}>
          <View style={styles.idLogoRow}>
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.idCardHeaderTitle}>JEJAK SIM — DIGITAL ID</Text>
          </View>
          <Text style={styles.idStatus}>TERVERIFIKASI</Text>
        </View>

        <View style={styles.idCardBody}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={36} color={COLORS.navySoft} />
          </View>
          <View style={styles.idDetails}>
            <Text style={styles.idName}>BUDI SANTOSO</Text>
            <Text style={styles.idNik}>NIK: 3174052208900001</Text>
            <View style={styles.simBadges}>
              <View style={styles.simBadgeItem}>
                <Text style={styles.simBadgeText}>SIM A: AKTIF (2029)</Text>
              </View>
              <View style={styles.simBadgeItem}>
                <Text style={styles.simBadgeText}>SIM C: AKTIF (2028)</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.idCardFooter}>
          <Ionicons name="qr-code-outline" size={18} color="#94A3B8" />
          <Text style={styles.idFooterText}>Terenkripsi Standar Keamanan Data POLRI</Text>
        </View>
      </View>

      {/* Profile & Security Info */}
      <View style={styles.sectionMargin}>
        <Text style={styles.sectionTitle}>STATUS KEAMANAN AKUN</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="scan-circle-outline" size={22} color={COLORS.success} />
          <View style={styles.infoCol}>
            <Text style={styles.infoItemTitle}>Biometric Authentication</Text>
            <Text style={styles.infoItemDesc}>Wajah & Liveness terhubung dengan data KTP Kemendagri.</Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.borderTop]}>
          <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
          <View style={styles.infoCol}>
            <Text style={styles.infoItemTitle}>Enkripsi Data End-to-End</Text>
            <Text style={styles.infoItemDesc}>Seluruh dokumen SIM & transaksi dilindungi protokol keamanan SSL/TLS.</Text>
          </View>
        </View>
      </View>

      {/* Informasi Aplikasi & Kontak */}
      <View style={styles.sectionMargin}>
        <Text style={styles.sectionTitle}>TENTANG & BANTUAN</Text>
      </View>

      <View style={styles.menuList}>
        <Pressable
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          onPress={() => setSelectedHelpModal(helpDetails.callCenter)}
        >
          <Ionicons name="call-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Call Center NTMC POLRI (1500669)</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.navyMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.menuItem, styles.borderTop, pressed && styles.menuItemPressed]}
          onPress={() => setSelectedHelpModal(helpDetails.email)}
        >
          <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Email Layanan Pelanggan</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.navyMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.menuItem, styles.borderTop, pressed && styles.menuItemPressed]}
          onPress={() => setSelectedHelpModal(helpDetails.privacy)}
        >
          <Ionicons name="document-text-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Kebijakan Privasi & Syarat Ketentuan</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.navyMuted} />
        </Pressable>
      </View>

      {/* Modal Detail Pop-up untuk TENTANG & BANTUAN */}
      <Modal
        visible={selectedHelpModal !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedHelpModal(null)}
      >
        {selectedHelpModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name={selectedHelpModal.icon} size={20} color="#FFFFFF" />
                  <Text style={styles.modalHeaderTitle}>{selectedHelpModal.title}</Text>
                </View>
                <Pressable onPress={() => setSelectedHelpModal(null)}>
                  <Ionicons name="close" size={22} color="#FFFFFF" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDesc}>{selectedHelpModal.desc}</Text>

                <View style={styles.helpFeaturesBox}>
                  <Text style={styles.helpFeaturesTitle}>Rincian Informasi Resmi:</Text>
                  {selectedHelpModal.features.map((feat, idx) => (
                    <View key={idx} style={styles.helpFeatureRow}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                      <Text style={styles.helpFeatureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedHelpModal(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Tutup Informasi</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      {/* App Version Footer */}
      <View style={styles.footerVersion}>
        <Text style={styles.versionTitle}>JEJAK SIM</Text>
        <Text style={styles.versionText}>Versi Aplikasi v2.4.0 (Build Presisi 2026)</Text>
        <Text style={styles.copyrightText}>© 2026 JEJAK SIM — Layanan SIM Digital</Text>
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
    paddingVertical: 16,
    width: '100%',
  },
  sectionMargin: {
    marginTop: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navyMuted,
    letterSpacing: 0.8,
  },
  idCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    overflow: 'hidden',
    marginBottom: 16,
  },
  idCardHeader: {
    backgroundColor: COLORS.navySoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idCardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  idStatus: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
  },
  idCardBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 0,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  idDetails: {
    flex: 1,
  },
  idName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  idNik: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  simBadges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  simBadgeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
  },
  simBadgeText: {
    color: '#F1F5F9',
    fontSize: 11,
    fontWeight: '600',
  },
  idCardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idFooterText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoItemDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 12,
  },
  menuList: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  menuItemPressed: {
    backgroundColor: '#F1F5F9',
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 37, 64, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    maxWidth: 520,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  modalBody: {
    padding: 18,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 21,
    marginBottom: 16,
  },
  helpFeaturesBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    gap: 10,
  },
  helpFeaturesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  helpFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpFeatureText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  modalCloseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 0,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footerVersion: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  versionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  copyrightText: {
    fontSize: 11,
    color: COLORS.navyMuted,
    marginTop: 4,
  },
  spacer: {
    height: 32,
  },
});
