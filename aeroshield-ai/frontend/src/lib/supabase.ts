import { createClient } from '@supabase/supabase-js';
import { autoSeedSupabase } from '../scripts/seedSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mpbeozinrofbpgyhjpub.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5Gl6wKELLD68W2m4HSN__Q_w_z8snth';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Trigger automatic seeding attempt on load
autoSeedSupabase();

export interface RedFlagAlert {
  id?: string;
  verification_id: string;
  passenger_id: string;
  passenger_name: string;
  passport_number: string;
  flag_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  terminal: string;
  checkpoint: string;
  officer_id: string;
  created_at?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'UNDER_INVESTIGATION';
}

export interface SupabasePassenger {
  id?: string;
  passenger_id: string;
  full_name: string;
  passport_number: string;
  nationality: string;
  date_of_birth: string;
  gender: string;
  risk_profile: string;
  watchlist_status: boolean;
  photo_url?: string;
}

// Pre-seeded sample database entries to verify through Supabase
export const SAMPLE_SUPABASE_PASSENGERS: SupabasePassenger[] = [
  {
    passenger_id: 'AV-IND-100249',
    full_name: 'Rajesh Sharma',
    passport_number: 'N4820194',
    nationality: 'IND',
    date_of_birth: '1985-04-12',
    gender: 'M',
    risk_profile: 'LOW',
    watchlist_status: false
  },
  {
    passenger_id: 'AV-USA-882310',
    full_name: 'Elena Rostova',
    passport_number: 'P9021844',
    nationality: 'USA',
    date_of_birth: '1992-11-23',
    gender: 'F',
    risk_profile: 'HIGH',
    watchlist_status: true
  },
  {
    passenger_id: 'AV-GBR-309112',
    full_name: 'David Arthur Pendelton',
    passport_number: 'GB982311',
    nationality: 'GBR',
    date_of_birth: '1978-08-19',
    gender: 'M',
    risk_profile: 'MEDIUM',
    watchlist_status: false
  },
  {
    passenger_id: 'AV-DEU-554102',
    full_name: 'Marcus Weber',
    passport_number: 'C4409121',
    nationality: 'DEU',
    date_of_birth: '1990-02-15',
    gender: 'M',
    risk_profile: 'LOW',
    watchlist_status: false
  }
];

// Helper to record a Red Flag to Supabase & localStorage broadcast
export async function broadcastRedFlag(flag: Omit<RedFlagAlert, 'id' | 'created_at'>) {
  const newFlag: RedFlagAlert = {
    ...flag,
    id: 'RF-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    created_at: new Date().toISOString()
  };

  // Try storing in Supabase red_flags table
  try {
    const { error } = await supabase
      .from('red_flags')
      .insert([newFlag]);
    
    if (error) {
      console.warn('Supabase red_flags insert error (falling back to local storage):', error.message);
    }
  } catch (err) {
    console.warn('Supabase offline or table missing, using local storage sync:', err);
  }

  // Also maintain local storage pub/sub for instant client updates across tabs/authorities
  const currentFlags: RedFlagAlert[] = JSON.parse(localStorage.getItem('aeroshield_red_flags') || '[]');
  const updated = [newFlag, ...currentFlags];
  localStorage.setItem('aeroshield_red_flags', JSON.stringify(updated));

  // Dispatch custom window event
  window.dispatchEvent(new CustomEvent('aeroshield_red_flag_alert', { detail: newFlag }));

  return newFlag;
}

// Helper to fetch active Red Flags
export async function getActiveRedFlags(): Promise<RedFlagAlert[]> {
  try {
    const { data, error } = await supabase
      .from('red_flags')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as RedFlagAlert[];
    }
  } catch (err) {
    console.warn('Supabase fetch failed, loading local alerts:', err);
  }

  const localFlags = JSON.parse(localStorage.getItem('aeroshield_red_flags') || '[]');
  return localFlags;
}

// Helper to verify passenger against Supabase DB
export async function verifyPassengerInSupabase(passportNoOrId: string) {
  try {
    const { data, error } = await supabase
      .from('passengers')
      .select('*')
      .or(`passport_number.eq.${passportNoOrId},passenger_id.eq.${passportNoOrId}`)
      .single();

    if (!error && data) {
      return { found: true, passenger: data };
    }
  } catch (err) {
    console.warn('Supabase lookup warning, fallback to sample match:', err);
  }

  // Fallback match in pre-seeded sample data
  const sample = SAMPLE_SUPABASE_PASSENGERS.find(
    p => p.passport_number.toLowerCase() === passportNoOrId.toLowerCase() || p.passenger_id.toLowerCase() === passportNoOrId.toLowerCase()
  );

  if (sample) {
    return { found: true, passenger: sample };
  }

  return { found: false, passenger: null };
}
