const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Збільшуємо ліміт для base64 картинок

const JWT_SECRET = 'super_secret_animal_key_2026'; // У реальному проєкті це має бути в .env

// Підключення до БД
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password', // Твій пароль
    database: 'animal_shelter'
});

// ==========================================
// MIDDLEWARE: Перевірка авторизації
// ==========================================
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Немає токену' });
    
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Невірний токен' });
        req.user = decoded; // зберігаємо дані юзера (id, role)
        next();
    });
};

// MIDDLEWARE: Перевірка прав Адміна
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ заборонено. Тільки для адміністраторів.' });
    }
    next();
};

// ==========================================
// АВТОРИЗАЦІЯ (Реєстрація та Логін)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, login, email, password, avatar } = req.body;
        
        // Хешуємо пароль
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const id = uuidv4();

        // Робимо першого зареєстрованого - адміном (для тестування), інших - юзерами
        // Або можна жорстко задати role: 'user'
        const role = login === 'admin' ? 'admin' : 'user';

        await pool.query(
            'INSERT INTO users (id, full_name, login, email, password_hash, avatar, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, login, email, passwordHash, avatar, role]
        );
        res.status(201).json({ success: true, message: 'Зареєстровано' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка реєстрації. Можливо логін чи email вже зайняті.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE login = ? OR email = ?', [login, login]);
        
        if (users.length === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Невірний пароль' });

        // Створюємо токен (ключ-перепустку)
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ success: true, token, user: { id: user.id, name: user.full_name, login: user.login, role: user.role, avatar: user.avatar } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ПОСТИ (СТРІЧКА ДОПОМОГИ)
// ==========================================

// 1. Створити пост (Йде на модерацію 'pending')
app.post('/api/posts', verifyToken, async (req, res) => {
    try {
        const post = req.body;
        const id = uuidv4();
        
        await pool.query(
            `INSERT INTO posts (
                id, user_id, title, description, category, help_type, target_type, 
                animal_name, animal_type, gender, breed, age, weight, height, color, health, documents, 
                org_name, org_type, org_city, org_address, provider_name, region, 
                requisites, keeper_phone, image, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                id, req.user.id, post.title, post.description, post.category, post.helpType, post.targetType,
                post.animalName, post.animalType, post.gender, post.breed, post.age, post.weight, post.height, post.color, post.health, post.documents,
                post.orgName, post.orgType, post.orgCity, post.orgAddress, post.providerName, post.region,
                post.requisites, post.keeperPhone, post.image
            ]
        );
        res.status(201).json({ success: true, message: 'Пост відправлено на перевірку адміністратору' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Отримати стрічку (ТІЛЬКИ 'published' пости)
app.get('/api/feed', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT p.*, u.full_name as authorName, u.avatar as authorAvatar, u.role as authorRole 
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

// 3. Історія постів конкретного юзера (бачить опубліковані, відхилені + коментарі адміна)
app.get('/api/users/posts', verifyToken, async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ПАНЕЛЬ АДМІНІСТРАТОРА (Тільки для role: 'admin')
// ==========================================

// 1. Отримати всі пости, які чекають перевірки
app.get('/api/admin/posts/pending', verifyToken, isAdmin, async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE status = "pending" ORDER BY created_at ASC');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Підтвердити пост
app.put('/api/admin/posts/:postId/approve', verifyToken, isAdmin, async (req, res) => {
    try {
        await pool.query('UPDATE posts SET status = "published", admin_comment = NULL WHERE id = ?', [req.params.postId]);
        res.json({ success: true, message: 'Пост успішно опубліковано' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Відхилити пост з поясненням (коментарем)
app.put('/api/admin/posts/:postId/reject', verifyToken, isAdmin, async (req, res) => {
    try {
        const { adminComment } = req.body;
        await pool.query('UPDATE posts SET status = "rejected", admin_comment = ? WHERE id = ?', [adminComment, req.params.postId]);
        res.json({ success: true, message: 'Пост відхилено. Користувач побачить причину.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ІСТОРІЯ ДОНАТІВ ТА ПІДПИСОК
// ==========================================
app.get('/api/users/finances', verifyToken, async (req, res) => {
    try {
        const [donations] = await pool.query('SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        const [subscriptions] = await pool.query('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        
        res.json({ donations, subscriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});