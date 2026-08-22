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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

const SATPAS_LIST = [
  'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
  'SATPAS Polres Metro Jakarta Selatan',
  'SATPAS Polres Metro Jakarta Timur',
  'SATPAS Polres Metro Jakarta Pusat',
  'SATPAS Polrestro Depok, Jawa Barat',
  'SATPAS Polresta Tangerang Kota, Banten',
  'SATPAS Polresta Tangerang Selatan, Banten',
  'SATPAS Polrestro Bekasi Kota, Jawa Barat',
  'SATPAS Polresta Bandung, Jawa Barat',
  'SATPAS Polrestabes Bandung, Jawa Barat',
  'SATPAS Polresta Bogor Kota, Jawa Barat',
  'SATPAS Polresta Cirebon, Jawa Barat',
  'SATPAS Polrestabes Semarang, Jawa Tengah',
  'SATPAS Polresta Surakarta (Solo), Jawa Tengah',
  'SATPAS Polresta Magelang, Jawa Tengah',
  'SATPAS Polresta Yogyakarta (DIY)',
  'SATPAS Polrestabes Surabaya, Jawa Timur',
  'SATPAS Polresta Malang Kota, Jawa Timur',
  'SATPAS Polresta Sidoarjo, Jawa Timur',
  'SATPAS Polresta Denpasar, Bali',
  'SATPAS Polrestabes Medan, Sumatera Utara',
  'SATPAS Polresta Pekanbaru, Riau',
  'SATPAS Polresta Palembang, Sumatera Selatan',
  'SATPAS Polrestabes Makassar, Sulawesi Selatan',
  'SATPAS Polresta Balikpapan, Kalimantan Timur',
];

