const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'animal_shelter'
};

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool(dbConfig);

app.post('/api/auth/diia', async (req, res) => {
    try {
        const { userId, fullName } = req.body;
        const id = userId || uuidv4();
        const name = fullName || "Користувач Дії";
        
        await pool.query(
            'INSERT INTO users (id, full_name, is_diia_verified) VALUES (?, ?, true) ON DUPLICATE KEY UPDATE full_name = ?',
            [id, name, name]
        );
        
        res.status(200).json({
            success: true,
            message: "✅ Авторизацію через Дію успішно пройдено",
            user: { id, fullName: name, isDiiaVerified: true }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/donations/one-time', async (req, res) => {
    try {
        const { userId, amount, currency } = req.body;
        const id = uuidv4();
        const curr = currency || 'UAH';
        
        await pool.query(
            'INSERT INTO donations (id, user_id, amount, currency, type) VALUES (?, ?, ?, ?, ?)',
            [id, userId, amount, curr, 'one-time']
        );
        
        res.status(200).json({ success: true, donationId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/donations/subscribe', async (req, res) => {
    try {
        const { userId, amount, currency } = req.body;
        const id = uuidv4();
        const curr = currency || 'UAH';
        const platformFee = amount * 0.05;
        const shelterAmount = amount - platformFee;
        
        await pool.query(
            'INSERT INTO subscriptions (id, user_id, total_amount, platform_fee, shelter_amount, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, userId, amount, platformFee, shelterAmount, curr, 'active']
        );
        
        res.status(200).json({ success: true, subscriptionId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { userId, title, content, type } = req.body;
        const id = uuidv4();
        let status = type === 'financial_help_animal' ? 'pending_admin_approval' : 'approved';
        
        await pool.query(
            'INSERT INTO posts (id, user_id, title, content, type, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, userId, title, content, type, status]
        );
        
        res.status(201).json({ success: true, postId: id, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/posts/:postId/approve', async (req, res) => {
    try {
        const { postId } = req.params;
        const [result] = await pool.query(
            'UPDATE posts SET status = ? WHERE id = ?',
            ['approved', postId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Пост не знайдено" });
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE status = ?', ['approved']);
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body;
        const id = uuidv4();
        
        await pool.query(
            'INSERT INTO comments (id, post_id, user_id, text) VALUES (?, ?, ?, ?)',
            [id, postId, userId, text]
        );
        
        res.status(201).json({ success: true, commentId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const [comments] = await pool.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [postId]);
        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chats/messages', async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;
        const id = uuidv4();
        
        await pool.query(
            'INSERT INTO messages (id, sender_id, receiver_id, text) VALUES (?, ?, ?, ?)',
            [id, senderId, receiverId, text]
        );
        
        res.status(201).json({ success: true, messageId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/chats/:userId1/:userId2', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        const [messages] = await pool.query(
            `SELECT * FROM messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?) 
             ORDER BY timestamp ASC`,
            [userId1, userId2, userId2, userId1]
        );
        
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/map/locations', async (req, res) => {
    try {
        const [locations] = await pool.query('SELECT * FROM locations');
        res.status(200).json({ success: true, locations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/animals/search', async (req, res) => {
    try {
        const { species, maxAge } = req.query;
        let query = 'SELECT * FROM animals WHERE status = "looking_for_home"';
        const params = [];

        if (species) {
            query += ' AND species = ?';
            params.push(species);
        }
        if (maxAge) {
            query += ' AND age <= ?';
            params.push(parseInt(maxAge));
        }

        const [animals] = await pool.query(query, params);
        res.status(200).json({ success: true, animals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});