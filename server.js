import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'athar-professional-practices-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Static files
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// Database setup - optimized initialization
const db = new sqlite3.Database('athar.db');

// Quick database initialization
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Check if tables exist first
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          // Tables don't exist, create them
          createTables().then(() => {
            insertDefaultData().then(resolve).catch(reject);
          }).catch(reject);
        } else {
          // Tables exist, just resolve
          resolve();
        }
      });
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    const tables = [
      `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        student_id TEXT UNIQUE,
        role TEXT NOT NULL DEFAULT 'student',
        branch TEXT,
        college TEXT,
        department TEXT,
        phone TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE practice_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        description TEXT,
        base_points INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE participation_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        multiplier INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE participation_levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        multiplier INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE professional_practices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        practice_type_id INTEGER NOT NULL,
        participation_type_id INTEGER NOT NULL,
        participation_level_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        organization TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        duration_hours INTEGER,
        attachments TEXT,
        status TEXT DEFAULT 'pending',
        calculated_points INTEGER DEFAULT 0,
        reviewer_notes TEXT,
        reviewed_by INTEGER,
        reviewed_at DATETIME,
        approver_notes TEXT,
        approved_by INTEGER,
        approved_at DATETIME,
        certifier_notes TEXT,
        certified_by INTEGER,
        certified_at DATETIME,
        submission_deadline DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (practice_type_id) REFERENCES practice_types (id),
        FOREIGN KEY (participation_type_id) REFERENCES participation_types (id),
        FOREIGN KEY (participation_level_id) REFERENCES participation_levels (id)
      )`,
      `CREATE TABLE practice_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        participation_types TEXT,
        participation_levels TEXT,
        custom_fields TEXT,
        point_calculation_rules TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
      )`
    ];

    let completed = 0;
    tables.forEach(sql => {
      db.run(sql, (err) => {
        if (err) reject(err);
        completed++;
        if (completed === tables.length) resolve();
      });
    });
  });
}

function insertDefaultData() {
  return new Promise((resolve, reject) => {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        // Data already exists
        resolve();
        return;
      }

      // Insert default data
      const adminPassword = bcrypt.hashSync('password123', 10);
      const studentPassword = bcrypt.hashSync('password123', 10);
      const reviewerPassword = bcrypt.hashSync('password123', 10);
      const approverPassword = bcrypt.hashSync('password123', 10);

      const insertions = [
        // Users
        () => new Promise((res, rej) => {
          db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            ['مدير النظام', 'admin@athar.om', adminPassword, 'admin'], (err) => err ? rej(err) : res());
        }),
        () => new Promise((res, rej) => {
          db.run(`INSERT INTO users (name, email, password, student_id, role, branch, college, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['أحمد محمد الشريف', 'student@athar.om', studentPassword, '2021001234', 'student', 'مسقط', 'الهندسة والتكنولوجيا', 'هندسة الحاسوب', '96890123456'], (err) => err ? rej(err) : res());
        }),
        () => new Promise((res, rej) => {
          db.run(`INSERT INTO users (name, email, password, role, branch) VALUES (?, ?, ?, ?, ?)`,
            ['فاطمة علي المقبالي', 'reviewer@athar.om', reviewerPassword, 'reviewer', 'مسقط'], (err) => err ? rej(err) : res());
        }),
        () => new Promise((res, rej) => {
          db.run(`INSERT INTO users (name, email, password, role, branch) VALUES (?, ?, ?, ?, ?)`,
            ['سالم بن عبدالله الهنائي', 'approver@athar.om', approverPassword, 'approver', 'مسقط'], (err) => err ? rej(err) : res());
        })
      ];

      // Practice types
      const practiceTypes = [
        ['التدريب على رأس العمل', 'On-the-job Training', 'التدريب في بيئة العمل الفعلية', 20],
        ['ورش العمل والندوات', 'Workshops and Seminars', 'المشاركة في ورش العمل والندوات المهنية', 10],
        ['المؤتمرات المهنية', 'Professional Conferences', 'حضور أو المشاركة في المؤتمرات', 15]
      ];

      practiceTypes.forEach(type => {
        insertions.push(() => new Promise((res, rej) => {
          db.run(`INSERT INTO practice_types (name_ar, name_en, description, base_points) VALUES (?, ?, ?, ?)`, 
            type, (err) => err ? rej(err) : res());
        }));
      });

      // Participation types
      const participationTypes = [
        ['حضور', 'Attendance', 1],
        ['مشاركة', 'Participation', 2],
        ['تقديم', 'Presentation', 3]
      ];

      participationTypes.forEach(type => {
        insertions.push(() => new Promise((res, rej) => {
          db.run(`INSERT INTO participation_types (name_ar, name_en, multiplier) VALUES (?, ?, ?)`, 
            type, (err) => err ? rej(err) : res());
        }));
      });

      // Participation levels
      const participationLevels = [
        ['الفرع', 'Branch Level', 1],
        ['الجامعة', 'University Level', 2],
        ['محلي', 'Local Level', 3]
      ];

      participationLevels.forEach(level => {
        insertions.push(() => new Promise((res, rej) => {
          db.run(`INSERT INTO participation_levels (name_ar, name_en, multiplier) VALUES (?, ?, ?)`, 
            level, (err) => err ? rej(err) : res());
        }));
      });

      // Execute all insertions
      insertions.reduce((promise, insertion) => {
        return promise.then(insertion);
      }, Promise.resolve()).then(resolve).catch(reject);
    });
  });
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'غير مصرح' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(403).json({ error: 'غير مصرح لك بالوصول' });
    }
  };
}

// Routes

// Authentication routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      student_id: user.student_id,
      branch: user.branch,
      college: user.college,
      department: user.department
    };

    res.json({ 
      success: true, 
      user: req.session.user,
      message: 'تم تسجيل الدخول بنجاح'
    });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في تسجيل الخروج' });
    }
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  });
});

app.get('/api/user', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'نظام أثر يعمل بشكل طبيعي' });
});

// Serve the main application
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'حجم الملف كبير جداً' });
    }
  }
  res.status(500).json({ error: 'خطأ في الخادم' });
});

// Initialize database and start server
console.log('🔄 جاري تهيئة قاعدة البيانات...');
initializeDatabase()
  .then(() => {
    console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
    app.listen(PORT, () => {
      console.log(`🚀 نظام أثر يعمل على المنفذ ${PORT}`);
      console.log(`📱 افتح المتصفح على: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
    process.exit(1);
  });