
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mkgjpcooszuwuafzrmaw.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
console.log('Supabase Key:', supabaseKey) // Debugging line to check if the key is loaded correctly
export const supabase = createClient(supabaseUrl, supabaseKey)