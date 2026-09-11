import { createClient } from '@supabase/supabase-js';

const url = 'https://mpbeozinrofbpgyhjpub.supabase.co';
const key = 'sb_publishable_5Gl6wKELLD68W2m4HSN__Q_w_z8snth';
const supabase = createClient(url, key);

export const SAMPLE_PASSENGERS = [
  {
    passenger_id: 'AV-IND-000123',
    full_name: 'RAJESH KUMAR SHARMA',
    passport_number: 'N4820194',
    nationality: 'IND',
    date_of_birth: '1990-03-15',
    gender: 'M',
    risk_profile: 'LOW',
    watchlist_status: false,
    flight: 'AX 204',
    terminal: 'T2',
    gate: 'G18'
  },
  {
    passenger_id: 'AV-GBR-000458',
    full_name: 'JAMES ALEXANDER MORRISON',
    passport_number: 'GB982311',
    nationality: 'GBR',
    date_of_birth: '1985-07-22',
    gender: 'M',
    risk_profile: 'MEDIUM',
    watchlist_status: false,
    flight: 'BA 112',
    terminal: 'T2',
    gate: 'G04'
  },
  {
    passenger_id: 'AV-USA-000891',
    full_name: 'MICHAEL DAVID CHEN',
    passport_number: 'P9021844',
    nationality: 'USA',
    date_of_birth: '1992-11-08',
    gender: 'M',
    risk_profile: 'HIGH',
    watchlist_status: true,
    flight: 'UA 505',
    terminal: 'T2',
    gate: 'G22'
  },
  {
    passenger_id: 'AV-CHN-001204',
    full_name: 'LI XIAO MING',
    passport_number: 'C4409121',
    nationality: 'CHN',
    date_of_birth: '1988-05-30',
    gender: 'M',
    risk_profile: 'MEDIUM',
    watchlist_status: false,
    flight: 'CA 836',
    terminal: 'T2',
    gate: 'G31'
  }
];

export async function autoSeedSupabase() {
  try {
    const { data: existing, error } = await supabase.from('passengers').select('*').limit(1);
    if (!error) {
      const { error: insertErr } = await supabase.from('passengers').upsert(SAMPLE_PASSENGERS, { onConflict: 'passenger_id' });
      if (!insertErr) {
        console.log('Successfully seeded Supabase passengers table!');
      }
    }
  } catch (err) {
    console.warn('Supabase auto-seed warning (run SQL schema if tables do not exist yet):', err);
  }
}
