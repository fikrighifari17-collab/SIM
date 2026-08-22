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
  const [adminSubTab, setAdminSubTab] = useState('verifikasi'); // 'verifikasi' | 'pembayaran' | 'pengiriman' | 'tarif' | 'laporan' | 'alamat'
  const [searchQuery, setSearchQuery] = useState('');
  const [simFilter, setSimFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('Semua');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Admin Dynamic Settings & Shipping Manager States (Screenshot 3)
  const [tariffSettings, setTariffSettings] = useState({
    pnbpSimA: '120000',
    pnbpSimC: '100000',
    pnbpSimInt: '250000',
    adminFee: '15000',
    pgFee: '5000',
    ppnRate: '11',
  });

  const [shippingZones, setShippingZones] = useState([
    { id: 1, name: 'Zona 1 (DKI, Jabar, Banten)', fee: '20000' },
    { id: 2, name: 'Zona 2 (Jateng, Jatim, DIY, Bali)', fee: '30000' },
    { id: 3, name: 'Zona 3 (Sumatera, Kalimantan, Sulawesi)', fee: '45000' },
    { id: 4, name: 'Zona 4 (Papua, Maluku, NTT, NTB)', fee: '60000' },
  ]);

  const [resiInputs, setResiInputs] = useState({});
  const [shippingStatuses, setShippingStatuses] = useState({});

  const [problematicAddresses, setProblematicAddresses] = useState([
    {
      id: 'ADDR-101',
      nama: 'Budi Santoso (Dummy)',
      resiId: 'SIM-2026-0822-889',
      noHp: '0800-0000-0003',
      issue: 'RT/RW & Nomor Rumah belum diisi lengkap (Kurir Pos gagal antar)',
      status: 'Perlu Follow Up',
    },
    {
      id: 'ADDR-102',
      nama: 'Siti Aminah (Dummy)',
      resiId: 'SIM-2026-0822-441',
      noHp: '0800-0000-0004',
      issue: 'Kode Pos 10270 tidak cocok dengan kelurahan yang dipilih',
      status: 'Perlu Follow Up',
    },
  ]);
  
  // Toast / Action notification modal state
  const [noticeModal, setNoticeModal] = useState({
    visible: false,
    title: '',
    message: '',
    icon: 'checkmark-circle',
  });

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    item: null,
    action: '',
    reason: '',
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Resi Registrasi,Nama Pemohon,NIK,Jenis Layanan,SATPAS,Biaya Layanan (PNBP),Admin Platform,Payment Gateway,Subtotal,PPN 11%,Ongkir Pos,Total Bayar,Status Pembayaran,Tanggal\n';

    submissions.forEach((item, idx) => {
      const pnbp = parseInt(tariffSettings.pnbpSimA, 10) || 120000;
      const admin = parseInt(tariffSettings.adminFee, 10) || 15000;
      const pg = parseInt(tariffSettings.pgFee, 10) || 5000;
      const subtotal = pnbp + admin + pg;
      const ppn = Math.round(subtotal * (parseFloat(tariffSettings.ppnRate) / 100 || 0.11));
      const ongkir = 30000;
      const total = subtotal + ppn + ongkir;

      const row = [
        idx + 1,
        `"${item.resiId}"`,
        `"${item.nama}"`,
        `"${item.nik}"`,
        `"${item.jenisSim || 'SIM A'}"`,
        `"${item.satpas}"`,
        pnbp,
        admin,
        pg,
        subtotal,
        ppn,
        ongkir,
        total,
        `"${item.status}"`,
        `"${item.date || '2026-08-22'}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `JEJAK_SIM_Laporan_Keuangan_2026_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setNoticeModal({
        visible: true,
        title: 'Export Laporan Keuangan',
        message: 'Laporan Keuangan Format Excel (.csv) berhasil di-generate dan diunduh.',
        icon: 'document-text',
      });
    }
  };

  // Compute Statistics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'Pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'Disetujui').length;
  const rejectedCount = submissions.filter((s) => s.status === 'Ditolak').length;

  // Filtered submissions for Verification View
  const filteredSubmissions = submissions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.nama.toLowerCase().includes(q) ||
      item.nik.toLowerCase().includes(q) ||
      item.resiId.toLowerCase().includes(q) ||
      item.serviceTitle.toLowerCase().includes(q) ||
      (item.jenisSim && item.jenisSim.toLowerCase().includes(q));

    const matchesSim =
      simFilter === 'Semua' ||
      (item.jenisSim && item.jenisSim.toLowerCase() === simFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'Semua' || item.status === statusFilter;

    return matchesSearch && matchesSim && matchesStatus;
  });

  // Filtered submissions for Payment View
  const filteredPayments = submissions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.nama.toLowerCase().includes(q) ||
      item.nik.toLowerCase().includes(q) ||
      item.resiId.toLowerCase().includes(q) ||
      item.serviceTitle.toLowerCase().includes(q) ||
      (item.jenisSim && item.jenisSim.toLowerCase().includes(q));

    let matchesPaymentStatus = true;
    if (paymentStatusFilter === 'Lunas') {
      matchesPaymentStatus = item.status === 'Lunas' || item.status === 'Disetujui & Cetak';
    } else if (paymentStatusFilter === 'Pending') {
      matchesPaymentStatus = item.status === 'Pending';
    } else if (paymentStatusFilter === 'Gagal') {
      matchesPaymentStatus = item.status === 'Ditolak';
    }

    return matchesSearch && matchesPaymentStatus;
  });

  const handleTriggerConfirm = (item, action) => {
    setConfirmModal({
      visible: true,
      item,
      action,
      reason: '',
    });
  };

  // Helper for Payment Status badge formatting (Matches Screenshot UI)
  const getPaymentBadgeInfo = (item) => {
    if (item.status === 'Lunas' || item.status === 'Disetujui & Cetak') {
      return { label: 'Lunas', dotColor: '#10B981', textColor: '#34D399', date: item.date || '20 Agu 2026' };
    } else if (item.status === 'Pending') {
      return { label: 'Pending', dotColor: '#EAB308', textColor: '#FBBF24', date: '-' };
    } else if (item.status === 'Ditolak') {
      return { label: 'Gagal/Expired', dotColor: '#EF4444', textColor: '#F87171', date: '-' };
    } else if (item.status === 'Disetujui') {
      return { label: 'Siap Dibayar', dotColor: '#3B82F6', textColor: '#60A5FA', date: '-' };
    } else {
      return { label: 'Lunas', dotColor: '#10B981', textColor: '#34D399', date: item.date || '20 Agu 2026' };
    }
  };

  const handleRecheckPayment = (item) => {
    setNoticeModal({
      visible: true,
      title: 'Pengecekan Ulang Status Payment',
      message: `Sistem sedang melakukan sinkronisasi ulang gateway Virtual Account / QRIS untuk NIK ${item.nik} (${item.nama}). Status pembayaran: MENUNGGU PEMBAYARAN MASYARAKAT.`,
      icon: 'sync-circle',
    });
  };

  const handleResendPaymentLink = (item) => {
    setNoticeModal({
      visible: true,
      title: 'Link Pembayaran Terkirim',
      message: `Link tagihan PNBP resmi & nomor Virtual Account terbaru telah dikirimkan ulang ke nomor WhatsApp ${item.noHp} atas nama ${item.nama}.`,
      icon: 'send',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Admin Top Header Banner */}
      <View style={styles.adminHeader}>
        <View style={styles.adminTitleCol}>
          <View style={styles.adminBadgeRow}>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>PANEL VERIFIKATOR SIM ONLINE</Text>
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

      {/* Main Admin Tab Switcher (Screenshot 3 Requirements) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adminTabScrollRow}>
        <Pressable
          style={[
            styles.adminTabBtn,
            adminSubTab === 'verifikasi' && styles.adminTabBtnActive,
          ]}
          onPress={() => setAdminSubTab('verifikasi')}
        >
          <Ionicons
            name="document-text-outline"
            size={16}
            color={adminSubTab === 'verifikasi' ? '#FFFFFF' : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.adminTabBtnText,
              adminSubTab === 'verifikasi' && styles.adminTabBtnTextActive,
            ]}
          >
            Verifikasi Berkas ({submissions.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.adminTabBtn,
            adminSubTab === 'pembayaran' && styles.adminTabBtnActive,
          ]}
          onPress={() => setAdminSubTab('pembayaran')}
        >
          <Ionicons
            name="card-outline"
            size={16}
            color={adminSubTab === 'pembayaran' ? '#FFFFFF' : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.adminTabBtnText,
              adminSubTab === 'pembayaran' && styles.adminTabBtnTextActive,
            ]}
          >
            Rekap Pembayaran ({submissions.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.adminTabBtn,
            adminSubTab === 'pengiriman' && styles.adminTabBtnActive,
          ]}
          onPress={() => setAdminSubTab('pengiriman')}
        >
          <Ionicons
            name="car-outline"
            size={16}
            color={adminSubTab === 'pengiriman' ? '#FFFFFF' : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.adminTabBtnText,
              adminSubTab === 'pengiriman' && styles.adminTabBtnTextActive,
            ]}
          >
            Kelola Pengiriman & Resi
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.adminTabBtn,
            adminSubTab === 'tarif' && styles.adminTabBtnActive,
          ]}
          onPress={() => setAdminSubTab('tarif')}
        >
          <Ionicons
            name="settings-outline"
            size={16}
            color={adminSubTab === 'tarif' ? '#FFFFFF' : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.adminTabBtnText,
              adminSubTab === 'tarif' && styles.adminTabBtnTextActive,
            ]}
          >
            Pengaturan Tarif & Ongkir
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.adminTabBtn,
            adminSubTab === 'laporan' && styles.adminTabBtnActive,
          ]}
          onPress={() => setAdminSubTab('laporan')}
        >
          <Ionicons
            name="bar-chart-outline"
            size={16}
            color={adminSubTab === 'laporan' ? '#FFFFFF' : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.adminTabBtnText,
              adminSubTab === 'laporan' && styles.adminTabBtnTextActive,
            ]}
          >
            Laporan Keuangan & Export
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.adminTabBtn,
            adminSubTab === 'alamat' && styles.adminTabBtnActive,
          ]}
          onPress={() => setAdminSubTab('alamat')}
        >
          <Ionicons
            name="warning-outline"
            size={16}
            color={adminSubTab === 'alamat' ? '#FFFFFF' : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.adminTabBtnText,
              adminSubTab === 'alamat' && styles.adminTabBtnTextActive,
            ]}
          >
            Alamat Bermasalah ({problematicAddresses.length})
          </Text>
        </Pressable>
      </ScrollView>

      {/* QUICK METRICS CARDS */}
      <View style={styles.statsGrid}>
        <Pressable
          style={({ pressed }) => [
            styles.statCard,
            statusFilter === 'Semua' && styles.statCardActiveSemua,
            pressed && styles.statCardPressed,
          ]}
          onPress={() => setStatusFilter('Semua')}
        >
          <Text style={styles.statNum}>{totalCount}</Text>
          <View style={styles.statLabelRow}>
            <Text style={styles.statLabel}>Total Permohonan</Text>
            {statusFilter === 'Semua' && <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />}
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.statCard,
            { borderTopColor: '#EAB308' },
            statusFilter === 'Pending' && styles.statCardActivePending,
            pressed && styles.statCardPressed,
          ]}
          onPress={() => setStatusFilter('Pending')}
        >
          <Text style={[styles.statNum, { color: '#D97706' }]}>{pendingCount}</Text>
          <View style={styles.statLabelRow}>
            <Text style={styles.statLabel}>Menunggu Verifikasi</Text>
            {statusFilter === 'Pending' && <Ionicons name="checkmark-circle" size={14} color="#D97706" />}
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.statCard,
            { borderTopColor: COLORS.success },
            statusFilter === 'Disetujui' && styles.statCardActiveApproved,
            pressed && styles.statCardPressed,
          ]}
          onPress={() => setStatusFilter('Disetujui')}
        >
          <Text style={[styles.statNum, { color: COLORS.success }]}>{approvedCount}</Text>
          <View style={styles.statLabelRow}>
            <Text style={styles.statLabel}>Disetujui & Cetak</Text>
            {statusFilter === 'Disetujui' && <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />}
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.statCard,
            { borderTopColor: COLORS.warning },
            statusFilter === 'Ditolak' && styles.statCardActiveRejected,
            pressed && styles.statCardPressed,
          ]}
          onPress={() => setStatusFilter('Ditolak')}
        >
          <Text style={[styles.statNum, { color: COLORS.warning }]}>{rejectedCount}</Text>
          <View style={styles.statLabelRow}>
            <Text style={styles.statLabel}>Permohonan Ditolak</Text>
            {statusFilter === 'Ditolak' && <Ionicons name="checkmark-circle" size={14} color={COLORS.warning} />}
          </View>
        </Pressable>
      </View>

      {/* VIEW 1: VERIFIKASI BERKAS SIM */}
      {adminSubTab === 'verifikasi' && (
        <>
          <View style={styles.tableSectionHeader}>
            <Text style={styles.tableSectionTitle}>DAFTAR PENGAJUAN LAYANAN MASYARAKAT</Text>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari berdasarkan NIK, Nama Pemohon, No Resi, atau Jenis SIM..."
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

            {/* SIM Type Filter Pills Bar */}
            <View style={styles.simFilterBar}>
              <Text style={styles.filterBarLabel}>Filter Golongan SIM:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
                {['Semua', 'SIM A', 'SIM C', 'SIM C1', 'SIM Internasional'].map((simType) => {
                  const isActive = simFilter === simType;
                  const count = simType === 'Semua'
                    ? submissions.length
                    : submissions.filter(s => s.jenisSim && s.jenisSim.toLowerCase() === simType.toLowerCase()).length;

                  return (
                    <Pressable
                      key={simType}
                      style={[
                        styles.simFilterPill,
                        isActive && styles.simFilterPillActive,
                      ]}
                      onPress={() => setSimFilter(simType)}
                    >
                      <Ionicons
                        name={isActive ? 'funnel' : 'funnel-outline'}
                        size={13}
                        color={isActive ? '#FFFFFF' : COLORS.textSecondary}
                      />
                      <Text style={[styles.simFilterPillText, isActive && styles.simFilterPillTextActive]}>
                        {simType} ({count})
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
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
                          onPress={() => handleTriggerConfirm(item, 'Disetujui')}
                        >
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          <Text style={styles.actionBtnText}>Setujui</Text>
                        </Pressable>

                        <Pressable
                          style={styles.rejectBtn}
                          onPress={() => handleTriggerConfirm(item, 'Ditolak')}
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
        </>
      )}

      {/* VIEW 2: REKAPITULASI PEMBAYARAN PNBP ONLINE (MATCHING USER SCREENSHOT DESIGN) */}
      {adminSubTab === 'pembayaran' && (
        <View style={styles.paymentSectionContainer}>
          <View style={styles.tableSectionHeader}>
            <View style={styles.paymentHeaderTitleRow}>
              <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
              <Text style={styles.tableSectionTitle}>REKAPITULASI STATUS PEMBAYARAN PNBP MASYARAKAT</Text>
            </View>

            {/* Filter Pills for Payment Status */}
            <View style={styles.simFilterBar}>
              <Text style={styles.filterBarLabel}>Filter Status Pembayaran:</Text>
              <View style={styles.filterPillsRow}>
                {[
                  { id: 'Semua', label: 'Semua' },
                  { id: 'Lunas', label: 'Lunas' },
                  { id: 'Pending', label: 'Pending' },
                  { id: 'Gagal', label: 'Gagal / Expired' },
                ].map((pPill) => {
                  const isActive = paymentStatusFilter === pPill.id;
                  return (
                    <Pressable
                      key={pPill.id}
                      style={[
                        styles.simFilterPill,
                        isActive && styles.simFilterPillActive,
                      ]}
                      onPress={() => setPaymentStatusFilter(pPill.id)}
                    >
                      <Text style={[styles.simFilterPillText, isActive && styles.simFilterPillTextActive]}>
                        {pPill.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Dark Table Container (Matches Screenshot Aesthetics) */}
          <View style={styles.darkTableContainer}>
            {/* Dark Table Header Row */}
            <View style={styles.darkTableHeaderRow}>
              <Text style={[styles.darkThText, { width: 40, textAlign: 'center' }]}>No</Text>
              <Text style={[styles.darkThText, { flex: 1.6 }]}>Nama Pemohon</Text>
              <Text style={[styles.darkThText, { flex: 1.4 }]}>NIK</Text>
              <Text style={[styles.darkThText, { flex: 1.8 }]}>Jenis Layanan</Text>
              <Text style={[styles.darkThText, { flex: 1.4 }]}>Status Pembayaran</Text>
              <Text style={[styles.darkThText, { flex: 1.2 }]}>Tanggal Bayar</Text>
              <Text style={[styles.darkThText, { flex: 1.4, textAlign: 'center' }]}>Aksi</Text>
            </View>

            {/* Dark Table Rows */}
            {filteredPayments.length > 0 ? (
              filteredPayments.map((item, idx) => {
                const pInfo = getPaymentBadgeInfo(item);
                const maskedNik = item.nik.length > 6 ? item.nik.substring(0, 4) + 'xx...' : item.nik;
                const displayService = item.jenisSim ? `${item.jenisSim} (${item.serviceTitle.includes('Perpanjangan') ? 'Perpanjang' : 'Baru'})` : item.serviceTitle;

                return (
                  <View key={item.id} style={styles.darkTableRow}>
                    <Text style={[styles.darkTdText, { width: 40, textAlign: 'center', fontWeight: '700' }]}>
                      {idx + 1}
                    </Text>
                    
                    <Text style={[styles.darkTdTextBold, { flex: 1.6 }]}>
                      {item.nama}
                    </Text>
                    
                    <Text style={[styles.darkTdTextMuted, { flex: 1.4 }]}>
                      {maskedNik}
                    </Text>
                    
                    <Text style={[styles.darkTdText, { flex: 1.8 }]}>
                      {displayService}
                    </Text>

                    {/* Status Dot Column */}
                    <View style={[styles.darkTdCol, { flex: 1.4, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                      <View style={[styles.colorDot, { backgroundColor: pInfo.dotColor }]} />
                      <Text style={[styles.darkTdStatusText, { color: pInfo.textColor }]}>
                        {pInfo.label}
                      </Text>
                    </View>

                    <Text style={[styles.darkTdTextMuted, { flex: 1.2 }]}>
                      {pInfo.date}
                    </Text>

                    {/* Action Column */}
                    <View style={[styles.darkTdCol, { flex: 1.4, alignItems: 'center', justifyContent: 'center' }]}>
                      {pInfo.label === 'Lunas' && (
                        <Pressable style={styles.darkActionBtnLink} onPress={() => setSelectedApplicant(item)}>
                          <Text style={styles.darkActionBtnLinkText}>Lihat Detail</Text>
                        </Pressable>
                      )}

                      {pInfo.label === 'Pending' && (
                        <Pressable style={styles.darkActionBtnLink} onPress={() => handleRecheckPayment(item)}>
                          <Text style={[styles.darkActionBtnLinkText, { color: '#FBBF24' }]}>Cek Ulang</Text>
                        </Pressable>
                      )}

                      {(pInfo.label === 'Gagal/Expired' || pInfo.label === 'Siap Dibayar') && (
                        <Pressable style={styles.darkActionBtnLink} onPress={() => handleResendPaymentLink(item)}>
                          <Text style={[styles.darkActionBtnLinkText, { color: '#60A5FA' }]}>Kirim Ulang Link</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyDarkRow}>
                <Text style={styles.emptyDarkText}>Tidak ada rekap pembayaran yang cocok.</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* VIEW 3: KELOLA PENGIRIMAN & INPUT RESI POS INDONESIA (Screenshot 3) */}
      {adminSubTab === 'pengiriman' && (
        <View style={styles.paymentSectionContainer}>
          <View style={styles.tableSectionHeader}>
            <View style={styles.paymentHeaderTitleRow}>
              <Ionicons name="car-outline" size={20} color={COLORS.primary} />
              <Text style={styles.tableSectionTitle}>MANAJEMEN PENGIRIMAN & INPUT RESI POS INDONESIA</Text>
            </View>
          </View>

          <View style={styles.adminCardBox}>
            {submissions.filter(s => s.status === 'Lunas' || s.status === 'Disetujui & Cetak' || s.status === 'Disetujui').length > 0 ? (
              submissions.filter(s => s.status === 'Lunas' || s.status === 'Disetujui & Cetak' || s.status === 'Disetujui').map((item) => {
                const currentResi = resiInputs[item.id] !== undefined ? resiInputs[item.id] : (item.posResiNumber || 'POS-SIM-2026-9912');
                const currentStatus = shippingStatuses[item.id] || item.trackingStatus || 'Diserahkan ke Kurir Pos';

                return (
                  <View key={item.id} style={styles.shippingItemRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.shippingApplicantName}>{item.nama}</Text>
                      <Text style={styles.shippingSubText}>Resi App: {item.resiId} • Layanan: {item.jenisSim || 'SIM A'}</Text>
                      <Text style={styles.shippingSubText}>SATPAS: {item.satpas}</Text>
                      <Text style={styles.shippingAddressText}>
                        Alamat Kirim: {item.alamatPengiriman ? `${item.alamatPengiriman.alamatJalan}, ${item.alamatPengiriman.kotaKab}, ${item.alamatPengiriman.provinsi} ${item.alamatPengiriman.kodePos}` : 'Jl. Sudirman No. 45, Jakarta Pusat'}
                      </Text>
                    </View>

                    <View style={{ flex: 1.8, gap: 6 }}>
                      <Text style={styles.adminInputLabel}>No. Resi Pos Indonesia:</Text>
                      <TextInput
                        style={styles.adminTextInput}
                        value={currentResi}
                        onChangeText={(val) => setResiInputs({ ...resiInputs, [item.id]: val })}
                        placeholder="POS-SIM-2026-XXXX"
                      />

                      <Text style={styles.adminInputLabel}>Status Pengiriman Kurir:</Text>
                      <View style={styles.shippingStatusPills}>
                        {['Diproses di SATPAS', 'Diserahkan ke Kurir Pos', 'Dalam Pengiriman', 'Diterima Pemohon'].map((st) => (
                          <Pressable
                            key={st}
                            style={[
                              styles.statusPillBtn,
                              currentStatus === st && styles.statusPillBtnActive,
                            ]}
                            onPress={() => setShippingStatuses({ ...shippingStatuses, [item.id]: st })}
                          >
                            <Text style={[styles.statusPillBtnText, currentStatus === st && styles.statusPillBtnTextActive]}>
                              {st}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      <Pressable
                        style={styles.saveResiBtn}
                        onPress={() => {
                          setNoticeModal({
                            visible: true,
                            title: 'Resi & Status Pengiriman Disimpan',
                            message: `Nomor Resi Pos ${currentResi} & status "${currentStatus}" berhasil diperbarui untuk ${item.nama}. Pemohon dapat melacak realtime di aplikasi.`,
                            icon: 'checkmark-circle',
                          });
                        }}
                      >
                        <Ionicons name="save-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.saveResiBtnText}>Simpan Resi Pos</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyDarkRow}>
                <Text style={styles.emptyDarkText}>Belum ada permohonan SIM lunas yang siap dikirim.</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* VIEW 4: PENGATURAN TARIF PNBP, ADMIN, PG, PPN & ONGKIR PER ZONA (Screenshot 3) */}
      {adminSubTab === 'tarif' && (
        <View style={styles.paymentSectionContainer}>
          <View style={styles.tableSectionHeader}>
            <View style={styles.paymentHeaderTitleRow}>
              <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
              <Text style={styles.tableSectionTitle}>PENGATURAN TARIF & BIAYA SISTEM (DYNAMIC CONFIG)</Text>
            </View>
          </View>

          <View style={styles.adminTwoGridRow}>
            {/* Left: Component Pricing Settings */}
            <View style={[styles.adminCardBox, { flex: 1 }]}>
              <Text style={styles.adminCardTitle}>Pengaturan Tarif Resmi PNBP & Biaya Layanan</Text>
              
              <View style={styles.inputGroupMargin}>
                <Text style={styles.adminInputLabel}>PNBP SIM A (Mobil Baru):</Text>
                <TextInput
                  style={styles.adminTextInput}
                  value={tariffSettings.pnbpSimA}
                  onChangeText={(val) => setTariffSettings({ ...tariffSettings, pnbpSimA: val })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroupMargin}>
                <Text style={styles.adminInputLabel}>PNBP SIM C / C1 (Motor Baru):</Text>
                <TextInput
                  style={styles.adminTextInput}
                  value={tariffSettings.pnbpSimC}
                  onChangeText={(val) => setTariffSettings({ ...tariffSettings, pnbpSimC: val })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroupMargin}>
                <Text style={styles.adminInputLabel}>PNBP SIM Internasional:</Text>
                <TextInput
                  style={styles.adminTextInput}
                  value={tariffSettings.pnbpSimInt}
                  onChangeText={(val) => setTariffSettings({ ...tariffSettings, pnbpSimInt: val })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroupMargin}>
                <Text style={styles.adminInputLabel}>Biaya Admin Platform (Convenience Fee):</Text>
                <TextInput
                  style={styles.adminTextInput}
                  value={tariffSettings.adminFee}
                  onChangeText={(val) => setTariffSettings({ ...tariffSettings, adminFee: val })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroupMargin}>
                <Text style={styles.adminInputLabel}>Biaya Payment Gateway (Opsional PG Fee):</Text>
                <TextInput
                  style={styles.adminTextInput}
                  value={tariffSettings.pgFee}
                  onChangeText={(val) => setTariffSettings({ ...tariffSettings, pgFee: val })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroupMargin}>
                <Text style={styles.adminInputLabel}>Tarif PPN (% Persen):</Text>
                <TextInput
                  style={styles.adminTextInput}
                  value={tariffSettings.ppnRate}
                  onChangeText={(val) => setTariffSettings({ ...tariffSettings, ppnRate: val })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Right: Shipping Rates per Zone */}
            <View style={[styles.adminCardBox, { flex: 1 }]}>
              <Text style={styles.adminCardTitle}>Pengaturan Ongkos Kirim Pos Indonesia per Zona</Text>

              {shippingZones.map((zone, index) => (
                <View key={zone.id} style={styles.zoneRowInput}>
                  <Text style={styles.zoneNameText}>{zone.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>Rp</Text>
                    <TextInput
                      style={[styles.adminTextInput, { width: 110 }]}
                      value={zone.fee}
                      onChangeText={(val) => {
                        const updated = [...shippingZones];
                        updated[index].fee = val;
                        setShippingZones(updated);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}

              <Pressable
                style={[styles.saveResiBtn, { marginTop: 20, paddingVertical: 12 }]}
                onPress={() => {
                  setNoticeModal({
                    visible: true,
                    title: 'Pengaturan Tarif Berhasil Disimpan',
                    message: 'Konfigurasi tarif PNBP, Biaya Admin Rp15.000, Payment Gateway Rp5.000, PPN 11%, dan Ongkir per Zona berhasil diperbarui.',
                    icon: 'checkmark-circle',
                  });
                }}
              >
                <Ionicons name="save" size={16} color="#FFFFFF" />
                <Text style={styles.saveResiBtnText}>SIMPAN SEMUA PERUBAHAN TARIF</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* VIEW 5: LAPORAN KEUANGAN & EXPORT EXCEL (.CSV) (Screenshot 3) */}
      {adminSubTab === 'laporan' && (
        <View style={styles.paymentSectionContainer}>
          <View style={styles.tableSectionHeader}>
            <View style={styles.paymentHeaderTitleRow}>
              <Ionicons name="bar-chart-outline" size={20} color={COLORS.primary} />
              <Text style={styles.tableSectionTitle}>REKAP LAPORAN KEUANGAN PNBP, ADMIN & PPN</Text>
            </View>

            <Pressable style={styles.exportExcelBtn} onPress={handleExportCSV}>
              <Ionicons name="download-outline" size={16} color="#FFFFFF" />
              <Text style={styles.exportExcelBtnText}>EXPORT LAPORAN EXCEL (.CSV)</Text>
            </Pressable>
          </View>

          {/* Revenue Summary Cards */}
          <View style={styles.financialStatsRow}>
            <View style={styles.financialCard}>
              <Text style={styles.financialCardLabel}>Total PNBP Terkumpul</Text>
              <Text style={styles.financialCardVal}>
                Rp{(submissions.length * (parseInt(tariffSettings.pnbpSimA, 10) || 120000)).toLocaleString('id-ID')}
              </Text>
            </View>

            <View style={styles.financialCard}>
              <Text style={styles.financialCardLabel}>Total Biaya Admin Platform</Text>
              <Text style={styles.financialCardVal}>
                Rp{(submissions.length * (parseInt(tariffSettings.adminFee, 10) || 15000)).toLocaleString('id-ID')}
              </Text>
            </View>

            <View style={styles.financialCard}>
              <Text style={styles.financialCardLabel}>Total PPN 11% Resmi</Text>
              <Text style={styles.financialCardVal}>
                Rp{(submissions.length * 15400).toLocaleString('id-ID')}
              </Text>
            </View>

            <View style={styles.financialCard}>
              <Text style={styles.financialCardLabel}>Total Ongkir Pos Indonesia</Text>
              <Text style={styles.financialCardVal}>
                Rp{(submissions.length * 30000).toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          {/* Table Breakdown */}
          <View style={styles.darkTableContainer}>
            <View style={styles.darkTableHeaderRow}>
              <Text style={[styles.darkThText, { width: 35, textAlign: 'center' }]}>No</Text>
              <Text style={[styles.darkThText, { flex: 1.5 }]}>No. Resi</Text>
              <Text style={[styles.darkThText, { flex: 1.5 }]}>Pemohon</Text>
              <Text style={[styles.darkThText, { flex: 1.2 }]}>PNBP</Text>
              <Text style={[styles.darkThText, { flex: 1 }]}>Admin</Text>
              <Text style={[styles.darkThText, { flex: 1 }]}>PG Fee</Text>
              <Text style={[styles.darkThText, { flex: 1 }]}>PPN 11%</Text>
              <Text style={[styles.darkThText, { flex: 1 }]}>Ongkir</Text>
              <Text style={[styles.darkThText, { flex: 1.3 }]}>Total Bayar</Text>
            </View>

            {submissions.map((sub, idx) => {
              const pnbp = parseInt(tariffSettings.pnbpSimA, 10) || 120000;
              const admin = parseInt(tariffSettings.adminFee, 10) || 15000;
              const pg = parseInt(tariffSettings.pgFee, 10) || 5000;
              const subtotal = pnbp + admin + pg;
              const ppn = Math.round(subtotal * 0.11);
              const ongkir = 30000;
              const total = subtotal + ppn + ongkir;

              return (
                <View key={sub.id} style={styles.darkTableRow}>
                  <Text style={[styles.darkTdText, { width: 35, textAlign: 'center' }]}>{idx + 1}</Text>
                  <Text style={[styles.darkTdTextBold, { flex: 1.5 }]}>{sub.resiId}</Text>
                  <Text style={[styles.darkTdText, { flex: 1.5 }]}>{sub.nama}</Text>
                  <Text style={[styles.darkTdText, { flex: 1.2 }]}>Rp{pnbp.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.darkTdTextMuted, { flex: 1 }]}>Rp{admin.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.darkTdTextMuted, { flex: 1 }]}>Rp{pg.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.darkTdTextMuted, { flex: 1 }]}>Rp{ppn.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.darkTdTextMuted, { flex: 1 }]}>Rp{ongkir.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.darkTdTextBold, { color: '#60A5FA', flex: 1.3 }]}>Rp{total.toLocaleString('id-ID')}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* VIEW 6: MANAJEMEN ALAMAT BERMASALAH & FOLLOW UP WA (Screenshot 3) */}
      {adminSubTab === 'alamat' && (
        <View style={styles.paymentSectionContainer}>
          <View style={styles.tableSectionHeader}>
            <View style={styles.paymentHeaderTitleRow}>
              <Ionicons name="warning-outline" size={20} color={COLORS.warning} />
              <Text style={styles.tableSectionTitle}>MANAJEMEN ALAMAT BERMASALAH / GAGAL KURIR POS</Text>
            </View>
          </View>

          <View style={styles.adminCardBox}>
            {problematicAddresses.map((prob) => (
              <View key={prob.id} style={styles.problemAddressRow}>
                <Ionicons name="alert-circle" size={24} color={COLORS.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.problemName}>{prob.nama} ({prob.resiId})</Text>
                  <Text style={styles.problemIssueText}>Kendala: {prob.issue}</Text>
                  <Text style={styles.problemHpText}>No. Handphone: {prob.noHp}</Text>
                </View>

                <Pressable
                  style={styles.waBtn}
                  onPress={() => {
                    setNoticeModal({
                      visible: true,
                      title: 'Simulasi Follow Up WhatsApp',
                      message: `Pesan pengingat simulasi berhasil dikirimkan ke nomor ${prob.noHp} atas nama ${prob.nama} untuk memperbarui alamat pengiriman. (Mode Prototype Dummy)`,
                      icon: 'logo-whatsapp',
                    });
                  }}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                  <Text style={styles.waBtnText}>Follow Up WA (Simulasi)</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

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

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status Pembayaran PNBP:</Text>
                  <Text style={[styles.detailValBold, { color: COLORS.primary }]}>
                    {selectedApplicant.status === 'Lunas' ? 'LUNAS (Rp 125.000)' : 'MENUNGGU VERIFIKASI/PEMBAYARAN'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Berkas Foto E-KTP:</Text>
                  <Text style={styles.detailValBold}>
                    {selectedApplicant.fotoKtpName || 'E-KTP_317405220890_VERIFIED.jpg'} (Valid 100%)
                  </Text>
                </View>

                {selectedApplicant.serviceTitle?.toLowerCase().includes('perpanjangan') && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Berkas Foto SIM Lama:</Text>
                    <Text style={styles.detailValBold}>
                      {selectedApplicant.fotoSimLamaName || 'SIM_LAMA_8892123_VERIFIED.jpg'} (Valid 100%)
                    </Text>
                  </View>
                )}

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
                      onPress={() => handleTriggerConfirm(selectedApplicant, 'Disetujui')}
                    >
                      <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                      <Text style={styles.modalApproveText}>Setujui & Cetak SIM Sekarang</Text>
                    </Pressable>

                    <Pressable
                      style={styles.modalRejectBtn}
                      onPress={() => handleTriggerConfirm(selectedApplicant, 'Ditolak')}
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

      {/* Toast Notice Notification Modal */}
      <Modal
        visible={noticeModal.visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setNoticeModal({ ...noticeModal, visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 440, alignItems: 'center', padding: 24 }]}>
            <Ionicons name={noticeModal.icon} size={56} color={COLORS.primary} />
            <Text style={styles.noticeModalTitle}>{noticeModal.title}</Text>
            <Text style={styles.noticeModalMessage}>{noticeModal.message}</Text>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setNoticeModal({ ...noticeModal, visible: false })}
            >
              <Text style={styles.modalCloseBtnText}>Mengerti & Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 2-Step Verification Confirmation Modal */}
      <Modal
        visible={confirmModal.visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setConfirmModal({ ...confirmModal, visible: false })}
      >
        {confirmModal.item && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxWidth: 480 }]}>
              {/* Confirm Modal Header */}
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor:
                      confirmModal.action === 'Disetujui' ? COLORS.success : COLORS.warning,
                  },
                ]}
              >
                <View style={styles.confirmHeaderRow}>
                  <Ionicons
                    name={confirmModal.action === 'Disetujui' ? 'shield-checkmark' : 'alert-circle'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.modalHeaderTitle}>
                    Konfirmasi Verifikasi Petugas (Step 2/2)
                  </Text>
                </View>
                <Pressable onPress={() => setConfirmModal({ ...confirmModal, visible: false })}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Confirm Modal Body */}
              <View style={styles.modalBody}>
                <View style={styles.confirmBanner}>
                  <Text style={styles.confirmQuestionText}>
                    Apakah Anda yakin ingin{' '}
                    <Text
                      style={{
                        fontWeight: '800',
                        color: confirmModal.action === 'Disetujui' ? COLORS.success : COLORS.warning,
                      }}
                    >
                      {confirmModal.action === 'Disetujui' ? 'MENSETUJUI & MENCETAK' : 'MENOLAK'}
                    </Text>{' '}
                    permohonan SIM masyarakat berikut?
                  </Text>

                  <View style={styles.confirmSummaryBox}>
                    <Text style={styles.confirmSummaryRow}>
                      <Text style={styles.confirmSummaryLabel}>Nama Pemohon: </Text>
                      <Text style={styles.confirmSummaryVal}>{confirmModal.item.nama}</Text>
                    </Text>
                    <Text style={styles.confirmSummaryRow}>
                      <Text style={styles.confirmSummaryLabel}>No. Resi Registrasi: </Text>
                      <Text style={styles.confirmSummaryValBold}>{confirmModal.item.resiId}</Text>
                    </Text>
                    <Text style={styles.confirmSummaryRow}>
                      <Text style={styles.confirmSummaryLabel}>Layanan & Golongan: </Text>
                      <Text style={styles.confirmSummaryVal}>{confirmModal.item.serviceTitle} ({confirmModal.item.jenisSim})</Text>
                    </Text>
                  </View>
                </View>

                {confirmModal.action === 'Ditolak' && (
                  <View style={styles.reasonInputBox}>
                    <Text style={styles.reasonInputLabel}>Alasan Penolakan / Catatan Verifikator:</Text>
                    <TextInput
                      style={styles.reasonTextInput}
                      placeholder="Contoh: Foto E-KTP buram / Berkas kesehatan kadaluarsa"
                      value={confirmModal.reason}
                      onChangeText={(text) => setConfirmModal({ ...confirmModal, reason: text })}
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </View>
                )}

                <View style={styles.confirmActionRow}>
                  <Pressable
                    style={[
                      styles.confirmFinalBtn,
                      {
                        backgroundColor:
                          confirmModal.action === 'Disetujui' ? COLORS.success : COLORS.warning,
                      },
                    ]}
                    onPress={() => {
                      onUpdateStatus(confirmModal.item.id, confirmModal.action);
                      setConfirmModal({ visible: false, item: null, action: '', reason: '' });
                      if (selectedApplicant) setSelectedApplicant(null);
                    }}
                  >
                    <Ionicons
                      name={confirmModal.action === 'Disetujui' ? 'checkmark-done-circle' : 'close-circle'}
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.confirmFinalBtnText}>
                      Ya, Konfirmasi {confirmModal.action === 'Disetujui' ? 'Setujui' : 'Tolak'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.confirmCancelBtn}
                    onPress={() => setConfirmModal({ visible: false, item: null, action: '', reason: '' })}
                  >
                    <Text style={styles.confirmCancelBtnText}>Batal</Text>
                  </Pressable>
                </View>
              </View>
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
    marginBottom: 16,
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

  /* Main Admin Tab Row Styles */
  adminTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  adminTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adminTabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  adminTabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  adminTabBtnTextActive: {
    color: '#FFFFFF',
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
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  statCardPressed: {
    opacity: 0.8,
  },
  statCardActiveSemua: {
    backgroundColor: '#F0F9FF',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  statCardActivePending: {
    backgroundColor: '#FEFCE8',
    borderColor: '#EAB308',
    borderWidth: 2,
  },
  statCardActiveApproved: {
    backgroundColor: '#F0FDF4',
    borderColor: COLORS.success,
    borderWidth: 2,
  },
  statCardActiveRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: COLORS.warning,
    borderWidth: 2,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
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
  paymentHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  simFilterBar: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 0,
  },
  simFilterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  simFilterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  simFilterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    gap: 8,
    alignItems: 'flex-end',
  },
  actionBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyRow: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  /* DARK THEME TABLE STYLES (MATCHES USER SCREENSHOT) */
  paymentSectionContainer: {
    marginTop: 8,
  },
  darkTableContainer: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 0,
    overflow: 'hidden',
    marginTop: 8,
  },
  darkTableHeaderRow: {
    backgroundColor: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  darkThText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'System',
  },
  darkTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  darkTdText: {
    color: '#F3F4F6',
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'System',
  },
  darkTdTextBold: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'System',
  },
  darkTdTextMuted: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'System',
  },
  darkTdCol: {
    justifyContent: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  darkTdStatusText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'System',
  },
  darkActionBtnLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  darkActionBtnLinkText: {
    color: '#F3F4F6',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'System',
  },
  emptyDarkRow: {
    padding: 32,
    alignItems: 'center',
  },
  emptyDarkText: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  /* MODAL STYLES */
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
    maxWidth: 580,
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
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBody: {
    padding: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    fontSize: 13,
    fontWeight: '800',
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
    flex: 1,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  modalApproveBtn: {
    flex: 1,
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalApproveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalRejectBtn: {
    flex: 1,
    backgroundColor: COLORS.warning,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalRejectText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalCloseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  noticeModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  noticeModalMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmBanner: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  confirmQuestionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  confirmSummaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  confirmSummaryRow: {
    fontSize: 13,
  },
  confirmSummaryLabel: {
    color: COLORS.textSecondary,
  },
  confirmSummaryVal: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  confirmSummaryValBold: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  reasonInputBox: {
    marginBottom: 16,
  },
  reasonInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: 6,
  },
  reasonTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  confirmActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmFinalBtn: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmFinalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  confirmCancelBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTabScrollRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  adminCardBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  adminCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  shippingItemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  shippingApplicantName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  shippingSubText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  shippingAddressText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  adminInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  adminTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  shippingStatusPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  statusPillBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  statusPillBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusPillBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statusPillBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  saveResiBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  saveResiBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  adminTwoGridRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  inputGroupMargin: {
    gap: 4,
  },
  zoneRowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  zoneNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  exportExcelBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exportExcelBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  financialStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  financialCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    padding: 12,
  },
  financialCardLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  financialCardVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#60A5FA',
  },
  problemAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  problemName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  problemIssueText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
    marginTop: 2,
  },
  problemHpText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  waBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  spacer: {
    height: 32,
  },
});
