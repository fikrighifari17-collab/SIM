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

export default function AdminDashboardScreen({
  submissions,
  onUpdateStatus,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Compute Statistics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const approvedCount = submissions.filter(s => s.status === 'Disetujui').length;
  const rejectedCount = submissions.filter(s => s.status === 'Ditolak').length;

  const filteredSubmissions = submissions.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.nama.toLowerCase().includes(q) ||
      item.nik.toLowerCase().includes(q) ||
      item.resiId.toLowerCase().includes(q) ||
      item.serviceTitle.toLowerCase().includes(q)
    );
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Admin Top Header Banner */}
      <View style={styles.adminHeader}>
        <View style={styles.adminTitleCol}>
          <View style={styles.adminBadgeRow}>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>PANEL VERIFIKATOR POLRI</Text>
            </View>
            <Text style={styles.adminHeaderSub}>Aplikasi JEJAK SIM v2.4</Text>
          </View>
          <Text style={styles.adminHeaderTitle}>Dashboard Pengelolaan SIM Online</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && styles.logoutBtnPressed,
          ]}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
          <Text style={styles.logoutBtnText}>Keluar Admin</Text>
        </Pressable>
      </View>

      {/* Quick Metrics Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total Permohonan</Text>
        </View>

        <View style={[styles.statCard, { borderTopColor: '#EAB308' }]}>
          <Text style={[styles.statNum, { color: '#D97706' }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Menunggu Verifikasi</Text>
        </View>

        <View style={[styles.statCard, { borderTopColor: COLORS.success }]}>
          <Text style={[styles.statNum, { color: COLORS.success }]}>{approvedCount}</Text>
          <Text style={styles.statLabel}>Disetujui & Cetak</Text>
        </View>

        <View style={[styles.statCard, { borderTopColor: COLORS.warning }]}>
          <Text style={[styles.statNum, { color: COLORS.warning }]}>{rejectedCount}</Text>
          <Text style={styles.statLabel}>Permohonan Ditolak</Text>
        </View>
      </View>

      {/* Main Table Section */}
      <View style={styles.tableSectionHeader}>
        <Text style={styles.tableSectionTitle}>DAFTAR PENGAJUAN LAYANAN MASYARAKAT</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan NIK, Nama Pemohon, atau No Resi..."
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
      </View>

      {/* Applications List Table */}
      <View style={styles.tableCard}>
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              {/* Row Left Data */}
              <View style={styles.rowMainCol}>
                <View style={styles.rowTitleRow}>
                  <Text style={styles.resiIdText}>{item.resiId}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'Disetujui' && styles.statusApproved,
                      item.status === 'Ditolak' && styles.statusRejected,
                      item.status === 'Pending' && styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === 'Disetujui' && styles.statusApprovedText,
                        item.status === 'Ditolak' && styles.statusRejectedText,
                        item.status === 'Pending' && styles.statusPendingText,
                      ]}
                    >
                      {item.status === 'Pending' ? 'Menunggu Verifikasi' : item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.applicantNameText}>{item.nama}</Text>
                <Text style={styles.applicantDetailsText}>
                  NIK: {item.nik} | No HP: {item.noHp}
                </Text>
                <Text style={styles.serviceTypeText}>
                  Layanan: <Text style={{ fontWeight: '700' }}>{item.serviceTitle}</Text> ({item.jenisSim})
                </Text>
                <Text style={styles.satpasText}>SATPAS: {item.satpas} | Tgl: {item.date}</Text>
              </View>

              {/* Row Action Buttons */}
              <View style={styles.rowActionsCol}>
                <Pressable
                  style={styles.detailBtn}
                  onPress={() => setSelectedApplicant(item)}
                >
                  <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.detailBtnText}>Detail Berkas</Text>
                </Pressable>

                {item.status === 'Pending' && (
                  <View style={styles.actionBtnGroup}>
                    <Pressable
                      style={styles.approveBtn}
                      onPress={() => onUpdateStatus(item.id, 'Disetujui')}
                    >
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Setujui</Text>
                    </Pressable>

                    <Pressable
                      style={styles.rejectBtn}
                      onPress={() => onUpdateStatus(item.id, 'Ditolak')}
                    >
                      <Ionicons name="close" size={14} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Tolak</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyRow}>
            <Ionicons name="documents-outline" size={32} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Tidak ada pengajuan SIM yang cocok.</Text>
          </View>
        )}
      </View>

      {/* Applicant Document Detail Modal */}
      <Modal
        visible={selectedApplicant !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedApplicant(null)}
      >
        {selectedApplicant && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Detail Berkas Pemohon: {selectedApplicant.nama}</Text>
                <Pressable onPress={() => setSelectedApplicant(null)}>
                  <Ionicons name="close" size={22} color="#FFFFFF" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>No. Resi Registrasi:</Text>
                  <Text style={styles.detailValBold}>{selectedApplicant.resiId}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nama Lengkap Pemohon:</Text>
                  <Text style={styles.detailVal}>{selectedApplicant.nama}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>NIK E-KTP:</Text>
                  <Text style={styles.detailVal}>{selectedApplicant.nik}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nomor WhatsApp:</Text>
                  <Text style={styles.detailVal}>{selectedApplicant.noHp}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Jenis Layanan SIM:</Text>
                  <Text style={styles.detailVal}>{selectedApplicant.serviceTitle} ({selectedApplicant.jenisSim})</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>SATPAS Penerbit:</Text>
                  <Text style={styles.detailVal}>{selectedApplicant.satpas}</Text>
                </View>

                <View style={styles.verificationBox}>
                  <Text style={styles.verificationTitle}>Status Verifikasi Berkas Biometrik & Kesehatan:</Text>
                  <View style={styles.verifItem}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.verifText}>E-KTP & Face Recognition Biometrik: Valid (100% Match)</Text>
                  </View>
                  <View style={styles.verifItem}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.verifText}>Hasil Pemeriksaan Kesehatan E-Rikkes: Layak / Fit</Text>
                  </View>
                  <View style={styles.verifItem}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.verifText}>Hasil Tes Psikologi EPPsi: Lulus (Skor 88)</Text>
                  </View>
                </View>

                {selectedApplicant.status === 'Pending' && (
                  <View style={styles.modalActionRow}>
                    <Pressable
                      style={styles.modalApproveBtn}
                      onPress={() => {
                        onUpdateStatus(selectedApplicant.id, 'Disetujui');
                        setSelectedApplicant(null);
                      }}
                    >
                      <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                      <Text style={styles.modalApproveText}>Setujui & Cetak SIM Sekarang</Text>
                    </Pressable>

                    <Pressable
                      style={styles.modalRejectBtn}
                      onPress={() => {
                        onUpdateStatus(selectedApplicant.id, 'Ditolak');
                        setSelectedApplicant(null);
                      }}
                    >
                      <Ionicons name="close-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.modalRejectText}>Tolak Pengajuan</Text>
                    </Pressable>
                  </View>
                )}

                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedApplicant(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Tutup Modal</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        )}
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
  adminHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  adminTitleCol: {
    flex: 1,
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  adminBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  adminBadgeText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '800',
  },
  adminHeaderSub: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  adminHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: COLORS.navySoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
  },
  logoutBtnPressed: {
    backgroundColor: '#334155',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
    flex: 1,
    minWidth: Platform.OS === 'web' ? 200 : '48%',
  },
  statNum: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tableSectionHeader: {
    marginBottom: 12,
    gap: 10,
  },
  tableSectionTitle: {
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
  tableCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  rowMainCol: {
    flex: 1,
    minWidth: 260,
  },
  rowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  resiIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPendingText: {
    color: '#D97706',
  },
  statusApprovedText: {
    color: COLORS.success,
  },
  statusRejectedText: {
    color: COLORS.warning,
  },
  applicantNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  applicantDetailsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  serviceTypeText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  satpasText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rowActionsCol: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  detailBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  approveBtn: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rejectBtn: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyRow: {
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailVal: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  detailValBold: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '800',
  },
  verificationBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 16,
    gap: 8,
  },
  verificationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  verifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifText: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  modalActionRow: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  modalApproveBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 10,
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  modalApproveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalRejectBtn: {
    backgroundColor: COLORS.warning,
    paddingVertical: 10,
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  modalRejectText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalCloseBtn: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 0,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  spacer: {
    height: 40,
  },
});
