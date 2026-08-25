import * as SecureStore from 'expo-secure-store';

export interface LocalSubmission {
  id: number;
  resi_id: string;
  resiId: string;
  nama: string;
  nik: string;
  no_hp: string;
  user_email: string;
  jenis_sim: string;
  satpas: string;
  service_title: string;
  date: string;
  status: string;
}

const STORAGE_KEY = 'jejaksim_local_submissions_v2';

export const getLocalSubmissions = async (): Promise<LocalSubmission[]> => {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
};

export const getLocalSubmissionsForUser = async (userEmail?: string, userNik?: string): Promise<LocalSubmission[]> => {
  const all = await getLocalSubmissions();
  if (!userEmail && !userNik) return all;
  
  const cleanEmail = (userEmail || '').trim().toLowerCase();
  const cleanNik = (userNik || '').trim();

  return all.filter(s => {
    const sEmail = (s.user_email || (s as any).email || '').trim().toLowerCase();
    const sNik = (s.nik || '').trim();
    if (cleanEmail && sEmail && sEmail === cleanEmail) return true;
    if (cleanNik && sNik && sNik === cleanNik) return true;
    return false;
  });
};

export const addLocalSubmission = async (newSub: LocalSubmission): Promise<LocalSubmission[]> => {
  try {
    const current = await getLocalSubmissions();
    const filtered = current.filter(s => String(s.resi_id || s.resiId).trim().toLowerCase() !== String(newSub.resi_id || newSub.resiId).trim().toLowerCase());
    const updated = [newSub, ...filtered];
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const updateLocalSubmissionStatus = async (resiId: string, newStatus: string) => {
  try {
    const current = await getLocalSubmissions();
    const targetKey = String(resiId).trim().toLowerCase();
    const updated = current.map(s => {
      const sKey = String(s.resi_id || s.resiId).trim().toLowerCase();
      if (sKey === targetKey) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
};
