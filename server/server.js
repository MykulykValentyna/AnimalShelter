require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Для підтримки великих фото в форматі base64

// Константи з файлу .env
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;

// Підключення до бази даних
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// MIDDLEWARES (Перевірка прав)
// ==========================================

// Перевірка, чи користувач залогінений (наявність валідного токена)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Немає токену. Доступ заборонено.' });
    
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Сесія закінчилася. Увійдіть знову.' });
        req.user = decoded; // зберігаємо дані (id, role) у запиті
        next();
    });
};

// Перевірка, чи користувач є адміном
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Ця дія доступна тільки для адміністраторів.' });
    }
    next();
};

// ==========================================
// АВТОРИЗАЦІЯ
// ==========================================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, login, email, password, avatar } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const id = uuidv4();
        const role = email === SUPERADMIN_EMAIL ? 'admin' : 'user';

        await pool.query(
            'INSERT INTO users (id, full_name, login, email, password_hash, avatar, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, login, email, passwordHash, avatar || null, role]
        );

        // ГЕНЕРУЄМО ТОКЕН ОДРАЗУ
        const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ 
            success: true, 
            token, 
            user: { id, name, login, role, avatar } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Логін або Email вже зайняті.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE login = ? OR email = ?', [login, login]);
        
        if (users.length === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
        
        const user = users[0];
        
        // УНІВЕРСАЛЬНА ПЕРЕВІРКА ПАРОЛЯ: шукаємо або колонку password_hash, або password
        const dbPassword = user.password_hash || user.password;
        
        if (!dbPassword) {
            return res.status(500).json({ error: 'Помилка БД: пароль користувача не знайдено або він не зашифрований.' });
        }

        const validPassword = await bcrypt.compare(password, dbPassword);
        if (!validPassword) return res.status(400).json({ error: 'Невірний пароль' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.full_name, login: user.login, role: user.role, avatar: user.avatar } 
        });
    } catch (error) {
        console.error("Помилка логіну:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ПРОФІЛЬ ТА ВИДАЛЕННЯ
// ==========================================

app.get('/api/users/me', verifyToken, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, full_name, login, email, role, avatar FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
        
        const u = users[0];
        // Перетворюємо full_name на name, щоб фронтенду було зручно
        res.json({ 
            user: { id: u.id, name: u.full_name, login: u.login, email: u.email, role: u.role, avatar: u.avatar } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [user] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);

        // Заборона видалення головного адміна
        if (user[0] && user[0].email === SUPERADMIN_EMAIL) {
            return res.status(403).json({ error: 'Суперадмін не може видалити свій акаунт.' });
        }

        // Завдяки ON DELETE CASCADE в SQL, всі пости юзера видаляться самі
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ success: true, message: 'Ваш акаунт видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення.' });
    }
});

// ==========================================
// ПОСТИ (СТРІЧКА ДОПОМОГИ)
// ==========================================

app.post('/api/posts', verifyToken, async (req, res) => {
    try {
        const post = req.body;
        const id = uuidv4();
        await pool.query(
            `INSERT INTO posts (id, user_id, title, description, category, image, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [id, req.user.id, post.title, post.description, post.category, post.image]
        );
        res.status(201).json({ success: true, message: 'Відправлено на модерацію' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT p.*, u.full_name as authorName, u.avatar as authorAvatar 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.status = 'published' 
            ORDER BY p.created_at DESC
        `);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// АДМІН-ПАНЕЛЬ
// ==========================================

// Отримати пости, що чекають перевірки
app.get('/api/admin/posts/pending', verifyToken, isAdmin, async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE status = "pending" ORDER BY created_at ASC');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Схвалити пост
app.put('/api/admin/posts/:id/approve', verifyToken, isAdmin, async (req, res) => {
    try {
        await pool.query('UPDATE posts SET status = "published" WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Відхилити пост
app.put('/api/admin/posts/:id/reject', verifyToken, isAdmin, async (req, res) => {
    try {
        const { reason } = req.body;
        await pool.query('UPDATE posts SET status = "rejected", admin_comment = ? WHERE id = ?', [reason, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Змінити роль користувача
app.put('/api/admin/users/set-role', verifyToken, isAdmin, async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        const [target] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);

        if (target[0] && target[0].email === SUPERADMIN_EMAIL) {
            return res.status(403).json({ error: 'Права суперадміна змінити неможливо.' });
        }

        await pool.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Помилка зміни ролі.' });
    }
});

// ==========================================
// ФІНАНСИ
// ==========================================
app.get('/api/users/finances', verifyToken, async (req, res) => {
    try {
        const [donations] = await pool.query('SELECT * FROM donations WHERE user_id = ?', [req.user.id]);
        const [subscriptions] = await pool.query('SELECT * FROM subscriptions WHERE user_id = ?', [req.user.id]);
        res.json({ donations, subscriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати всіх користувачів (для чатів)
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        // Вибираємо всіх, крім себе
        const [users] = await pool.query(
            'SELECT id, full_name as name, login, avatar, role FROM users WHERE id != ?', 
            [req.user.id]
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ЗАПУСК
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер AnimalShelter запущено на порту ${PORT}`);
});