import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';
import ServiceCard from '../components/ServiceCard';

export default function HomeScreen({ onSelectService, onNavigateToTab }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  const valueProps = [
    {
      id: 'digital-id',
      icon: 'finger-print-outline',
      title: 'Digital ID',
      desc: 'Identitas digital terenkripsi resmi sebagai representasi dokumen fisik.',
      detailTitle: 'Teknologi Digital ID Korlantas',
      detailContent:
        'Digital ID adalah identitas digital resmi berbasis QR Code terenkripsi yang diakui secara sah oleh Korlantas POLRI. Memungkinkan pemilik SIM menunjukkan bukti lisensi berkendara aktif langsung dari smartphone saat pemeriksaan jalan raya tanpa khawatir kehilangan kartu fisik.',
      points: [
        'Terenkripsi dengan standar enkripsi AES-256 bit',
        'Verifikasi QR Code realtime untuk petugas di lapangan',
        'Terhubung otomatis dengan status kelayakan SIM fisik',
      ],
    },
    {
      id: 'biometric',
      icon: 'scan-outline',
      title: 'Biometric Authentication',
      desc: 'Face Recognition & Liveness terintegrasi langsung data E-KTP Kemendagri.',
      detailTitle: 'Sistem Keamanan Biometrik Liveness',
      detailContent:
        'Verifikasi pemohon menggunakan teknologi Face Recognition biometrik tingkat tinggi yang dilengkapi dengan Liveness Detection untuk memastikan bahwa pemohon adalah pemilik sah dari E-KTP yang didaftarkan.',
      points: [
        'Pencocokan langsung ke Database KTP Kemendagri',
        'Deteksi Liveness untuk mencegah joki / foto palsu',
        'Keamanan data pribadi terjamin 100%',
      ],
    },
    {
      id: 'fast-process',
      icon: 'flash-outline',
      title: 'Proses Cepat',
      desc: 'Pengajuan dan ujian teori dilakukan daring tanpa antrean panjang.',
      detailTitle: 'Proses Serba Digital dalam Hitungan Menit',
      detailContent:
        'Seluruh tahapan mulai dari pengisian formulir, upload berkas, hingga ujian teori SIM dilakukan secara online dari mana saja. Anda tidak perlu lagi datang dan mengantre sejak pagi di kantor SATPAS.',
      points: [
        'Ujian Teori SIM berbasis simulasi online interaktif',
        'Pemeriksaan Kesehatan (E-Rikkes) & Psikologi (EPPsi) via aplikasi',
        'Notifikasi status pengajuan secara realtime',
      ],
    },
    {
      id: 'easy-payment',
      icon: 'wallet-outline',
      title: 'Kemudahan Pembayaran',
      desc: 'Mendukung berbagai metode pembayaran instan (Virtual Account, E-Wallet).',
      detailTitle: 'Pilihan Metode Pembayaran Lengkap',
      detailContent:
        'Pembayaran biaya PNBP SIM dan biaya pengiriman dapat dilakukan dengan instan menggunakan berbagai metode pembayaran digital pilihan Anda.',
      points: [
        'Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata)',
        'E-Wallet & QRIS (GoPay, OVO, ShopeePay, DANA)',
        'Konfirmasi pembayaran otomatis tanpa upload resi manual',
      ],
    },
    {
      id: 'home-delivery',
      icon: 'home-outline',
      title: 'Pengiriman ke Rumah',
      desc: 'SIM yang dicetak dikirimkan langsung ke alamat domisili pemohon.',
      detailTitle: 'Layanan Pengiriman Ekspedisi Resmi',
      detailContent:
        'Setelah SIM fisik dicetak oleh SATPAS pilihan, dokumen kartu SIM dikemas secara aman dalam amplop terenkripsi khusus dan dikirimkan oleh kurir PT Pos Indonesia langsung ke rumah Anda.',
      points: [
        'Pengiriman terjamin aman dengan asuransi dokumen',
        'Lacak posisi kurir & resi pengiriman realtime di aplikasi',
        'Diterima langsung oleh pemohon sesuai nama KTP',
      ],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Unduh Aplikasi',
      desc: 'Unduh via Play Store / App Store resmi Korlantas POLRI.',
      subSteps: [
        'Buka Google Play Store (Android) atau App Store (iOS)',
        'Cari aplikasi resmi "Digital Korlantas POLRI"',
        'Unduh & izinkan akses lokasi serta kamera',
      ],
    },
    {
      num: '02',
      title: 'Registrasi & Verifikasi',
      desc: 'Verifikasi E-KTP & Face Recognition biometrik secara otomatis.',
      subSteps: [
        'Masukkan nomor HP aktif untuk menerima kode OTP WhatsApp',
        'Input 16 digit NIK E-KTP & verifikasi alamat email',
        'Lakukan pemindaian wajah (Face Recognition) sesuai petunjuk',
      ],
    },
    {
      num: '03',
      title: 'Layanan Siap Akses',
      desc: 'Pilih jenis SIM, selesaikan ujian/kesehatan, dan tunggu SIM dikirim.',
      subSteps: [
        'Pilih menu "SINAR" -> Perpanjangan / Pendaftaran SIM',
        'Selesaikan tes kesehatan E-Rikkes & Psikologi EPPsi',
        'Lakukan pembayaran dan lacak pengiriman fisik SIM ke rumah Anda',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Banner / Welcome Hero Section */}
      <View style={styles.welcomeBox}>
        <View style={styles.welcomeTop}>
          <View style={styles.badgeRow}>
            <View style={styles.welcomeBadge}>
              <Text style={styles.welcomeBadgeText}>PRESISI DIGITAL</Text>
            </View>
            <View style={styles.liveTag}>
              <View style={styles.dotActive} />
              <Text style={styles.liveTagText}>Sistem Online Aktif</Text>
            </View>
          </View>

          <Text style={styles.welcomeTitle}>JEJAK SIM</Text>
          <Text style={styles.welcomeDesc}>
            Kemudahan pengurusan perpanjangan dan pendaftaran SIM Nasional & Internasional dalam satu genggaman tanpa antre di SATPAS.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.heroBtn,
              pressed && styles.heroBtnPressed,
            ]}
            onPress={() => onNavigateToTab('services')}
          >
            <Text style={styles.heroBtnText}>Mulai Pengajuan SIM Online</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Hero Quick Metrics */}
        <View style={styles.heroStatsRow}>
          <View style={styles.statItem}>
            <Ionicons name="flash-outline" size={18} color="#60A5FA" />
            <Text style={styles.statText}>100% Daring</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="car-outline" size={18} color="#60A5FA" />
            <Text style={styles.statText}>Kurir Pos Indonesia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#60A5FA" />
            <Text style={styles.statText}>Biometrik E-KTP</Text>
          </View>
        </View>
      </View>

      {/* Layanan Utama Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>LAYANAN UTAMA</Text>
        </View>
        <Pressable onPress={() => onNavigateToTab('services')}>
          <Text style={styles.seeAllText}>Lihat Semua Layanan ➔</Text>
        </Pressable>
      </View>

      {/* Services Grid (Responsive Layout) */}
      <View style={styles.serviceGrid}>
        <View style={styles.gridCol}>
          <ServiceCard
            title="Perpanjangan SIM Nasional (SINAR)"
            subtitle="Perpanjangan SIM A & C online tanpa antre. SIM dikirim ke rumah."
            iconName="card-outline"
            badge="Presisi Online"
            onPress={() =>
              onSelectService({
                title: 'Perpanjangan SIM Nasional',
                subtitle: 'Layanan perpanjangan SIM A/C online resmi Korlantas POLRI.',
                iconName: 'card-outline',
              })
            }
          />
        </View>

        <View style={styles.gridCol}>
          <ServiceCard
            title="Pendaftaran SIM Nasional Baru (SINAR)"
            subtitle="Ujian teori online dari rumah. Ujian praktik di SATPAS pilihan."
            iconName="document-text-outline"
            badge="Presisi Online"
            onPress={() =>
              onSelectService({
                title: 'Pendaftaran SIM Baru',
                subtitle: 'Pendaftaran dan registrasi ujian teori SIM A/C online.',
                iconName: 'document-text-outline',
              })
            }
          />
        </View>

        <View style={styles.gridCol}>
          <ServiceCard
            title="Pendaftaran SIM Internasional (SINAR)"
            subtitle="Verifikasi dokumen digital online untuk permohonan SIM Internasional."
            iconName="globe-outline"
            badge="Presisi Online"
            onPress={() =>
              onSelectService({
                title: 'SIM Internasional',
                subtitle: 'Layanan penerbitan SIM Internasional untuk perjalanan luar negeri.',
                iconName: 'globe-outline',
              })
            }
          />
        </View>
      </View>

      {/* Keunggulan Utama Header */}
      <View style={styles.sectionHeaderMargin}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>KEUNGGULAN UTAMA</Text>
        </View>
        <Text style={styles.sectionHint}>Klik pada kartu keunggulan untuk melihat rincian penjelasan detail.</Text>
      </View>

      {/* Value Grid (Interactive Clickable Cards) */}
      <View style={styles.valueGrid}>
        {valueProps.map((item, idx) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.valueCard,
              pressed && styles.valueCardPressed,
            ]}
            onPress={() => setSelectedValue(item)}
          >
            <View style={styles.valueCardTop}>
              <View style={styles.valueIconWrapper}>
                <Ionicons name={item.icon} size={22} color={COLORS.primary} />
              </View>
              <View style={styles.valueTextCol}>
                <View style={styles.valueTitleRow}>
                  <Text style={styles.valueTitle}>{item.title}</Text>
                  <Ionicons name="information-circle-outline" size={18} color={COLORS.accent} />
                </View>
                <Text style={styles.valueDesc}>{item.desc}</Text>
              </View>
            </View>

            <View style={styles.clickDetailRow}>
              <Text style={styles.clickDetailText}>Lihat Penjelasan Detail</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.accent} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Alur Penggunaan Header */}
      <View style={styles.sectionHeaderMargin}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>ALUR PENGGUNAAN APLIKASI</Text>
        </View>
        <Text style={styles.sectionHint}>Klik langkah di bawah untuk melihat rincian petunjuk setiap alur.</Text>
      </View>

      {/* Responsive Horizontal / Vertical Interactive Steps Cards */}
      <View style={styles.stepsRow}>
        {steps.map((step, idx) => {
          const isExpanded = activeStepIndex === idx;
          return (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.stepCard,
                isExpanded && styles.stepCardExpanded,
                pressed && styles.stepCardPressed,
              ]}
              onPress={() => setActiveStepIndex(isExpanded ? null : idx)}
            >
              <View style={styles.stepCardHeader}>
                <Text style={styles.stepNumLarge}>{step.num}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up-circle' : 'chevron-down-circle-outline'}
                  size={22}
                  color={isExpanded ? COLORS.primary : COLORS.navyMuted}
                />
              </View>

              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>

              {/* Expandable Sub-steps details */}
              {isExpanded && (
                <View style={styles.subStepsBox}>
                  <Text style={styles.subStepHeading}>Petunjuk Langkah {step.num}:</Text>
                  {step.subSteps.map((sub, sIdx) => (
                    <View key={sIdx} style={styles.subStepItem}>
                      <Text style={styles.subStepBullet}>{sIdx + 1}.</Text>
                      <Text style={styles.subStepText}>{sub}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Modal Detail Keunggulan Utama */}
      <Modal
        visible={selectedValue !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedValue(null)}
      >
        {selectedValue && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <View style={styles.modalIconBox}>
                    <Ionicons name={selectedValue.icon} size={22} color="#FFFFFF" />
                  </View>
                  <Text style={styles.modalHeaderTitle}>{selectedValue.detailTitle}</Text>
                </View>
                <Pressable onPress={() => setSelectedValue(null)} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDesc}>{selectedValue.detailContent}</Text>

                <View style={styles.pointsBox}>
                  <Text style={styles.pointsTitle}>Key Highlights & Fitur:</Text>
                  {selectedValue.points.map((pt, pIdx) => (
                    <View key={pIdx} style={styles.pointRow}>
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                      <Text style={styles.pointText}>{pt}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedValue(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Tutup Penjelasan</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      <View style={styles.spacer} />
    </ScrollView>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '100%',
  },
  welcomeBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 0,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
  },
  welcomeTop: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  welcomeBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  welcomeBadgeText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  liveTag: {
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
  liveTagText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  welcomeDesc: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 700,
    marginBottom: 18,
  },
  heroBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  heroBtnPressed: {
    backgroundColor: '#1D4ED8',
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderMargin: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIndicator: {
    width: 4,
    height: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCol: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
    display: 'flex',
  },
  valueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valueCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
    justifyContent: 'space-between',
  },
  valueCardPressed: {
    backgroundColor: COLORS.cardHover,
    borderColor: COLORS.accent,
  },
  valueCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  valueIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 0,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  valueTextCol: {
    flex: 1,
  },
  valueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  valueDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  clickDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  clickDetailText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stepCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
    padding: 18,
    flex: 1,
    minWidth: Platform.OS === 'web' ? 280 : '100%',
  },
  stepCardExpanded: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8FAFC',
  },
  stepCardPressed: {
    backgroundColor: '#F1F5F9',
  },
  stepCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumLarge: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  subStepsBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 0,
    gap: 8,
  },
  subStepHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  subStepBullet: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  subStepText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 17,
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
    maxWidth: 540,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
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
    paddingRight: 10,
  },
  modalIconBox: {
    width: 34,
    height: 34,
    borderRadius: 0,
    backgroundColor: COLORS.navySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  pointsBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    gap: 10,
  },
  pointsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointText: {
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
  spacer: {
    height: 40,
  },
});
