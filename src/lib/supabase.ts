
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gtfjovypbuydvqahjgqn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZmpvdnlwYnV5ZHZxYWhqZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NDcxMzIsImV4cCI6MjA2NjIyMzEzMn0.DXZXDiZ1xMwthwJ8tD6DTVcX3bl32Vp3yDyD7gIN6hI'

export const supabase = createClient(supabaseUrl, supabaseKey)
