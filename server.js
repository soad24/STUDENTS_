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
const PORT = process.env.PORT || 30001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
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

// Database setup
const db = new sqlite3.Database('athar.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
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
  )`);

  // Practice types table
  db.run(`CREATE TABLE IF NOT EXISTS practice_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    base_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Participation types table
  db.run(`CREATE TABLE IF NOT EXISTS participation_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    multiplier INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Participation levels table
  db.run(`CREATE TABLE IF NOT EXISTS participation_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    multiplier INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Professional practices table
  db.run(`CREATE TABLE IF NOT EXISTS professional_practices (
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
  )`);

  // Practice templates table
  db.run(`CREATE TABLE IF NOT EXISTS practice_templates (
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
  )`);

  // Insert default data
  insertDefaultData();
});

function insertDefaultData() {
  // Insert default admin user
  const adminPassword = bcrypt.hashSync('password123', 10);
  db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['مدير النظام', 'admin@athar.om', adminPassword, 'admin']);

  // Insert default student user
  const studentPassword = bcrypt.hashSync('password123', 10);
  db.run(`INSERT OR IGNORE INTO users (name, email, password, student_id, role, branch, college, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['أحمد محمد الشريف', 'student@athar.om', studentPassword, '2021001234', 'student', 'مسقط', 'الهندسة والتكنولوجيا', 'هندسة الحاسوب', '96890123456']);

  // Insert default reviewer user
  const reviewerPassword = bcrypt.hashSync('password123', 10);
  db.run(`INSERT OR IGNORE INTO users (name, email, password, role, branch) VALUES (?, ?, ?, ?, ?)`,
    ['فاطمة علي المقبالي', 'reviewer@athar.om', reviewerPassword, 'reviewer', 'مسقط']);

  // Insert default approver user
  const approverPassword = bcrypt.hashSync('password123', 10);
  db.run(`INSERT OR IGNORE INTO users (name, email, password, role, branch) VALUES (?, ?, ?, ?, ?)`,
    ['سالم بن عبدالله الهنائي', 'approver@athar.om', approverPassword, 'approver', 'مسقط']);

  // Insert practice types
  const practiceTypes = [
    ['التدريب على رأس العمل', 'On-the-job Training', 'التدريب في بيئة العمل الفعلية', 20],
    ['التدريب الاختياري', 'Optional Training', 'التدريب التطوعي خارج المنهج', 15],
    ['الزيارات الميدانية', 'Field Visits', 'زيارات للمؤسسات والشركات', 5],
    ['ورش العمل والندوات', 'Workshops and Seminars', 'المشاركة في ورش العمل والندوات المهنية', 10],
    ['المؤتمرات المهنية', 'Professional Conferences', 'حضور أو المشاركة في المؤتمرات', 15],
    ['المسابقات والهاكاثونات', 'Competitions and Hackathons', 'المشاركة في المسابقات التقنية', 25],
    ['المعارض', 'Exhibitions', 'المشاركة في المعارض المهنية', 10],
    ['عضوية الجمعيات المهنية', 'Professional Society Membership', 'العضوية في الجمعيات المهنية المتخصصة', 15],
    ['الشهادات الاحترافية', 'Professional Certifications', 'الحصول على شهادات مهنية معتمدة', 30],
    ['العمل بدوام جزئي', 'Part-time Work', 'العمل في تخصص ذي صلة', 20]
  ];

  practiceTypes.forEach(type => {
    db.run(`INSERT OR IGNORE INTO practice_types (name_ar, name_en, description, base_points) VALUES (?, ?, ?, ?)`, type);
  });

  // Insert participation types
  const participationTypes = [
    ['حضور', 'Attendance', 1],
    ['مشاركة', 'Participation', 2],
    ['تقديم', 'Presentation', 3],
    ['تنظيم', 'Organization', 4],
    ['قيادة', 'Leadership', 5]
  ];

  participationTypes.forEach(type => {
    db.run(`INSERT OR IGNORE INTO participation_types (name_ar, name_en, multiplier) VALUES (?, ?, ?)`, type);
  });

  // Insert participation levels
  const participationLevels = [
    ['الفرع', 'Branch Level', 1],
    ['الجامعة', 'University Level', 2],
    ['محلي', 'Local Level', 3],
    ['إقليمي', 'Regional Level', 4],
    ['دولي', 'International Level', 5]
  ];

  participationLevels.forEach(level => {
    db.run(`INSERT OR IGNORE INTO participation_levels (name_ar, name_en, multiplier) VALUES (?, ?, ?)`, level);
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

// Dashboard routes
app.get('/api/dashboard', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const userRole = req.session.user.role;

  if (userRole === 'student') {
    // Student dashboard
    db.all(`
      SELECT pp.*, pt.name_ar as practice_type_name, prt.name_ar as participation_type_name, pl.name_ar as participation_level_name
      FROM professional_practices pp
      JOIN practice_types pt ON pp.practice_type_id = pt.id
      JOIN participation_types prt ON pp.participation_type_id = prt.id
      JOIN participation_levels pl ON pp.participation_level_id = pl.id
      WHERE pp.user_id = ?
      ORDER BY pp.created_at DESC
      LIMIT 5
    `, [userId], (err, practices) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      db.get(`
        SELECT 
          COUNT(*) as total_practices,
          SUM(CASE WHEN status = 'approved' THEN calculated_points ELSE 0 END) as total_points,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count
        FROM professional_practices 
        WHERE user_id = ?
      `, [userId], (err, stats) => {
        if (err) {
          return res.status(500).json({ error: 'خطأ في الخادم' });
        }

        res.json({
          practices,
          stats: {
            totalPractices: stats.total_practices || 0,
            totalPoints: stats.total_points || 0,
            pendingCount: stats.pending_count || 0,
            approvedCount: stats.approved_count || 0
          }
        });
      });
    });
  } else if (userRole === 'admin') {
    // Admin dashboard
    db.all(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM professional_practices) as total_practices,
        (SELECT COUNT(*) FROM professional_practices WHERE status = 'pending') as pending_practices,
        (SELECT COUNT(*) FROM professional_practices WHERE status = 'approved') as approved_practices
    `, (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      res.json({
        stats: stats[0] || {
          total_students: 0,
          total_practices: 0,
          pending_practices: 0,
          approved_practices: 0
        }
      });
    });
  } else {
    // Reviewer/Approver dashboard
    let query = '';
    if (userRole === 'reviewer') {
      query = `SELECT pp.*, u.name as student_name, pt.name_ar as practice_type_name
               FROM professional_practices pp
               JOIN users u ON pp.user_id = u.id
               JOIN practice_types pt ON pp.practice_type_id = pt.id
               WHERE pp.status = 'pending'
               ORDER BY pp.created_at DESC`;
    } else if (userRole === 'approver') {
      query = `SELECT pp.*, u.name as student_name, pt.name_ar as practice_type_name
               FROM professional_practices pp
               JOIN users u ON pp.user_id = u.id
               JOIN practice_types pt ON pp.practice_type_id = pt.id
               WHERE pp.status = 'under_review'
               ORDER BY pp.created_at DESC`;
    }

    db.all(query, (err, practices) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      res.json({ practices });
    });
  }
});

