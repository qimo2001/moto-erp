import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zunzruhwhypfiayaiytl.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bnpydWh3eXBmaWF5YWl5dGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0ODQzNTAyOCwiZXhwIjoyMDY0MDExMDI4fQ.9KwPUhs1Re1VoP-1TPcoG8MZwBAzNTq4Uhp9MefK46o'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)