// Script to apply the custom_vulnerabilities migration
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Read the migration SQL file
const migrationPath = path.join(__dirname, '../supabase/migrations/20250407000000_add_custom_vulnerabilities.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service role key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('Applying migration for custom_vulnerabilities table...');
    
    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Error applying migration:', error);
      process.exit(1);
    }
    
    console.log('Migration applied successfully!');
    console.log('The custom_vulnerabilities table has been created.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applyMigration();
