import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function PaymentScreen({ submissions = [], onUpdateStatus }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedSubForPayment, setSelectedSubForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('BRI_VA');
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);

  const filteredSubmissions = submissions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.nama.toLowerCase().includes(q) ||
      item.nik.toLowerCase().includes(q) ||
      item.resiId.toLowerCase().includes(q) ||
      item.serviceTitle.toLowerCase().includes(q) ||
      (item.jenisSim && item.jenisSim.toLowerCase().includes(q));

    let matchesStatus = true;
    if (statusFilter === 'Pending') {
      matchesStatus = item.status === 'Pending';
    } else if (statusFilter === 'SiapBayar') {
      matchesStatus = item.status === 'Disetujui';
    } else if (statusFilter === 'Lunas') {
      matchesStatus = item.status === 'Lunas' || item.status === 'Disetujui & Cetak';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner Header */}
      <View style={styles.headerBanner}>
        <View style={styles.headerBadgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PORTAL PEMBAYARAN PNBP ONLINE</Text>
          </View>
          <Text style={styles.headerSub}>Standar SIM Presisi Korlantas POLRI</Text>
        </View>
        <Text style={styles.headerTitle}>Pembayaran Biaya PNBP & Lacak Status SIM</Text>
        <Text style={styles.headerDesc}>
          Lakukan pembayaran PNBP secara aman melalui Virtual Account / QRIS setelah pengajuan dokumen Anda disetujui oleh Petugas Verifikator POLRI.
        </Text>
      </View>

      {/* 1. Official Flow Explanation Card (TOP) */}
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <Ionicons name="card-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoCardTitle}>Kapan Pembayaran Dilakukan?</Text>
        </View>
        <Text style={styles.infoDescText}>
          Mengikuti alur resmi SIM Presisi, pembayaran PNBP <Text style={{ fontWeight: '700' }}>bukan di awal</Text>, melainkan setelah data & dokumen Anda diverifikasi valid:
        </Text>
        
        <View style={styles.flowStepsBox}>
          <Text style={styles.flowStepItem}>1. Isi Data Diri & Upload Dokumen (E-KTP / SIM)</Text>
          <Text style={styles.flowStepArrow}>↓</Text>
          <Text style={styles.flowStepItem}>2. Verifikasi Dokumen oleh Petugas POLRI</Text>
          <Text style={styles.flowStepArrow}>↓</Text>
          <Text style={styles.flowStepHighlight}>3. PEMBAYARAN (Baru muncul setelah disetujui)</Text>
          <Text style={styles.flowStepArrow}>↓</Text>
          <Text style={styles.flowStepItem}>4. Pencetakan & Pengiriman SIM ke Alamat Domisili</Text>
        </View>

        <View style={styles.noticeNoteBox}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.noticeNoteText}>
            Pola pembayaran setelah verifikasi mencegah biaya refund jika dokumen tidak valid atau foto buram.
          </Text>
        </View>
      </View>

      {/* 2. Submissions List & Payment Portal (UNDERNEATH / BOTTOM) */}
      <View style={styles.sectionHeaderMargin}>
        <Text style={styles.sectionTitle}>DAFTAR TAGIHAN & RESI PENGAJUAN ANDA</Text>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan No. Resi, Nama, NIK, atau Jenis SIM..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={16}
              color={COLORS.textSecondary}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>

        {/* Filter Pills Bar */}
        <View style={styles.filterPillsRow}>
          {[
            { id: 'Semua', label: 'Semua Status' },
            { id: 'Pending', label: 'Menunggu Verifikasi' },
            { id: 'SiapBayar', label: 'Siap Dibayar' },
            { id: 'Lunas', label: 'Lunas' },
          ].map((pill) => {
            const isActive = statusFilter === pill.id;
            return (
              <Pressable
                key={pill.id}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setStatusFilter(pill.id)}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {pill.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

          {/* Submissions List */}
          <View style={styles.listContainer}>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => {
                const isApproved = sub.status === 'Disetujui';
                const isPaid = sub.status === 'Lunas' || sub.status === 'Disetujui & Cetak';
                const isPending = sub.status === 'Pending';
                const isRejected = sub.status === 'Ditolak';

                return (
                  <View key={sub.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemResiCol}>
                        <Text style={styles.resiText}>{sub.resiId}</Text>
                        <Text style={styles.applicantText}>
                          {sub.nama} • <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{sub.jenisSim}</Text>
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          isPaid && styles.statusPaidBadge,
                          isApproved && !isPaid && styles.statusApprovedBadge,
                          isPending && styles.statusPendingBadge,
                          isRejected && styles.statusRejectedBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isPaid && styles.statusPaidBadgeText,
                            isApproved && !isPaid && styles.statusApprovedBadgeText,
                            isPending && styles.statusPendingBadgeText,
                            isRejected && styles.statusRejectedBadgeText,
                          ]}
                        >
                          {isPaid
                            ? 'TERCONFIRMASI (LUNAS)'
                            : isApproved
                            ? 'VERIFIKASI LOLOS (SIAP BAYAR)'
                            : isPending
                            ? 'MENUNGGU VERIFIKASI'
                            : 'DITOLAK'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.itemDetailsBox}>
                      <Text style={styles.itemDetailText}>Layanan: <Text style={{ fontWeight: '700' }}>{sub.serviceTitle}</Text></Text>
                      <Text style={styles.itemDetailText}>SATPAS: {sub.satpas} | Tgl: {sub.date}</Text>
                    </View>

                    {/* Action Buttons */}
                    {isApproved && !isPaid && (
                      <Pressable
                        style={({ pressed }) => [
                          styles.payNowBtn,
                          pressed && styles.payNowBtnPressed,
                        ]}
                        onPress={() => setSelectedSubForPayment(sub)}
                      >
                        <Ionicons name="card-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.payNowBtnText}>
                          BAYAR PNBP ONLINE SEKARANG (Rp 125.000)
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                      </Pressable>
                    )}

                    {isPending && (
                      <View style={styles.pendingNoticeBox}>
                        <Ionicons name="time-outline" size={16} color="#D97706" />
                        <Text style={styles.pendingNoticeText}>
                          Dokumen sedang diperiksa Petugas POLRI. Tombol <Text style={{ fontWeight: '700' }}>"Bayar Online"</Text> akan otomatis muncul setelah verifikasi disetujui.
                        </Text>
                      </View>
                    )}

                    {isPaid && (
                      <View style={styles.paidNoticeBox}>
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                        <Text style={styles.paidNoticeText}>
                          Pembayaran LUNAS. SIM sedang diproses & dicetak oleh SATPAS untuk dikirim via Kurir Pos Indonesia.
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="wallet-outline" size={40} color={COLORS.textSecondary} />
                <Text style={styles.emptyTitle}>Tidak Ada Data Tagihan</Text>
                <Text style={styles.emptySub}>Tidak ada pengajuan SIM yang cocok dengan filter atau pencarian Anda.</Text>
              </View>
            )}
          </View>

      {/* Modal Portal Pembayaran PNBP Online */}
      <Modal
        visible={selectedSubForPayment !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedSubForPayment(null)}
      >
        {selectedSubForPayment && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxWidth: 520 }]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <Ionicons name="card" size={20} color="#FFFFFF" />
                  <Text style={styles.modalHeaderTitle}>Portal Pembayaran PNBP Online (SIM Presisi)</Text>
                </View>
                <Pressable onPress={() => setSelectedSubForPayment(null)}>
                  <Ionicons name="close" size={22} color="#FFFFFF" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.paymentSummaryBox}>
                  <Text style={styles.paymentSummaryTitle}>RINCIAN TAGIHAN RESMI PNBP POLRI</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>No. Resi Registrasi:</Text>
                    <Text style={styles.summaryValBold}>{selectedSubForPayment.resiId}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Pemohon / NIK:</Text>
                    <Text style={styles.summaryVal}>{selectedSubForPayment.nama} ({selectedSubForPayment.nik})</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Jenis Layanan SIM:</Text>
                    <Text style={styles.summaryVal}>{selectedSubForPayment.serviceTitle} ({selectedSubForPayment.jenisSim})</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Biaya PNBP SIM:</Text>
                    <Text style={styles.summaryVal}>Rp 100.000</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Biaya Kurir Pos Indonesia:</Text>
                    <Text style={styles.summaryVal}>Rp 25.000</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                    <Text style={styles.summaryTotalLabel}>TOTAL PEMBAYARAN:</Text>
                    <Text style={styles.summaryTotalVal}>Rp 125.000</Text>
                  </View>
                </View>

                <Text style={styles.paymentMethodTitle}>PILIH METODE PEMBAYARAN VIRTUAL ACCOUNT / QRIS:</Text>
                
                {[
                  { id: 'BRI_VA', name: 'Virtual Account BRI (BRIva)', icon: 'business-outline' },
                  { id: 'BNI_VA', name: 'Virtual Account BNI', icon: 'business-outline' },
                  { id: 'MANDIRI_VA', name: 'Virtual Account Bank Mandiri', icon: 'business-outline' },
                  { id: 'BCA_VA', name: 'Virtual Account Bank BCA', icon: 'business-outline' },
                  { id: 'QRIS', name: 'QRIS Presisi (GoPay, OVO, ShopeePay, DANA)', icon: 'qr-code-outline' },
                ].map((method) => (
                  <Pressable
                    key={method.id}
                    style={[
                      styles.methodItem,
                      paymentMethod === method.id && styles.methodItemActive,
                    ]}
                    onPress={() => setPaymentMethod(method.id)}
                  >
                    <Ionicons name={method.icon} size={18} color={paymentMethod === method.id ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={[styles.methodName, paymentMethod === method.id && styles.methodNameActive]}>{method.name}</Text>
                    <Ionicons name={paymentMethod === method.id ? 'radio-button-on' : 'radio-button-off'} size={18} color={paymentMethod === method.id ? COLORS.primary : COLORS.textSecondary} />
                  </Pressable>
                ))}

                <Pressable
                  style={styles.confirmPayBtn}
                  onPress={() => {
                    if (onUpdateStatus) {
                      onUpdateStatus(selectedSubForPayment.id, 'Lunas');
                    }
                    setSelectedSubForPayment(null);
                    setPaymentSuccessModal(true);
                  }}
                >
                  <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmPayBtnText}>KONFIRMASI BAYAR LUNAS (Rp 125.000)</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      {/* Modal Sukses Pembayaran */}
      <Modal
        visible={paymentSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPaymentSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 440, alignItems: 'center', padding: 24 }]}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            <Text style={styles.paySuccessTitle}>Pembayaran PNBP Lunas!</Text>
            <Text style={styles.paySuccessDesc}>
              Terima kasih, pembayaran sebesar <Text style={{ fontWeight: '800' }}>Rp 125.000</Text> telah terkonfirmasi otomatis oleh sistem Korlantas POLRI. SIM Anda saat ini memasuki tahap pencetakan dan siap dikirimkan oleh Kurir PT Pos Indonesia.
            </Text>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setPaymentSuccessModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup & Lacak SIM</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  headerBanner: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  badgeText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '800',
  },
  headerSub: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerDesc: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 800,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 24,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoDescText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  flowStepsBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    gap: 4,
  },
  flowStepItem: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  flowStepArrow: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
    textAlign: 'center',
  },
  flowStepHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.success,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noticeNoteBox: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeNoteText: {
    fontSize: 12,
    color: COLORS.primary,
    flex: 1,
    lineHeight: 17,
  },
  sectionHeader: {
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
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
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 0,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    borderRadius: 0,
    gap: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemResiCol: {
    flex: 1,
  },
  resiText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  applicantText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0,
  },
  statusPaidBadge: {
    backgroundColor: '#DCFCE7',
  },
  statusPaidBadgeText: {
    color: COLORS.success,
    fontWeight: '800',
    fontSize: 11,
  },
  statusApprovedBadge: {
    backgroundColor: '#DBEAFE',
  },
  statusApprovedBadgeText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 11,
  },
  statusPendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingBadgeText: {
    color: '#D97706',
    fontWeight: '800',
    fontSize: 11,
  },
  statusRejectedBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusRejectedBadgeText: {
    color: COLORS.warning,
    fontWeight: '800',
    fontSize: 11,
  },
  itemDetailsBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 2,
  },
  itemDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  payNowBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  payNowBtnPressed: {
    backgroundColor: '#15803D',
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pendingNoticeBox: {
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#EAB308',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingNoticeText: {
    fontSize: 12,
    color: '#854D0E',
    flex: 1,
  },
  paidNoticeBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: COLORS.success,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paidNoticeText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
    flex: 1,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    width: '100%',
    maxHeight: '90%',
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
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  paymentSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  paymentSummaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  summaryValBold: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '800',
  },
  summaryTotalRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.success,
  },
  paymentMethodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  methodItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  methodItemActive: {
    backgroundColor: '#F0F9FF',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  methodName: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: 10,
  },
  methodNameActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  confirmPayBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  confirmPayBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  paySuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  paySuccessDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
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
