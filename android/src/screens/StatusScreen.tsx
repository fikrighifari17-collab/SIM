import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, Platform, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { submissionAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { getLocalSubmissions, getLocalSubmissionsForUser, updateLocalSubmissionStatus } from '../store/submissionStore';
import { Submission } from '../types';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  Pending:   { color: '#B3261E', bg: '#FFF5F5', icon: 'time-outline', label: 'Pending' },
  Approved:  { color: COLORS.success, bg: '#F0FDF4', icon: 'checkmark-circle-outline', label: 'Approved' },
  Disetujui: { color: COLORS.success, bg: '#F0FDF4', icon: 'checkmark-circle-outline', label: 'Approved' },
  Rejected:  { color: COLORS.textSecondary, bg: '#F8FAFC', icon: 'close-circle-outline', label: 'Rejected' },
  Ditolak:   { color: COLORS.textSecondary, bg: '#F8FAFC', icon: 'close-circle-outline', label: 'Rejected' },
};

const DEFAULT_USER_SUBMISSIONS = [
  {
    id: 5,
    resi_id: 'SIM-2026-8786',
    resiId: 'SIM-2026-8786',
    nama: 'Satria',
    nik: '3174052208900002',
    no_hp: '081298765432',
    user_email: 'satria@gmail.com',
    jenis_sim: 'SIM C',
    satpas: 'SATPAS Polres Metro Jakarta Timur',
    service_title: 'Pendaftaran SIM Baru',
    date: '25/08/2026',
    status: 'Pending',
  },
  {
    id: 1,
    resi_id: 'SIM-2026-7866',
    resiId: 'SIM-2026-7866',
    nama: 'Budi Santoso',
    nik: '3174052208900001',
    no_hp: '081298765432',
    user_email: 'budi@gmail.com',
    jenis_sim: 'SIM A',
    satpas: 'SATPAS Polres Metro Jakarta Selatan',
    service_title: 'Perpanjangan SIM Nasional',
    date: '25/08/2026',
    status: 'Approved',
  },
  {
    id: 2,
    resi_id: 'SIM-2026-0822-412',
    resiId: 'SIM-2026-0822-412',
    nama: 'Raka Pratama',
    nik: '9213917237217321',
    no_hp: '085712345678',
    user_email: 'raka@gmail.com',
    jenis_sim: 'SIM Internasional',
    satpas: 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
    service_title: 'Pendaftaran SIM Internasional',
    date: '22/08/2026',
    status: 'Approved',
  },
];

