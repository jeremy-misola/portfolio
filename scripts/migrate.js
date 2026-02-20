#!/usr/bin/env node

// Migration script to import data from JSON files to PostgreSQL database

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runMigration } from '../src/lib/migrateData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set correct working directory
process.chdir(join(__dirname, '..'));

console.log('=============================');
console.log('Portfolio Database Migration');
console.log('=============================');
console.log('');

runMigration().catch(error => {
  console.error('\n✗ Migration failed:', error);
  process.exit(1);
});