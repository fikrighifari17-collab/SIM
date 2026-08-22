import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { COLORS } from '../colors';
import ServiceCard from '../components/ServiceCard';

export default function ServicesScreen({ onSelectService }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Daftar Layanan Digital</Text>
        <Text style={styles.pageSubtitle}>
          Pilih jenis layanan SIM atau perpanjangan yang ingin Anda akses secara digital.
        </Text>
      </View>

      {/* Group 1: SINAR */}
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>1. SINAR (SIM NASIONAL PRESISI)</Text>
      </View>

      <ServiceCard
        title="Perpanjangan SIM Nasional"
        subtitle="Perpanjangan online SIM A & C. Tanpa antre, tes kesehatan E-Rikkes & EPPsi terintegrasi."
        iconName="card-outline"
        badge="Aktif"
        onPress={() =>
          onSelectService({
            title: 'Perpanjangan SIM Nasional',
            subtitle: 'Proses perpanjangan SIM A/C tanpa antre, dokumen dikirim ke rumah.',
            iconName: 'card-outline',
          })
        }
      />

      <ServiceCard
        title="Pendaftaran SIM Nasional Baru"
        subtitle="Registrasi dan pengujian teori online dari rumah. Ujian praktik di SATPAS pilihan."
        iconName="document-text-outline"
        badge="Aktif"
        onPress={() =>
          onSelectService({
            title: 'Pendaftaran SIM Baru',
            subtitle: 'Ujian teori online dan registrasi jadwal ujian praktik SATPAS.',
            iconName: 'document-text-outline',
          })
        }
      />

      {/* Group 2: SIM Internasional */}
      <View style={styles.groupHeaderMargin}>
        <Text style={styles.groupTitle}>2. SIM INTERNASIONAL</Text>
      </View>

      <ServiceCard
        title="Pendaftaran SIM Internasional"
        subtitle="Verifikasi dokumen digital untuk WNI yang akan bepergian atau berkendara di luar negeri."
        iconName="globe-outline"
        badge="Aktif"
        onPress={() =>
          onSelectService({
            title: 'Pendaftaran SIM Internasional',
            subtitle: 'Permohonan penerbitan SIM Internasional resmi Korlantas POLRI.',
            iconName: 'globe-outline',
          })
        }
      />

      <ServiceCard
        title="Perpanjangan SIM Internasional"
        subtitle="Perpanjangan SIM Internasional dengan mengunggah persyaratan dan SIM lama."
        iconName="sync-outline"
        badge="Aktif"
        onPress={() =>
          onSelectService({
            title: 'Perpanjangan SIM Internasional',
            subtitle: 'Perpanjangan SIM Internasional yang telah mendekati masa berlaku habis.',
            iconName: 'sync-outline',
          })
        }
      />

      {/* Group 3: Segera Hadir */}
      <View style={styles.groupHeaderMargin}>
        <Text style={styles.groupTitle}>3. FITUR LAYANAN SEGERA HADIR</Text>
      </View>

      <ServiceCard
        title="SIGNAL (Samsat Digital Nasional)"
        subtitle="Pembayaran Pajak Kendaraan Bermotor (PKB) & SWDKLLJ secara daring."
        iconName="car-sport-outline"
        badge="Segera Hadir"
        isUpcoming={true}
      />

      <ServiceCard
        title="NTMC POLRI (National Traffic Management Center)"
        subtitle="Informasi pantauan arus lalu lintas realtime dan CCTV jalan raya."
        iconName="videocam-outline"
        badge="Segera Hadir"
        isUpcoming={true}
      />

      <ServiceCard
        title="ETLE (Electronic Traffic Law Enforcement)"
        subtitle="Cek tilang elektronik, pembayaran denda tilang, dan konfirmasi pelanggaran."
        iconName="shield-alert-outline"
        badge="Segera Hadir"
        isUpcoming={true}
      />

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
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  groupHeader: {
    marginBottom: 10,
  },
  groupHeaderMargin: {
    marginTop: 20,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navyMuted,
    letterSpacing: 0.8,
  },
  spacer: {
    height: 32,
  },
});
