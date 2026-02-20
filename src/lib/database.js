import { Pool } from 'pg';

const CONNECTION_CHECK_TTL_MS = parseInt(process.env.DB_CONNECTION_CHECK_TTL_MS || '10000', 10);
const FAILURE_LOG_COOLDOWN_MS = parseInt(process.env.DB_FAILURE_LOG_COOLDOWN_MS || '60000', 10);

let cachedConnectionStatus = null;
let lastConnectionCheckAt = 0;
let lastFailureLogAt = 0;
let schemaInitialized = false;

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

function toISODate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

function toISO(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function mapExperienceRow(row) {
  return {
    id: row.id.toString(),
    company: row.company,
    position: row.position,
    position_en: row.position_en,
    position_fr: row.position_fr,
    startDate: toISODate(row.start_date),
    endDate: toISODate(row.end_date),
    description: row.description,
    description_en: row.description_en,
    description_fr: row.description_fr,
    technologies: asArray(row.technologies),
    achievements: asArray(row.achievements),
    achievements_en: asArray(row.achievements_en),
    achievements_fr: asArray(row.achievements_fr),
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapProjectRow(row) {
  return {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    description_en: row.description_en,
    description_fr: row.description_fr,
    technologies: asArray(row.technologies),
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    status: row.status,
    priority: row.priority,
    images: asArray(row.images),
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapTestimonialRow(row) {
  return {
    id: row.id.toString(),
    name: row.name,
    company: row.company,
    position: row.position,
    content: row.content,
    rating: row.rating,
    status: row.status,
    createdAt: toISO(row.created_at),
    approvedAt: toISO(row.approved_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapSkillRow(row) {
  return {
    id: row.id.toString(),
    name_en: row.name_en,
    name_fr: row.name_fr,
    category: row.category,
    level: row.level,
    displayOrder: row.display_order,
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapEducationRow(row) {
  return {
    id: row.id.toString(),
    school: row.school,
    location: row.location,
    degree_en: row.degree_en,
    degree_fr: row.degree_fr,
    startDate: toISODate(row.start_date),
    endDate: toISODate(row.end_date),
    description_en: row.description_en,
    description_fr: row.description_fr,
    displayOrder: row.display_order,
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapHobbyRow(row) {
  return {
    id: row.id.toString(),
    name_en: row.name_en,
    name_fr: row.name_fr,
    description_en: row.description_en,
    description_fr: row.description_fr,
    displayOrder: row.display_order,
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapMessageRow(row) {
  return {
    id: row.id.toString(),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

function mapSettingsRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    headline_en: row.headline_en,
    headline_fr: row.headline_fr,
    bio_en: row.bio_en,
    bio_fr: row.bio_fr,
    resumeUrl: row.resume_url,
    email: row.email,
    phone: row.phone,
    location: row.location,
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  };
}

async function testConnection() {
  const now = Date.now();
  if (cachedConnectionStatus !== null && now - lastConnectionCheckAt < CONNECTION_CHECK_TTL_MS) {
    return cachedConnectionStatus;
  }

  try {
    const client = await pool.connect();
    client.release();

    if (cachedConnectionStatus !== true) {
      console.log('✓ Database connection successful');
    }

    cachedConnectionStatus = true;
    lastConnectionCheckAt = Date.now();
    return true;
  } catch (error) {
    const shouldLogFailure =
      cachedConnectionStatus !== false ||
      now - lastFailureLogAt >= FAILURE_LOG_COOLDOWN_MS;

    if (shouldLogFailure) {
      const reason = error?.code || error?.name || 'unknown';
      console.error(`✗ Database connection failed (${reason})`);
      lastFailureLogAt = now;
    }

    cachedConnectionStatus = false;
    lastConnectionCheckAt = Date.now();
    schemaInitialized = false;
    return false;
  }
}

async function initializeDatabase() {
  try {
    const connected = await testConnection();
    if (!connected) {
      return false;
    }

    if (schemaInitialized) {
      return true;
    }

    await createTables();
    schemaInitialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    schemaInitialized = false;
    return false;
  }
}

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT,
        technologies JSONB,
        achievements JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        technologies JSONB,
        github_url VARCHAR(500),
        demo_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'in-progress',
        priority INTEGER DEFAULT 1,
        images JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        position VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_fr VARCHAR(255) NOT NULL,
        category VARCHAR(120),
        level VARCHAR(50),
        display_order INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        school VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        degree_en VARCHAR(255) NOT NULL,
        degree_fr VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description_en TEXT,
        description_fr TEXT,
        display_order INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hobbies (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_fr VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_fr TEXT,
        display_order INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY,
        full_name VARCHAR(255),
        headline_en VARCHAR(255),
        headline_fr VARCHAR(255),
        bio_en TEXT,
        bio_fr TEXT,
        resume_url VARCHAR(500),
        email VARCHAR(255),
        phone VARCHAR(100),
        location VARCHAR(255),
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_en TEXT`);
    await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_fr TEXT`);

    await pool.query(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS position_en VARCHAR(255)`);
    await pool.query(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS position_fr VARCHAR(255)`);
    await pool.query(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS description_en TEXT`);
    await pool.query(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS description_fr TEXT`);
    await pool.query(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS achievements_en JSONB`);
    await pool.query(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS achievements_fr JSONB`);

    await pool.query(`
      INSERT INTO site_settings (id, full_name, headline_en, headline_fr, bio_en, bio_fr)
      VALUES (1, 'Your Name', 'Your Professional Headline', 'Votre titre professionnel', 'Update this from admin settings.', 'Mettez ceci a jour depuis les parametres admin.')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('✓ Database tables created/checked successfully');
  } catch (error) {
    console.error('✗ Error creating tables:', error);
    throw error;
  }
}

const db = {
  async getExperience() {
    const result = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');
    return result.rows.map(mapExperienceRow);
  },

  async getExperienceById(id) {
    const result = await pool.query('SELECT * FROM experience WHERE id = $1', [parseInt(id, 10)]);
    return result.rows[0] ? mapExperienceRow(result.rows[0]) : null;
  },

  async createExperience(data) {
    const result = await pool.query(`
      INSERT INTO experience (
        company, position, position_en, position_fr, start_date, end_date,
        description, description_en, description_fr, technologies, achievements,
        achievements_en, achievements_fr, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15
      )
      RETURNING *
    `, [
      data.company,
      data.position || data.position_en,
      data.position_en || data.position || '',
      data.position_fr || data.position || '',
      data.startDate,
      data.endDate || null,
      data.description || data.description_en || '',
      data.description_en || data.description || '',
      data.description_fr || data.description || '',
      JSON.stringify(asArray(data.technologies)),
      JSON.stringify(asArray(data.achievements)),
      JSON.stringify(asArray(data.achievements_en).length ? data.achievements_en : asArray(data.achievements)),
      JSON.stringify(asArray(data.achievements_fr).length ? data.achievements_fr : asArray(data.achievements)),
      new Date().toISOString(),
      new Date().toISOString(),
    ]);

    return mapExperienceRow(result.rows[0]);
  },

  async updateExperience(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      company: 'company',
      position: 'position',
      position_en: 'position_en',
      position_fr: 'position_fr',
      startDate: 'start_date',
      endDate: 'end_date',
      description: 'description',
      description_en: 'description_en',
      description_fr: 'description_fr',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    if (data.technologies !== undefined) {
      updateFields.push(`technologies = $${index++}`);
      values.push(JSON.stringify(asArray(data.technologies)));
    }
    if (data.achievements !== undefined) {
      updateFields.push(`achievements = $${index++}`);
      values.push(JSON.stringify(asArray(data.achievements)));
    }
    if (data.achievements_en !== undefined) {
      updateFields.push(`achievements_en = $${index++}`);
      values.push(JSON.stringify(asArray(data.achievements_en)));
    }
    if (data.achievements_fr !== undefined) {
      updateFields.push(`achievements_fr = $${index++}`);
      values.push(JSON.stringify(asArray(data.achievements_fr)));
    }

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE experience SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapExperienceRow(result.rows[0]) : null;
  },

  async deleteExperience(id) {
    const result = await pool.query('DELETE FROM experience WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },

  async getProjects() {
    const result = await pool.query('SELECT * FROM projects ORDER BY priority ASC, created_at DESC');
    return result.rows.map(mapProjectRow);
  },

  async getProjectById(id) {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [parseInt(id, 10)]);
    return result.rows[0] ? mapProjectRow(result.rows[0]) : null;
  },

  async createProject(data) {
    const result = await pool.query(`
      INSERT INTO projects (
        title, description, description_en, description_fr, technologies,
        github_url, demo_url, status, priority, images, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      data.title,
      data.description || data.description_en || '',
      data.description_en || data.description || '',
      data.description_fr || data.description || '',
      JSON.stringify(asArray(data.technologies)),
      data.githubUrl || null,
      data.demoUrl || null,
      data.status || 'in-progress',
      Number.isFinite(Number(data.priority)) ? Number(data.priority) : 1,
      JSON.stringify(asArray(data.images)),
      new Date().toISOString(),
      new Date().toISOString(),
    ]);

    return mapProjectRow(result.rows[0]);
  },

  async updateProject(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      title: 'title',
      description: 'description',
      description_en: 'description_en',
      description_fr: 'description_fr',
      githubUrl: 'github_url',
      demoUrl: 'demo_url',
      status: 'status',
      priority: 'priority',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    if (data.technologies !== undefined) {
      updateFields.push(`technologies = $${index++}`);
      values.push(JSON.stringify(asArray(data.technologies)));
    }
    if (data.images !== undefined) {
      updateFields.push(`images = $${index++}`);
      values.push(JSON.stringify(asArray(data.images)));
    }

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE projects SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapProjectRow(result.rows[0]) : null;
  },

  async deleteProject(id) {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },

  async getTestimonials(status = 'approved') {
    const result = status === 'all'
      ? await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC')
      : await pool.query('SELECT * FROM testimonials WHERE status = $1 ORDER BY created_at DESC', [status]);

    return result.rows.map(mapTestimonialRow);
  },

  async getTestimonialById(id) {
    const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [parseInt(id, 10)]);
    return result.rows[0] ? mapTestimonialRow(result.rows[0]) : null;
  },

  async createTestimonial(data) {
    const status = data.status || 'pending';
    const result = await pool.query(`
      INSERT INTO testimonials (
        name, company, position, content, rating, status, created_at, approved_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `, [
      data.name,
      data.company || '',
      data.position || '',
      data.content,
      Number.isFinite(Number(data.rating)) ? Number(data.rating) : 5,
      status,
      new Date().toISOString(),
      status === 'approved' ? new Date().toISOString() : null,
      new Date().toISOString(),
    ]);

    return mapTestimonialRow(result.rows[0]);
  },

  async updateTestimonial(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      name: 'name',
      company: 'company',
      position: 'position',
      content: 'content',
      rating: 'rating',
      status: 'status',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    if (data.status === 'approved') {
      updateFields.push(`approved_at = $${index++}`);
      values.push(new Date().toISOString());
    }

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE testimonials SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapTestimonialRow(result.rows[0]) : null;
  },

  async deleteTestimonial(id) {
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },

  async getSkills() {
    const result = await pool.query('SELECT * FROM skills ORDER BY display_order ASC, created_at DESC');
    return result.rows.map(mapSkillRow);
  },

  async createSkill(data) {
    const result = await pool.query(`
      INSERT INTO skills (name_en, name_fr, category, level, display_order, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `, [
      data.name_en,
      data.name_fr,
      data.category || null,
      data.level || null,
      Number.isFinite(Number(data.displayOrder)) ? Number(data.displayOrder) : 1,
      new Date().toISOString(),
      new Date().toISOString(),
    ]);
    return mapSkillRow(result.rows[0]);
  },

  async updateSkill(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      name_en: 'name_en',
      name_fr: 'name_fr',
      category: 'category',
      level: 'level',
      displayOrder: 'display_order',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE skills SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapSkillRow(result.rows[0]) : null;
  },

  async deleteSkill(id) {
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },

  async getEducation() {
    const result = await pool.query('SELECT * FROM education ORDER BY display_order ASC, start_date DESC');
    return result.rows.map(mapEducationRow);
  },

  async createEducation(data) {
    const result = await pool.query(`
      INSERT INTO education (
        school, location, degree_en, degree_fr, start_date, end_date,
        description_en, description_fr, display_order, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [
      data.school,
      data.location || null,
      data.degree_en,
      data.degree_fr,
      data.startDate,
      data.endDate || null,
      data.description_en || '',
      data.description_fr || '',
      Number.isFinite(Number(data.displayOrder)) ? Number(data.displayOrder) : 1,
      new Date().toISOString(),
      new Date().toISOString(),
    ]);

    return mapEducationRow(result.rows[0]);
  },

  async updateEducation(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      school: 'school',
      location: 'location',
      degree_en: 'degree_en',
      degree_fr: 'degree_fr',
      startDate: 'start_date',
      endDate: 'end_date',
      description_en: 'description_en',
      description_fr: 'description_fr',
      displayOrder: 'display_order',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE education SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapEducationRow(result.rows[0]) : null;
  },

  async deleteEducation(id) {
    const result = await pool.query('DELETE FROM education WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },

  async getHobbies() {
    const result = await pool.query('SELECT * FROM hobbies ORDER BY display_order ASC, created_at DESC');
    return result.rows.map(mapHobbyRow);
  },

  async createHobby(data) {
    const result = await pool.query(`
      INSERT INTO hobbies (
        name_en, name_fr, description_en, description_fr, display_order, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `, [
      data.name_en,
      data.name_fr,
      data.description_en || '',
      data.description_fr || '',
      Number.isFinite(Number(data.displayOrder)) ? Number(data.displayOrder) : 1,
      new Date().toISOString(),
      new Date().toISOString(),
    ]);
    return mapHobbyRow(result.rows[0]);
  },

  async updateHobby(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      name_en: 'name_en',
      name_fr: 'name_fr',
      description_en: 'description_en',
      description_fr: 'description_fr',
      displayOrder: 'display_order',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE hobbies SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapHobbyRow(result.rows[0]) : null;
  },

  async deleteHobby(id) {
    const result = await pool.query('DELETE FROM hobbies WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },

  async getSettings() {
    const result = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    return result.rows[0] ? mapSettingsRow(result.rows[0]) : null;
  },

  async updateSettings(data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    const updateMap = {
      fullName: 'full_name',
      headline_en: 'headline_en',
      headline_fr: 'headline_fr',
      bio_en: 'bio_en',
      bio_fr: 'bio_fr',
      resumeUrl: 'resume_url',
      email: 'email',
      phone: 'phone',
      location: 'location',
      linkedinUrl: 'linkedin_url',
      githubUrl: 'github_url',
    };

    Object.entries(updateMap).forEach(([input, column]) => {
      if (data[input] !== undefined) {
        updateFields.push(`${column} = $${index++}`);
        values.push(data[input]);
      }
    });

    if (updateFields.length === 0) {
      return this.getSettings();
    }

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());

    const result = await pool.query(`
      UPDATE site_settings
      SET ${updateFields.join(', ')}
      WHERE id = 1
      RETURNING *
    `, values);

    return result.rows[0] ? mapSettingsRow(result.rows[0]) : null;
  },

  async createMessage(data) {
    const result = await pool.query(`
      INSERT INTO contact_messages (name, email, subject, message, status, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `, [
      data.name,
      data.email,
      data.subject,
      data.message,
      data.status || 'unread',
      new Date().toISOString(),
      new Date().toISOString(),
    ]);

    return mapMessageRow(result.rows[0]);
  },

  async getMessages() {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return result.rows.map(mapMessageRow);
  },

  async updateMessage(id, data) {
    const updateFields = [];
    const values = [];
    let index = 1;

    if (data.status !== undefined) {
      updateFields.push(`status = $${index++}`);
      values.push(data.status);
    }

    if (data.subject !== undefined) {
      updateFields.push(`subject = $${index++}`);
      values.push(data.subject);
    }

    if (data.message !== undefined) {
      updateFields.push(`message = $${index++}`);
      values.push(data.message);
    }

    updateFields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(parseInt(id, 10));

    const result = await pool.query(
      `UPDATE contact_messages SET ${updateFields.join(', ')} WHERE id = $${index} RETURNING *`,
      values,
    );

    return result.rows[0] ? mapMessageRow(result.rows[0]) : null;
  },

  async deleteMessage(id) {
    const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [parseInt(id, 10)]);
    return result.rowCount > 0;
  },
};

export { pool, testConnection, initializeDatabase, createTables, db };
