import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';
import FAQItem from '../components/FAQItem';

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'Apa itu aplikasi JEJAK SIM?',
      a: 'JEJAK SIM adalah portal resmi satu pintu layanan perpanjangan dan pendaftaran SIM digital yang mengintegrasikan seluruh administrasi lalu lintas, seperti SIM Nasional (SINAR), SIM Internasional, hingga layanan masa depan secara praktis.',
    },
    {
      q: 'Apa saja fitur layanan yang saat ini sudah tersedia?',
      a: 'Saat ini layanan aktif meliputi SINAR (Perpanjangan SIM Nasional A & C, Pendaftaran SIM Baru) dan penerbitan/perpanjangan SIM Internasional. Fitur lain seperti SIGNAL (Samsat Digital) dan ETLE akan segera terhubung.',
    },
    {
      q: 'Bagaimana cara mendownload dan melakukan registrasi akun?',
      a: 'Unduh aplikasi melalui Google Play Store (Android) atau App Store (iOS). Buka aplikasi, masukkan nomor ponsel aktif, verifikasi OTP, lalu masukkan data NIK KTP dan verifikasi wajah (Face Recognition/Liveness).',
    },
    {
      q: 'Apa saja kelebihan perpanjangan SIM online dibanding cara manual?',
      a: 'Anda tidak perlu mengantre di Satpas, ujian teori dilakukan daring, tes kesehatan & psikologi dilakukan online via aplikasi mitra E-Rikkes & EPPsi, dan SIM baru yang sudah dicetak akan dikirimkan langsung oleh kurir ke alamat rumah Anda.',
    },
    {
      q: 'Bagaimana cara mendapat bantuan jika terjadi kendala teknis?',
      a: 'Anda dapat mengklik menu Akun / Bantuan di aplikasi, atau menghubungi Customer Care melalui email info@jejak-sim.id atau Call Center Simulasi 0800-1234-5678 / WhatsApp 0812-9999-8888.',
    },
    {
      q: 'Apakah SIM fisik masih tetap dikirimkan ke rumah?',
      a: 'Ya. Setelah seluruh verifikasi dokumen, tes kesehatan, dan pembayaran selesai, fisik kartu SIM akan dicetak oleh Satpas pilihan dan dikirim melalui layanan ekspedisi terpercaya ke alamat Anda.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Pusat Bantuan & FAQ</Text>
        <Text style={styles.subtitle}>
          Temukan jawaban atas pertanyaan umum mengenai penggunaan aplikasi dan pengajuan SIM online.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pertanyaan atau kata kunci..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={COLORS.textSecondary}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      <View style={styles.faqList}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              defaultExpanded={index === 0}
            />
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons name="alert-circle-outline" size={32} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Tidak ditemukan pertanyaan yang cocok.</Text>
          </View>
        )}
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
  headerBox: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  faqList: {
    gap: 2,
  },
  emptyBox: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  spacer: {
    height: 32,
  },
});
