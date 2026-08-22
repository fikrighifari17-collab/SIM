import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function ServiceModal({ visible, onClose, service }) {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [satpas, setSatpas] = useState('SATPAS Daan Mogot, Jakarta');
  const [submitted, setSubmitted] = useState(false);

  if (!service) return null;

  const handleSubmit = () => {
    if (!nik || !nama || !noHp) {
      if (Platform.OS === 'web') {
        alert('Harap lengkapi NIK, Nama Lengkap, dan Nomor Handphone.');
      } else {
        Alert.alert('Perhatian', 'Harap lengkapi NIK, Nama Lengkap, dan Nomor Handphone.');
      }
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setNik('');
    setNama('');
    setNoHp('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <Ionicons name={service.iconName || 'document-text'} size={20} color="#FFFFFF" />
              <Text style={styles.modalHeaderTitle}>{service.title}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            {!submitted ? (
              <>
                <Text style={styles.serviceDesc}>{service.subtitle}</Text>

                {/* Syarat Layanan */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Persyaratan Dokumen Digital:</Text>
                  <Text style={styles.infoText}>• KTP Elektronik (E-KTP) aktif</Text>
                  <Text style={styles.infoText}>• SIM lama (untuk perpanjangan)</Text>
                  <Text style={styles.infoText}>• Pas foto latar belakang biru (4x6)</Text>
                  <Text style={styles.infoText}>• Hasil tes kesehatan (E-Rikkes) & psikologi (EPPsi)</Text>
                </View>

                {/* Form Simulasi */}
                <Text style={styles.formTitle}>Formulir Pengajuan Online</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Induk Kependudukan (NIK)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="16 digit NIK KTP..."
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
                    placeholder="Nama lengkap..."
                    value={nama}
                    onChangeText={setNama}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Handphone (WhatsApp)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0812xxxxxxxx"
                    value={noHp}
                    onChangeText={setNoHp}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Pilihan SATPAS Penerbit</Text>
                  <TextInput
                    style={styles.input}
                    value={satpas}
                    onChangeText={setSatpas}
                  />
                </View>

                <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>Kirim Pengajuan Layanan</Text>
                </Pressable>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={54} color={COLORS.success} />
                <Text style={styles.successTitle}>Pengajuan Berhasil Dikirim!</Text>
                <Text style={styles.successSubtitle}>
                  Terima kasih, Bpk/Ibu <Text style={{ fontWeight: '700' }}>{nama}</Text>. Pengajuan {service.title} Anda dengan NIK {nik} sedang diverifikasi oleh sistem JEJAK SIM.
                </Text>

                <View style={styles.statusReceipt}>
                  <Text style={styles.receiptRow}>No. Registrasi: <Text style={styles.receiptVal}>SIM-2026-0822-99</Text></Text>
                  <Text style={styles.receiptRow}>Metode Pengiriman: <Text style={styles.receiptVal}>Pos Indonesia (Kurir ke Rumah)</Text></Text>
                  <Text style={styles.receiptRow}>Status Verifikasi: <Text style={{ color: COLORS.success, fontWeight: '700' }}>Menunggu Ujian / Cetak</Text></Text>
                </View>

                <Pressable style={styles.doneBtn} onPress={handleReset}>
                  <Text style={styles.doneBtnText}>Selesai</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 37, 64, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    maxWidth: 520,
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
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  serviceDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
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
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 0,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 10,
  },
  successSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  statusReceipt: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    marginBottom: 20,
    gap: 6,
  },
  receiptRow: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  receiptVal: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 0,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