export default function ServiceDetailScreen({ service, onBack, onSubmitApplication }) {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [jenisSim, setJenisSim] = useState('SIM A');
  const [satpas, setSatpas] = useState(SATPAS_LIST[0]);
  const [showSatpasPicker, setShowSatpasPicker] = useState(false);
  const [satpasSearch, setSatpasSearch] = useState('');
  const [satpasRegionFilter, setSatpasRegionFilter] = useState('Semua');
  const [submitted, setSubmitted] = useState(false);

  const REGION_FILTERS = [
    { id: 'Semua', label: 'Semua Wilayah' },
    { id: 'Metro', label: 'DKI & Metro Jaya' },
    { id: 'Jabar', label: 'Jawa Barat & Banten' },
    { id: 'Jateng', label: 'Jawa Tengah & DIY' },
    { id: 'Jatim', label: 'Jawa Timur & Bali' },
    { id: 'LuarJawa', label: 'Luar Jawa' },
  ];

  // Document Upload States
  const isRenewal = service?.title?.toLowerCase().includes('perpanjangan') || service?.id?.toLowerCase().includes('perpanjangan');
  const [fotoKtp, setFotoKtp] = useState(null);
  const [fotoSimLama, setFotoSimLama] = useState(null);

  // Real File Picker for JPG, PNG, and PDF documents
  const pickFile = (onSelect) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/jpg,application/pdf';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
          const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
          onSelect({
            name: file.name,
            size: `${sizeMb} MB`,
            type: isPdf ? 'PDF Document' : 'Foto (Image)',
            date: new Date().toLocaleDateString('id-ID'),
            fileObj: file,
          });
        }
      };
      input.click();
    } else {
      onSelect({
        name: `DOKUMEN_${Date.now()}.jpg`,
        size: '1.20 MB',
        type: 'Foto (Image)',
        date: new Date().toLocaleDateString('id-ID'),
      });
    }
  };

  if (!service) return null;

  const filteredSatpasList = SATPAS_LIST.filter((item) => {
    const q = satpasSearch.toLowerCase();
    const matchesSearch = item.toLowerCase().includes(q);

    let matchesRegion = true;
    if (satpasRegionFilter === 'Metro') {
      matchesRegion = item.includes('Jakarta') || item.includes('Metro') || item.includes('Polda Metro') || item.includes('Depok') || item.includes('Tangerang') || item.includes('Bekasi');
    } else if (satpasRegionFilter === 'Jabar') {
      matchesRegion = item.includes('Jawa Barat') || item.includes('Banten');
    } else if (satpasRegionFilter === 'Jateng') {
      matchesRegion = item.includes('Jawa Tengah') || item.includes('DIY') || item.includes('Yogyakarta') || item.includes('Solo') || item.includes('Magelang');
    } else if (satpasRegionFilter === 'Jatim') {
      matchesRegion = item.includes('Jawa Timur') || item.includes('Bali');
    } else if (satpasRegionFilter === 'LuarJawa') {
      matchesRegion = item.includes('Sumatera') || item.includes('Riau') || item.includes('Sulawesi') || item.includes('Kalimantan') || item.includes('Medan') || item.includes('Pekanbaru') || item.includes('Palembang') || item.includes('Makassar') || item.includes('Balikpapan');
    }

    return matchesSearch && matchesRegion;
  });

  const handleSubmit = () => {
    if (!nik || !nama || !noHp) {
      if (Platform.OS === 'web') {
        alert('Harap lengkapi NIK, Nama Lengkap, dan Nomor Handphone.');
      } else {
        Alert.alert('Perhatian', 'Harap lengkapi NIK, Nama Lengkap, dan Nomor Handphone.');
      }
      return;
    }

    if (!fotoKtp) {
      if (Platform.OS === 'web') {
        alert('Harap unggah Foto E-KTP resmi Anda terlebih dahulu.');
      } else {
        Alert.alert('Perhatian', 'Harap unggah Foto E-KTP resmi Anda terlebih dahulu.');
      }
      return;
    }

    if (isRenewal && !fotoSimLama) {
      if (Platform.OS === 'web') {
        alert('Harap unggah Foto SIM Lama Anda (wajib khusus perpanjangan SIM).');
      } else {
        Alert.alert('Perhatian', 'Harap unggah Foto SIM Lama Anda (wajib khusus perpanjangan SIM).');
      }
      return;
    }
    
    const newSubmission = {
      id: Date.now().toString(),
      resiId: `SIM-2026-0822-${Math.floor(100 + Math.random() * 900)}`,
      nama,
      nik,
      noHp,
      email: email || 'pemohon@gmail.com',
      jenisSim,
      satpas,
      serviceTitle: service.title,
      fotoKtpName: fotoKtp ? fotoKtp.name : 'E-KTP_317405220890_VERIFIED.jpg',
      fotoSimLamaName: isRenewal ? (fotoSimLama ? fotoSimLama.name : 'SIM_LAMA_VERIFIED.jpg') : null,
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Pending',
    };

    if (onSubmitApplication) {
      onSubmitApplication(newSubmission);
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setNik('');
    setNama('');
    setNoHp('');
    setEmail('');
    setFotoKtp(null);
    setFotoSimLama(null);
    onBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Back Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
          <Text style={styles.backBtnText}>Kembali ke Daftar Layanan</Text>
        </Pressable>
      </View>

      {/* Page Title & Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBox}>
            <Ionicons name={service.iconName || 'document-text'} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.titleCol}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
          </View>
        </View>
      </View>

      {!submitted ? (
        <View style={styles.mainGrid}>
          {/* Left Column: Requirements & Guide */}
          <View style={styles.leftCol}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="document-attach-outline" size={20} color={COLORS.primary} />
                <Text style={styles.infoCardTitle}>Persyaratan Dokumen Digital</Text>
              </View>
              <View style={styles.infoList}>
                <Text style={styles.infoItem}>• E-KTP (Kartu Tanda Penduduk Elektronik) aktif</Text>
                <Text style={styles.infoItem}>• Kartu SIM lama yang masih berlaku (khusus perpanjangan)</Text>
                <Text style={styles.infoItem}>• Pas foto digital terbaru latar belakang biru (4x6)</Text>
                <Text style={styles.infoItem}>• Tanda tangan di atas kertas putih polos (foto/scan)</Text>
                <Text style={styles.infoItem}>• Hasil tes kesehatan fisik E-Rikkes & tes psikologi EPPsi</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="git-network-outline" size={20} color={COLORS.primary} />
                <Text style={styles.infoCardTitle}>Tahapan Pengajuan Online</Text>
              </View>
              <View style={styles.stepsList}>
                <View style={styles.stepItem}>
                  <Text style={styles.stepBadge}>1</Text>
                  <Text style={styles.stepText}>Pengisian formulir data diri & NIK E-KTP</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepBadge}>2</Text>
                  <Text style={styles.stepText}>Verifikasi tes kesehatan E-Rikkes & EPPsi</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepBadge}>3</Text>
                  <Text style={styles.stepText}>Pilihan SATPAS penerbit & metode pengiriman</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepBadge}>4</Text>
                  <Text style={styles.stepText}>Pembayaran PNBP & pencetakan SIM fisik</Text>
                </View>
              </View>
            </View>

            {/* Official Payment Flow Explanation Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                <Text style={styles.infoCardTitle}>Kapan Pembayaran Dilakukan?</Text>
              </View>
              <Text style={styles.infoDescText}>
                Mengikuti alur resmi SIM Presisi, pembayaran PNBP <Text style={{ fontWeight: '700' }}>bukan di awal</Text>, melainkan setelah data & dokumen diverifikasi valid oleh petugas POLRI:
              </Text>
              <View style={styles.flowStepsBox}>
                <Text style={styles.flowStepItem}>1. Isi Data Diri & Upload Dokumen</Text>
                <Text style={styles.flowStepArrow}>↓</Text>
                <Text style={styles.flowStepItem}>2. Verifikasi Dokumen oleh Petugas POLRI</Text>
                <Text style={styles.flowStepArrow}>↓</Text>
                <Text style={styles.flowStepHighlight}>3. ✅ Pembayaran PNBP (Muncul setelah data lolos verifikasi)</Text>
                <Text style={styles.flowStepArrow}>↓</Text>
                <Text style={styles.flowStepItem}>4. Pencetakan & Pengiriman SIM Fisik</Text>
              </View>
              <Text style={styles.infoSubNote}>
                • Menghindari refund jika dokumen tidak valid (NIK salah / foto buram).{'\n'}
                • Pola ini resmi sesuai standar aplikasi Digital Korlantas POLRI.
              </Text>
            </View>
          </View>

          {/* Right Column: Full Page Application Form */}
          <View style={styles.rightCol}>
            <View style={styles.formCard}>
              <Text style={styles.formHeaderTitle}>Formulir Pengajuan {service.title}</Text>
              <Text style={styles.formHeaderSubtitle}>
                Isi data permohonan dengan teliti sesuai dokumen E-KTP resmi Anda.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nomor Induk Kependudukan (NIK)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan 16 digit NIK KTP..."
                  value={nik}
                  onChangeText={setNik}
                  keyboardType="numeric"
                  maxLength={16}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap (Sesuai KTP)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama lengkap pemohon..."
                  value={nama}
                  onChangeText={setNama}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nomor Handphone (WhatsApp Active)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0812xxxxxxxx"
                  value={noHp}
                  onChangeText={setNoHp}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alamat Email Active</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@domain.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Golongan SIM</Text>
                <View style={styles.simTypeSelector}>
                  {['SIM A', 'SIM C', 'SIM C1', 'SIM Internasional'].map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.simTypeOption,
                        jenisSim === type && styles.simTypeOptionActive,
                      ]}
                      onPress={() => setJenisSim(type)}
                    >
                      <Text
                        style={[
                          styles.simTypeOptionText,
                          jenisSim === type && styles.simTypeOptionTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Foto / Scan PDF E-KTP Resmi <Text style={{ color: COLORS.warning }}>*</Text>
                </Text>
                <Pressable
                  style={[
                    styles.fileUploadBox,
                    fotoKtp && styles.fileUploadBoxSuccess,
                  ]}
                  onPress={() => pickFile(setFotoKtp)}
                >
                  <Ionicons
                    name={
                      fotoKtp
                        ? fotoKtp.type && fotoKtp.type.includes('PDF')
                          ? 'document-text'
                          : 'checkmark-circle'
                        : 'camera-outline'
                    }
                    size={22}
                    color={fotoKtp ? COLORS.success : COLORS.primary}
                  />
                  <View style={styles.fileUploadTextCol}>
                    <Text style={styles.fileUploadTitle}>
                      {fotoKtp ? `${fotoKtp.name} (${fotoKtp.size})` : 'Klik untuk Pilih / Ambil Foto atau PDF E-KTP'}
                    </Text>
                    <Text style={styles.fileUploadSubtitle}>
                      {fotoKtp
                        ? `Dokumen ${fotoKtp.type} Terpilih & Siap Diunggah`
                        : 'Format Foto JPG/PNG atau PDF (Maks. 5 MB)'}
                    </Text>
                  </View>
                  {fotoKtp && (
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color={COLORS.warning}
                      onPress={(e) => {
                        e.stopPropagation();
                        setFotoKtp(null);
                      }}
                    />
                  )}
                </Pressable>
              </View>

              {/* Document Upload Section 2: Foto SIM Lama (Khusus Perpanjangan) */}
              {isRenewal && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Foto / Scan PDF SIM Lama <Text style={{ color: COLORS.warning }}>* (Khusus Perpanjangan)</Text>
                  </Text>
                  <Pressable
                    style={[
                      styles.fileUploadBox,
                      fotoSimLama && styles.fileUploadBoxSuccess,
                    ]}
                    onPress={() => pickFile(setFotoSimLama)}
                  >
                    <Ionicons
                      name={
                        fotoSimLama
                          ? fotoSimLama.type && fotoSimLama.type.includes('PDF')
                            ? 'document-text'
                            : 'checkmark-circle'
                          : 'card-outline'
                      }
                      size={22}
                      color={fotoSimLama ? COLORS.success : COLORS.primary}
                    />
                    <View style={styles.fileUploadTextCol}>
                      <Text style={styles.fileUploadTitle}>
                        {fotoSimLama ? `${fotoSimLama.name} (${fotoSimLama.size})` : 'Klik untuk Pilih / Ambil Foto atau PDF SIM Lama'}
                      </Text>
                      <Text style={styles.fileUploadSubtitle}>
                        {fotoSimLama
                          ? `Dokumen ${fotoSimLama.type} Terpilih & Siap Diunggah`
                          : 'Wajib untuk perpanjangan SIM (JPG/PNG/PDF, Maks. 5 MB)'}
                      </Text>
                    </View>
                    {fotoSimLama && (
                      <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color={COLORS.warning}
                        onPress={(e) => {
                          e.stopPropagation();
                          setFotoSimLama(null);
                        }}
                      />
                    )}
                  </Pressable>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>SATPAS Penerbit Pilihan (25 Kategori SATPAS Terhubung)</Text>
                <Pressable
                  style={styles.satpasSelectBox}
                  onPress={() => setShowSatpasPicker(true)}
                >
                  <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.satpasSelectText} numberOfLines={1}>
                    {satpas}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.navyMuted} />
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.submitBtnPressed,
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitBtnText}>Kirim Pengajuan SIM Sekarang</Text>
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        /* Full Page Confirmation Result */
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.success} />
          <Text style={styles.successTitle}>Pengajuan SIM Berhasil Dikirim!</Text>
          <Text style={styles.successDesc}>
            Terima kasih Bpk/Ibu <Text style={{ fontWeight: '700' }}>{nama}</Text>. Permohonan {service.title} untuk NIK <Text style={{ fontWeight: '700' }}>{nik}</Text> telah tercatat dalam sistem JEJAK SIM.
          </Text>

          <View style={styles.receiptBox}>
            <Text style={styles.receiptHeaderTitle}>RINCIAN RESI PENGAJUAN ONLINE</Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>No. Registrasi Pengajuan:</Text>
              <Text style={styles.receiptValBold}>SIM-2026-0822-889</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Jenis Layanan / SIM:</Text>
              <Text style={styles.receiptVal}>{service.title} ({jenisSim})</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>SATPAS Penerbit:</Text>
              <Text style={styles.receiptVal}>{satpas}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status Pembayaran PNBP:</Text>
              <Text style={{ color: '#D97706', fontWeight: '700' }}>MENUNGGU VERIFIKASI DOKUMEN (BELUM BAYAR)</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Metode Pengiriman:</Text>
              <Text style={styles.receiptVal}>PT Pos Indonesia (Kurir ke Alamat Domisili)</Text>
            </View>

            {/* Payment Flow Notice Box */}
            <View style={styles.paymentNoticeBox}>
              <Ionicons name="information-circle-outline" size={20} color="#D97706" />
              <Text style={styles.paymentNoticeText}>
                <Text style={{ fontWeight: '700' }}>Catatan Resmi Alur SIM:</Text> Pembayaran PNBP dilakukan <Text style={{ fontWeight: '700' }}>setelah data & dokumen diverifikasi valid</Text> oleh Petugas POLRI. Tombol <Text style={{ fontWeight: '700' }}>"Bayar Online Sekarang"</Text> akan otomatis muncul di akun Anda begitu permohonan disetujui.
              </Text>
            </View>
          </View>

          <View style={styles.successActionsRow}>
            <Pressable style={styles.doneBtn} onPress={handleReset}>
              <Text style={styles.doneBtnText}>Selesai & Kembali ke Layanan</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Modal Picker for 25 SATPAS Categories */}
      <Modal
        visible={showSatpasPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSatpasPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.satpasModalContent}>
            <View style={styles.satpasModalHeader}>
              <Text style={styles.satpasModalTitle}>Pilih SATPAS Penerbit (25 Kategori)</Text>
              <Pressable onPress={() => setShowSatpasPicker(false)}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Search Input inside SATPAS Modal */}
            <View style={styles.satpasSearchBox}>
              <Ionicons name="search" size={16} color={COLORS.textSecondary} />
              <TextInput
                style={styles.satpasSearchInput}
                placeholder="Cari lokasi SATPAS / Polda / Polresta..."
                value={satpasSearch}
                onChangeText={setSatpasSearch}
              />
              {satpasSearch.length > 0 && (
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={COLORS.textSecondary}
                  onPress={() => setSatpasSearch('')}
                />
              )}
            </View>

            {/* Region Filter Pills Bar for SATPAS Locations */}
            <View style={styles.satpasFilterPillsBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.satpasFilterPillsRow}>
                {REGION_FILTERS.map((rf) => {
                  const isActive = satpasRegionFilter === rf.id;
                  const count = SATPAS_LIST.filter((item) => {
                    if (rf.id === 'Semua') return true;
                    if (rf.id === 'Metro') return item.includes('Jakarta') || item.includes('Metro') || item.includes('Polda Metro') || item.includes('Depok') || item.includes('Tangerang') || item.includes('Bekasi');
                    if (rf.id === 'Jabar') return item.includes('Jawa Barat') || item.includes('Banten');
                    if (rf.id === 'Jateng') return item.includes('Jawa Tengah') || item.includes('DIY') || item.includes('Yogyakarta') || item.includes('Solo') || item.includes('Magelang');
                    if (rf.id === 'Jatim') return item.includes('Jawa Timur') || item.includes('Bali');
                    if (rf.id === 'LuarJawa') return item.includes('Sumatera') || item.includes('Riau') || item.includes('Sulawesi') || item.includes('Kalimantan') || item.includes('Medan') || item.includes('Pekanbaru') || item.includes('Palembang') || item.includes('Makassar') || item.includes('Balikpapan');
                    return true;
                  }).length;

                  return (
                    <Pressable
                      key={rf.id}
                      style={[
                        styles.satpasRegionPill,
                        isActive && styles.satpasRegionPillActive,
                      ]}
                      onPress={() => setSatpasRegionFilter(rf.id)}
                    >
                      <Text style={[styles.satpasRegionPillText, isActive && styles.satpasRegionPillTextActive]}>
                        {rf.label} ({count})
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <ScrollView style={styles.satpasListScroll}>
              {filteredSatpasList.map((item, idx) => (
                <Pressable
                  key={idx}
                  style={[
                    styles.satpasOptionItem,
                    satpas === item && styles.satpasOptionActive,
                  ]}
                  onPress={() => {
                    setSatpas(item);
                    setShowSatpasPicker(false);
                  }}
                >
                  <Ionicons
                    name={satpas === item ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={satpas === item ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.satpasOptionText,
                      satpas === item && styles.satpasOptionTextActive,
                    ]}
                  >
                    {idx + 1}. {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
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
    ...Platform.select({
      web: {
        height: '100%',
        maxHeight: '100%',
        overflowY: 'auto',
      },
    }),
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '100%',
  },
  topBar: {
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
  },
  backBtnPressed: {
    backgroundColor: '#F1F5F9',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerBanner: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 0,
    backgroundColor: COLORS.navySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
  },
  titleCol: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  serviceSubtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 3,
  },
  mainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  leftCol: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
    gap: 16,
  },
  rightCol: {
    flex: 1.3,
    minWidth: Platform.OS === 'web' ? 360 : '100%',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
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
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  infoDescText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  flowStepsBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
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
  infoSubNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  paymentNoticeBox: {
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#EAB308',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  paymentNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 17,
  },
  stepsList: {
    gap: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 0,
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
  },
  stepText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  formHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  formHeaderSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
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
  fileUploadBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  fileUploadBoxSuccess: {
    borderStyle: 'solid',
    borderColor: COLORS.success,
    backgroundColor: '#F0FDF4',
  },
  fileUploadTextCol: {
    flex: 1,
  },
  fileUploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  fileUploadSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  simTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  simTypeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    backgroundColor: '#F8FAFC',
  },
  simTypeOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  simTypeOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  simTypeOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  submitBtnPressed: {
    backgroundColor: COLORS.navySoft,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 30,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 600,
    marginBottom: 24,
  },
  receiptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    width: '100%',
    maxWidth: 600,
    marginBottom: 24,
    gap: 10,
  },
  receiptHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  receiptLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  receiptVal: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  receiptValBold: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '800',
  },
  successActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 0,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  spacer: {
    height: 40,
  },
  satpasSelectBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  satpasSelectText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  satpasModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    maxWidth: 580,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  satpasModalHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  satpasModalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  satpasSearchBox: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  satpasSearchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  satpasListScroll: {
    padding: 12,
  },
  satpasOptionItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  satpasOptionActive: {
    backgroundColor: '#F0F9FF',
  },
  satpasOptionText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  satpasOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  satpasFilterPillsBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  satpasFilterPillsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  satpasRegionPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  satpasRegionPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  satpasRegionPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  satpasRegionPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
