import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function AboutScreen() {
  const [selectedHelpModal, setSelectedHelpModal] = useState(null);

  // Address state for SIM delivery by Pos Indonesia
  const [deliveryAddress, setDeliveryAddress] = useState({
    namaPenerima: 'BUDI SANTOSO',
    noHp: '081298765432',
    alamatLengkap: 'Jl. Jend. Sudirman No. 45, RT 003/RW 005',
    kelurahan: 'Kel. Gelora',
    kecamatan: 'Kec. Tanah Abang',
    kotaKab: 'Jakarta Pusat',
    provinsi: 'DKI Jakarta',
    kodePos: '10270',
  });

  const [isEditAddressModal, setIsEditAddressModal] = useState(false);
  const [editForm, setEditForm] = useState(deliveryAddress);
  const [showSavedSuccess, setShowSavedSuccess] = useState(false);

  const handleSaveAddress = () => {
    setDeliveryAddress(editForm);
    setIsEditAddressModal(false);
    setShowSavedSuccess(true);
  };

  const helpDetails = {
    callCenter: {
      title: 'Call Center & Support Simulation',
      icon: 'call-outline',
      phone: '0800-1234-5678',
      whatsapp: '0812-9999-8888',
      desc: 'Pusat bantuan simulasi 24 jam untuk informasi SIM, pengaduan keluhan, serta simulasi informasi pengajuan.',
      features: [
        'Layanan Hotline Simulasi (Telepon: 0800-1234-5678)',
        'WhatsApp Support Simulasi: 0812-9999-8888',
        'Bantuan kendala pengajuan SIM & E-Rikkes / EPPsi',
        'Informasi pengiriman SIM fisik PT Pos Indonesia',
      ],
    },
    email: {
      title: 'Email Layanan Pelanggan',
      icon: 'mail-outline',
      emailAddress: 'support@jejak-sim.id',
      officialEmail: 'help@jejak-sim.id',
      desc: 'Layanan dukungan pelanggan via surel untuk bantuan verifikasi dokumen, perubahan data, dan klaim pengiriman.',
      features: [
        'Support Email: support@jejak-sim.id',
        'Email Helpdesk: help@jejak-sim.id',
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
        'SIM fisik dikirim dalam amplop tertutup bersegel aman',
      ],
    },
    security: {
      title: 'Panduan Keamanan Sistem (Anti-Hacker)',
      icon: 'shield-checkmark-outline',
      desc: 'Standar protokol keamanan siber komprehensif untuk melindungi data pengguna dari serangan hacker.',
      features: [
        '1. Autentikasi: Password Hashing (bcrypt/Argon2) & MFA/2FA Role Admin',
        '2. Validasi Input: Server-side Validation, Anti-SQL Injection & Anti-XSS Sanitization',
        '3. Enkripsi Communication: HTTPS/TLS 1.3 & Encrypted Database Storage at Rest',
        '4. API Protection: Short-Lived JWT Token Expiry & Rate Limiting Anti-DDoS',
        '5. Infrastructure: Web Application Firewall (WAF) & Dependency Audit (npm audit)',
        '6. Secure SDLC: Code Review, Penetration Testing & Anomaly Logging System',
        '7. HTTP Security Headers: CSP, X-Frame-Options DENY, & HSTS Protocol',
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
            <Text style={styles.idName}>{deliveryAddress.namaPenerima}</Text>
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
          <Text style={styles.idFooterText}>Terenkripsi Standar Keamanan Data SIM Online</Text>
        </View>
      </View>

      {/* Alamat Pengiriman SIM Section */}
      <View style={styles.sectionMargin}>
        <Text style={styles.sectionTitle}>ALAMAT PENGIRIMAN SIM FISIK (POS INDONESIA)</Text>
      </View>

      <View style={styles.addressCard}>
        <View style={styles.addressHeaderRow}>
          <View style={styles.addressHeaderTitleRow}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.addressCardTitle}>Alamat Domisili Pengiriman SIM</Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => {
              setEditForm(deliveryAddress);
              setIsEditAddressModal(true);
            }}
          >
            <Ionicons name="create-outline" size={14} color={COLORS.accent} />
            <Text style={styles.editBtnText}>Ubah / Update Alamat</Text>
          </Pressable>
        </View>

        <View style={styles.addressDetailsBox}>
          <Text style={styles.addressRecipientName}>
            {deliveryAddress.namaPenerima}{' '}
            <Text style={{ fontSize: 12, fontWeight: 'normal', color: COLORS.textSecondary }}>
              (Sesuai Nama KTP)
            </Text>
          </Text>
          <Text style={styles.addressPhoneText}>No. HP: {deliveryAddress.noHp}</Text>
          <Text style={styles.addressFullText}>
            Alamat Pengiriman:{'\n'}
            <Text style={{ fontWeight: '600', color: COLORS.textPrimary }}>
              {deliveryAddress.alamatLengkap}, {deliveryAddress.kelurahan}, {deliveryAddress.kecamatan},{' '}
              {deliveryAddress.kotaKab}, {deliveryAddress.provinsi} ({deliveryAddress.kodePos})
            </Text>
          </Text>

          <View style={styles.courierInfoRow}>
            <Ionicons name="car" size={16} color={COLORS.primary} />
            <Text style={styles.courierInfoText}>
              Ekspedisi Pengiriman:{' '}
              <Text style={{ fontWeight: '700', color: COLORS.primary }}>
                PT Pos Indonesia (Pengiriman Terenkripsi & Asuransi Resmi)
              </Text>
            </Text>
          </View>
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
          <Text style={styles.menuText}>Call Center Support (Simulasi)</Text>
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

        <Pressable
          style={({ pressed }) => [styles.menuItem, styles.borderTop, pressed && styles.menuItemPressed]}
          onPress={() => setSelectedHelpModal(helpDetails.security)}
        >
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
          <Text style={styles.menuText}>Panduan Keamanan Sistem (Anti-Hacker)</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.navyMuted} />
        </Pressable>
      </View>

      {/* Modal Edit Alamat Pengiriman SIM */}
      <Modal
        visible={isEditAddressModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsEditAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 520 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="location" size={20} color="#FFFFFF" />
                <Text style={styles.modalHeaderTitle}>Update Alamat Pengiriman SIM</Text>
              </View>
              <Pressable onPress={() => setIsEditAddressModal(false)}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalDesc}>
                Alamat ini digunakan oleh Kurir PT Pos Indonesia untuk mengantarkan kartu SIM fisik setelah lulus cetak oleh SATPAS:
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap Penerima (Sesuai KTP):</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.namaPenerima}
                  onChangeText={(val) => setEditForm({ ...editForm, namaPenerima: val })}
                  placeholder="Masukkan nama penerima..."
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>No. Handphone / WhatsApp Active:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.noHp}
                  onChangeText={(val) => setEditForm({ ...editForm, noHp: val })}
                  keyboardType="phone-pad"
                  placeholder="Contoh: 081298765432..."
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Alamat Jalan, No. Rumah, RT/RW:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.alamatLengkap}
                  onChangeText={(val) => setEditForm({ ...editForm, alamatLengkap: val })}
                  placeholder="Contoh: Jl. Jend. Sudirman No. 45, RT 003/RW 005..."
                />
              </View>

              <View style={styles.rowTwoCols}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Kelurahan:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.kelurahan}
                    onChangeText={(val) => setEditForm({ ...editForm, kelurahan: val })}
                    placeholder="Kelurahan..."
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Kecamatan:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.kecamatan}
                    onChangeText={(val) => setEditForm({ ...editForm, kecamatan: val })}
                    placeholder="Kecamatan..."
                  />
                </View>
              </View>

              <View style={styles.rowTwoCols}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Kota / Kabupaten:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.kotaKab}
                    onChangeText={(val) => setEditForm({ ...editForm, kotaKab: val })}
                    placeholder="Kota / Kabupaten..."
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Provinsi:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.provinsi}
                    onChangeText={(val) => setEditForm({ ...editForm, provinsi: val })}
                    placeholder="Provinsi..."
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Kode Pos:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.kodePos}
                  onChangeText={(val) => setEditForm({ ...editForm, kodePos: val })}
                  keyboardType="numeric"
                  placeholder="5 digit kode pos..."
                />
              </View>

              <Pressable style={styles.saveAddressBtn} onPress={handleSaveAddress}>
                <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
                <Text style={styles.saveAddressBtnText}>SIMPAN ALAMAT PENGIRIMAN</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Sukses Update Alamat */}
      <Modal
        visible={showSavedSuccess}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSavedSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 420, alignItems: 'center', padding: 24 }]}>
            <Ionicons name="checkmark-circle" size={56} color={COLORS.success} />
            <Text style={styles.successModalTitle}>Alamat Pengiriman Diperbarui!</Text>
            <Text style={styles.successModalDesc}>
              Alamat domisili pengiriman SIM Anda telah berhasil disimpan. Kurir PT Pos Indonesia akan mengantarkan SIM fisik ke lokasi ini setelah proses cetak selesai.
            </Text>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setShowSavedSuccess(false)}
            >
              <Text style={styles.modalCloseBtnText}>Mengerti & Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal Detail Bantuan / Kontak NTMC & Kebijakan Privasi */}
      <Modal
        visible={selectedHelpModal !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedHelpModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name={selectedHelpModal?.icon || 'help-circle-outline'} size={20} color="#FFFFFF" />
                <Text style={styles.modalHeaderTitle}>{selectedHelpModal?.title}</Text>
              </View>
              <Pressable onPress={() => setSelectedHelpModal(null)}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalDesc}>{selectedHelpModal?.desc}</Text>

              {selectedHelpModal?.features && (
                <View style={styles.helpFeaturesBox}>
                  {selectedHelpModal.features.map((feat, idx) => (
                    <View key={idx} style={styles.helpFeatureRow}>
                      <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.helpFeatureText}>{feat}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action buttons based on help item */}
              {selectedHelpModal?.phone && (
                <View style={{ gap: 10, marginTop: 16 }}>
                  <Pressable
                    style={styles.actionContactBtn}
                    onPress={() => {
                      if (Platform.OS === 'web' && typeof window !== 'undefined') {
                        window.open(`tel:${selectedHelpModal.phone}`);
                      } else {
                        alert(`Menghubungi Call Center: ${selectedHelpModal.phone}`);
                      }
                    }}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                    <Text style={styles.actionContactBtnText}>Hubungi Telepon {selectedHelpModal.phone}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionContactBtn, { backgroundColor: '#16A34A' }]}
                    onPress={() => {
                      if (Platform.OS === 'web') {
                        alert('Simulasi WhatsApp Support: Menghubungi Layanan Bantuan Prototype Dummy (Bukan Nomor Asli)');
                      } else {
                        Alert.alert('Simulasi WhatsApp', 'Menghubungi Layanan Support Prototype Dummy.');
                      }
                    }}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                    <Text style={styles.actionContactBtnText}>Chat WhatsApp Support (Simulasi)</Text>
                  </Pressable>
                </View>
              )}

              {selectedHelpModal?.emailAddress && (
                <View style={{ marginTop: 16 }}>
                  <Pressable
                    style={styles.actionContactBtn}
                    onPress={() => {
                      if (Platform.OS === 'web' && typeof window !== 'undefined') {
                        window.open(`mailto:${selectedHelpModal.emailAddress}`);
                      } else {
                        alert(`Kirim email ke ${selectedHelpModal.emailAddress}`);
                      }
                    }}
                  >
                    <Ionicons name="mail" size={16} color="#FFFFFF" />
                    <Text style={styles.actionContactBtnText}>Kirim Email Customer Support</Text>
                  </Pressable>
                </View>
              )}

              <Pressable
                style={[styles.modalCloseBtn, { marginTop: 16 }]}
                onPress={() => setSelectedHelpModal(null)}
              >
                <Text style={styles.modalCloseBtnText}>Tutup</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
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

  /* Address Card Styles */
  addressCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    borderRadius: 0,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  addressHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  addressDetailsBox: {
    gap: 6,
  },
  addressRecipientName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  addressPhoneText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  addressFullText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginVertical: 4,
  },
  courierInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginTop: 4,
  },
  courierInfoText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
  },

  /* Security & Info Cards */
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
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
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
  actionContactBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  actionContactBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  saveAddressBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  saveAddressBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  successModalDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
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
    paddingHorizontal: 20,
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