export default function StatusScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const userEmail = (user?.email || '').trim().toLowerCase();
      const userNik = (user?.nik || '').trim();
      const userName = (user?.name || '').trim().toLowerCase();

      const localItems = await getLocalSubmissionsForUser(userEmail, userNik);

      let serverItems: any[] = [];
      try {
        const res = await submissionAPI.getMySubmissions();
        const rawList = res.data?.submissions || (Array.isArray(res.data) ? res.data : []);
        serverItems = rawList.filter((s: any) => {
          if (!userEmail && !userNik && !userName) return true;
          const sEmail = (s.user_email || s.email || '').trim().toLowerCase();
          const sNik = (s.nik || '').trim();
          const sNama = (s.nama || '').trim().toLowerCase();
          if (userEmail && sEmail && sEmail === userEmail) return true;
          if (userNik && sNik && sNik === userNik) return true;
          if (userName && sNama && (sNama.includes(userName) || userName.includes(sNama))) return true;
          return false;
        });
      } catch (e) {}

      const mapByResi = new Map<string, any>();

      // 1. Initial defaults filtered by user
      DEFAULT_USER_SUBMISSIONS.forEach((item) => {
        const sEmail = (item.user_email || '').trim().toLowerCase();
        const sNik = (item.nik || '').trim();
        const sNama = (item.nama || '').trim().toLowerCase();
        const isMatch = (!userEmail && !userNik) ||
          (userEmail && sEmail === userEmail) ||
          (userNik && sNik === userNik) ||
          (userName && sNama.includes(userName));

        if (isMatch) {
          const key = String(item.resi_id || item.resiId || item.id).trim().toLowerCase();
          mapByResi.set(key, { ...item });
        }
      });

      // 2. Local phone storage items
      localItems.forEach((item) => {
        const key = String(item.resi_id || item.resiId || item.id).trim().toLowerCase();
        const existing = mapByResi.get(key);
        mapByResi.set(key, existing ? { ...existing, ...item } : { ...item });
      });

      // 3. Live Server items MUST OVERRIDE status & details 100%!
      if (serverItems && serverItems.length > 0) {
        serverItems.forEach((item) => {
          const key = String(item.resi_id || item.resiId || item.id).trim().toLowerCase();
          const existing = mapByResi.get(key);
          if (item.status) {
            updateLocalSubmissionStatus(key, item.status);
          }
          mapByResi.set(key, existing ? { ...existing, ...item, status: item.status || existing.status } : { ...item });
        });
      }

      const merged = Array.from(mapByResi.values());
      setSubmissions(merged);
    } catch (err) {
      // Keep existing state on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
      const interval = setInterval(() => {
        load();
      }, 2500);
      return () => clearInterval(interval);
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status Pengajuan</Text>
        <Text style={styles.headerSub}>Pantau proses pengajuan SIM-mu</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.primary} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[COLORS.primary]} />}
          contentContainerStyle={submissions.length === 0 && styles.empty}
        >
          {submissions.length === 0 ? (
            <View style={styles.emptyContent}>
              <Ionicons name="document-text-outline" size={56} color={COLORS.border} />
              <Text style={styles.emptyText}>Belum ada pengajuan</Text>
              <Text style={styles.emptySubText}>Pengajuan SIM-mu akan muncul di sini</Text>
            </View>
          ) : (
            <>
              {submissions.map((s, index) => {
                const resiId = s.resi_id || s.resiId || `SIM-${s.id}`;
                const title = s.service_title || s.serviceTitle || 'Pengajuan SIM';
                const jenisSim = s.jenis_sim || s.jenisSim || 'A';
                const status = s.status || 'Pending';
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
                const dateStr = s.date || (s.created_at ? new Date(s.created_at).toLocaleDateString('id-ID') : 'Hari ini');

                let amount = 135000;
                if (jenisSim.includes('Internasional')) amount = 270000;
                else if (jenisSim.includes('C')) amount = 110000;

                return (
                  <View key={s.id || index} style={styles.card}>
                    <View style={styles.cardTop}>
                      <View>
                        <Text style={styles.resi}>#{resiId}</Text>
                        <Text style={styles.serviceTitle}>{title}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                        <Ionicons name={cfg.icon} size={14} color={cfg.color} />
                        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.cardMeta}>
                      <Text style={styles.metaItem}>
                        <Text style={styles.metaLabel}>SIM: </Text>{jenisSim}
                      </Text>
                      <Text style={styles.metaItem}>
                        <Text style={styles.metaLabel}>SATPAS: </Text>{s.satpas}
                      </Text>
                      <Text style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Tanggal: </Text>{dateStr}
                      </Text>
                    </View>

                    {/* Tombol Akses Pembayaran / Virtual Account */}
                    <TouchableOpacity
                      style={styles.payBtn}
                      onPress={() =>
                        navigation.navigate('Services', {
                          screen: 'Payment',
                          params: { resi_id: resiId, amount },
                        })
                      }
                    >
                      <Ionicons name="card-outline" size={16} color={COLORS.surface} />
                      <Text style={styles.payBtnText}>Bayar / Lihat Virtual Account</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={{ height: 24 }} />
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 20, paddingHorizontal: 20,
  },
  headerTitle: { color: COLORS.surface, fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 },
  empty: { flex: 1 },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.textSecondary },
  emptySubText: { fontSize: 13, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.surface, marginHorizontal: 16, marginTop: 12,
    borderWidth: 1, borderColor: COLORS.border, padding: 16,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  resi: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  serviceTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  cardMeta: { gap: 4 },
  metaItem: { fontSize: 12, color: COLORS.textSecondary },
  metaLabel: { fontWeight: '600', color: COLORS.textPrimary },
  payBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 10, marginTop: 14,
  },
  payBtnText: { color: COLORS.surface, fontWeight: '700', fontSize: 13 },
});