// Professional practices routes
app.get('/api/practices', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const userRole = req.session.user.role;
  const { page = 1, limit = 10, status, search } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT pp.*, u.name as student_name, pt.name_ar as practice_type_name, 
           prt.name_ar as participation_type_name, pl.name_ar as participation_level_name
    FROM professional_practices pp
    JOIN users u ON pp.user_id = u.id
    JOIN practice_types pt ON pp.practice_type_id = pt.id
    JOIN participation_types prt ON pp.participation_type_id = prt.id
    JOIN participation_levels pl ON pp.participation_level_id = pl.id
  `;

  let params = [];
  let whereConditions = [];

  if (userRole === 'student') {
    whereConditions.push('pp.user_id = ?');
    params.push(userId);
  }

  if (status) {
    whereConditions.push('pp.status = ?');
    params.push(status);
  }

  if (search) {
    whereConditions.push('(pp.title LIKE ? OR pp.organization LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ');
  }

  query += ' ORDER BY pp.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, practices) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM professional_practices pp';
    let countParams = [];

    if (userRole === 'student') {
      countQuery += ' WHERE user_id = ?';
      countParams.push(userId);
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      res.json({
        practices,
        pagination: {
          total: countResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

app.get('/api/practices/:id', requireAuth, (req, res) => {
  const practiceId = req.params.id;
  const userId = req.session.user.id;
  const userRole = req.session.user.role;

  let query = `
    SELECT pp.*, u.name as student_name, pt.name_ar as practice_type_name, 
           prt.name_ar as participation_type_name, pl.name_ar as participation_level_name,
           reviewer.name as reviewer_name, approver.name as approver_name
    FROM professional_practices pp
    JOIN users u ON pp.user_id = u.id
    JOIN practice_types pt ON pp.practice_type_id = pt.id
    JOIN participation_types prt ON pp.participation_type_id = prt.id
    JOIN participation_levels pl ON pp.participation_level_id = pl.id
    LEFT JOIN users reviewer ON pp.reviewed_by = reviewer.id
    LEFT JOIN users approver ON pp.approved_by = approver.id
    WHERE pp.id = ?
  `;

  let params = [practiceId];

  if (userRole === 'student') {
    query += ' AND pp.user_id = ?';
    params.push(userId);
  }

  db.get(query, params, (err, practice) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    if (!practice) {
      return res.status(404).json({ error: 'الممارسة المهنية غير موجودة' });
    }

    // Parse attachments if they exist
    if (practice.attachments) {
      try {
        practice.attachments = JSON.parse(practice.attachments);
      } catch (e) {
        practice.attachments = [];
      }
    } else {
      practice.attachments = [];
    }

    res.json({ practice });
  });
});

app.post('/api/practices', requireAuth, upload.array('attachments', 5), (req, res) => {
  const userId = req.session.user.id;
  const {
    practice_type_id,
    participation_type_id,
    participation_level_id,
    title,
    description,
    organization,
    start_date,
    end_date,
    duration_hours
  } = req.body;

  // Handle file attachments
  const attachments = req.files ? req.files.map(file => ({
    original_name: file.originalname,
    filename: file.filename,
    path: `/uploads/${file.filename}`,
    size: file.size
  })) : [];

  // Calculate points
  db.get(`
    SELECT pt.base_points, prt.multiplier as participation_multiplier, pl.multiplier as level_multiplier
    FROM practice_types pt, participation_types prt, participation_levels pl
    WHERE pt.id = ? AND prt.id = ? AND pl.id = ?
  `, [practice_type_id, participation_type_id, participation_level_id], (err, pointsData) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    const calculatedPoints = pointsData ? 
      pointsData.base_points * pointsData.participation_multiplier * pointsData.level_multiplier : 0;

    // Calculate submission deadline (1 month after end date)
    const submissionDeadline = new Date(end_date);
    submissionDeadline.setMonth(submissionDeadline.getMonth() + 1);

    db.run(`
      INSERT INTO professional_practices (
        user_id, practice_type_id, participation_type_id, participation_level_id,
        title, description, organization, start_date, end_date, duration_hours,
        attachments, calculated_points, submission_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, practice_type_id, participation_type_id, participation_level_id,
      title, description, organization, start_date, end_date, duration_hours,
      JSON.stringify(attachments), calculatedPoints, submissionDeadline.toISOString()
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'خطأ في حفظ الممارسة المهنية' });
      }

      res.json({ 
        success: true, 
        message: 'تم إرسال الممارسة المهنية بنجاح',
        practiceId: this.lastID
      });
    });
  });
});

