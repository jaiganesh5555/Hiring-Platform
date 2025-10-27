import { ensureSeed, isDatabaseEmpty, seedDatabase } from './seedData';
import { db } from '../db';

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔍 Checking database status...');
    console.log('🔧 Ensuring seed data (will top-up missing records)...');
    await ensureSeed();
    console.log('🎉 Database seeding check completed!');
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    console.log('⚠️  App will continue without seed data.');
  }
}

export async function initApp(): Promise<void> {
  console.log('🚀 Initializing application...');
  
  try {
    await initializeDatabase();
    console.log('✅ Application initialization complete!');
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    
  }
}
 
   // Expose dev helpers
   try {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
     // @ts-ignore
     if (typeof window !== 'undefined') {
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-ignore
       window.__DEV__ = window.__DEV__ || {};
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-ignore
       window.__DEV__.backfillAllTimelines = async (force = false) => {
         const mod = await import('./seedData');
         return mod.backfillAllTimelines(force);
       };
     }
   } catch (e) {
   }

export async function reseedData(): Promise<void> {
  console.log('🔄 Reseeding database...');
  
  try {
    await db.transaction('rw', [db.jobs, db.candidates, db.assessments, db.notes, db.timeline, db.submissions], async () => {
      await db.jobs.clear();
      await db.candidates.clear();
      await db.assessments.clear();
      await db.notes.clear();
      await db.timeline.clear();
      await db.submissions.clear();
    });
    
    await seedDatabase();
    
    console.log('✅ Database reseeded successfully!');
  } catch (error) {
    console.error('❌ Failed to reseed database:', error);
    throw error;
  }
}

export async function seedInitialData(): Promise<void> {
  console.log('📦 Seeding initial data...');
  
  try {
    const isEmpty = await isDatabaseEmpty();
    if (isEmpty) {
      await seedDatabase();
    } else {
      console.log('ℹ️  Database already has data. Use reseedData() to force reseed.');
    }
  } catch (error) {
    console.error('❌ Failed to seed initial data:', error);
    throw error;
  }
}