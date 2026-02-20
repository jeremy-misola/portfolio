import fs from 'fs/promises';
import { db, initializeDatabase } from './database';

const DATA_PATHS = {
  testimonials: './data/testimonials.json',
  projects: './data/projects.json',
  experience: './data/experience.json'
};

async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function migrateExperience() {
  console.log('Migrating experience data...');
  try {
    const experience = await readJSONFile(DATA_PATHS.experience);
    
    for (const item of experience) {
      const existing = await db.getExperienceById(item.id);
      if (!existing) {
        await db.createExperience({
          company: item.company,
          position: item.position,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
          technologies: item.technologies,
          achievements: item.achievements
        });
        console.log(`✓ Added experience: ${item.company} - ${item.position}`);
      } else {
        console.log(`✓ Experience already exists: ${item.company} - ${item.position}`);
      }
    }
    
    console.log(`✓ Experience migration completed. ${experience.length} items processed.`);
  } catch (error) {
    console.error('✗ Error migrating experience:', error);
  }
}

async function migrateProjects() {
  console.log('Migrating projects data...');
  try {
    const projects = await readJSONFile(DATA_PATHS.projects);
    
    for (const item of projects) {
      const existing = await db.getProjectById(item.id);
      if (!existing) {
        await db.createProject({
          title: item.title,
          description: item.description,
          technologies: item.technologies,
          githubUrl: item.githubUrl,
          demoUrl: item.demoUrl,
          status: item.status,
          priority: item.priority,
          images: item.images
        });
        console.log(`✓ Added project: ${item.title}`);
      } else {
        console.log(`✓ Project already exists: ${item.title}`);
      }
    }
    
    console.log(`✓ Projects migration completed. ${projects.length} items processed.`);
  } catch (error) {
    console.error('✗ Error migrating projects:', error);
  }
}

async function migrateTestimonials() {
  console.log('Migrating testimonials data...');
  try {
    const testimonials = await readJSONFile(DATA_PATHS.testimonials);
    
    for (const item of testimonials) {
      const existing = await db.getTestimonialById(item.id);
      if (!existing) {
        await db.createTestimonial({
          name: item.name,
          company: item.company,
          position: item.position,
          content: item.content,
          rating: item.rating,
          status: item.status
        });
        console.log(`✓ Added testimonial: ${item.name}`);
      } else {
        console.log(`✓ Testimonial already exists: ${item.name}`);
      }
    }
    
    console.log(`✓ Testimonials migration completed. ${testimonials.length} items processed.`);
  } catch (error) {
    console.error('✗ Error migrating testimonials:', error);
  }
}

async function runMigration() {
  console.log('Starting data migration...');
  
  try {
    const initialized = await initializeDatabase();
    if (!initialized) {
      console.error('✗ Database initialization failed');
      process.exit(1);
    }

    await migrateExperience();
    await migrateProjects();
    await migrateTestimonials();

    console.log('\n✓ All data migration completed successfully!');
    
    // Verify migration by counting records
    const [experienceCount, projectsCount, testimonialsCount] = await Promise.all([
      (await db.getExperience()).length,
      (await db.getProjects()).length,
      (await db.getTestimonials('all')).length
    ]);
    
    console.log(`\n✓ Database contains:`);
    console.log(`  - Experience: ${experienceCount} records`);
    console.log(`  - Projects: ${projectsCount} records`);
    console.log(`  - Testimonials: ${testimonialsCount} records`);

  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { runMigration, migrateExperience, migrateProjects, migrateTestimonials };