// Get form data for creating practices
app.get('/api/practice-form-data', requireAuth, (req, res) => {
  db.all('SELECT * FROM practice_types WHERE is_active = 1', (err, practiceTypes) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    db.all('SELECT * FROM participation_types WHERE is_active = 1', (err, participationTypes) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      db.all('SELECT * FROM participation_levels WHERE is_active = 1', (err, participationLevels) => {
        if (err) {
          return res.status(500).json({ error: 'خطأ في الخادم' });
        }

        res.json({
          practiceTypes,
          participationTypes,
          participationLevels
        });
      });
    });
  });
});

// Practice review/approval routes
app.post('/api/practices/:id/review', requireAuth, requireRole('reviewer'), (req, res) => {
  const practiceId = req.params.id;
  const reviewerId = req.session.user.id;
  const { action, notes } = req.body;

  let newStatus;
  switch (action) {
    case 'approve':
      newStatus = 'under_review';
      break;
    case 'reject':
      newStatus = 'rejected';
      break;
    case 'return':
      newStatus = 'pending';
      break;
    default:
      return res.status(400).json({ error: 'إجراء غير صحيح' });
  }

  db.run(`
    UPDATE professional_practices 
    SET status = ?, reviewer_notes = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [newStatus, notes, reviewerId, practiceId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'خطأ في حفظ المراجعة' });
    }

    res.json({ success: true, message: 'تم حفظ المراجعة بنجاح' });
  });
});

app.post('/api/practices/:id/approve', requireAuth, requireRole('approver'), (req, res) => {
  const practiceId = req.params.id;
  const approverId = req.session.user.id;
  const { action, notes, points } = req.body;

  let newStatus;
  switch (action) {
    case 'approve':
      newStatus = 'approved';
      break;
    case 'reject':
      newStatus = 'rejected';
      break;
    case 'return':
      newStatus = 'pending';
      break;
    default:
      return res.status(400).json({ error: 'إجراء غير صحيح' });
  }

  const finalPoints = points || null;

  db.run(`
    UPDATE professional_practices 
    SET status = ?, approver_notes = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP
    ${finalPoints ? ', calculated_points = ?' : ''}
    WHERE id = ?
  `, finalPoints ? [newStatus, notes, approverId, finalPoints, practiceId] : [newStatus, notes, approverId, practiceId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'خطأ في حفظ الاعتماد' });
    }

    res.json({ success: true, message: 'تم حفظ الاعتماد بنجاح' });
  });
});

// Template management routes (Admin only)
app.get('/api/templates', requireAuth, requireRole('admin'), (req, res) => {
  db.all(`
    SELECT pt.*, u.name as creator_name
    FROM practice_templates pt
    JOIN users u ON pt.created_by = u.id
    ORDER BY pt.created_at DESC
  `, (err, templates) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    // Parse JSON fields
    templates.forEach(template => {
      try {
        template.participation_types = JSON.parse(template.participation_types || '[]');
        template.participation_levels = JSON.parse(template.participation_levels || '[]');
        template.custom_fields = JSON.parse(template.custom_fields || '[]');
        template.point_calculation_rules = JSON.parse(template.point_calculation_rules || '[]');
      } catch (e) {
        template.participation_types = [];
        template.participation_levels = [];
        template.custom_fields = [];
        template.point_calculation_rules = [];
      }
    });

    res.json({ templates });
  });
});

app.post('/api/templates', requireAuth, requireRole('admin'), (req, res) => {
  const createdBy = req.session.user.id;
  const { name, description, participation_types, participation_levels, custom_fields } = req.body;

  db.run(`
    INSERT INTO practice_templates (name, description, participation_types, participation_levels, custom_fields, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    name,
    description,
    JSON.stringify(participation_types || []),
    JSON.stringify(participation_levels || []),
    JSON.stringify(custom_fields || []),
    createdBy
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'خطأ في حفظ القالب' });
    }

    res.json({ 
      success: true, 
      message: 'تم إنشاء القالب بنجاح',
      templateId: this.lastID
    });
  });
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

app.listen(PORT, () => {
  console.log(`🚀 نظام أثر يعمل على المنفذ ${PORT}`);
  console.log(`📱 افتح المتصفح على: http://localhost:${PORT}`);
});