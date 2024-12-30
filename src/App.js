const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Use pg package to connect to PostgreSQL
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Setup PostgreSQL client
const pool = new Pool({
    host: process.env.DB_HOST,    
    port: process.env.DB_PORT,     
    user: process.env.DB_USER,    
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, // postgres (or your correct database name)
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(bodyParser.json());
// Middleware for handling cookies and session
app.use(cookieParser());

app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // 1 hour
    },
}));

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Token from cookie or Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
};

// const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRATION,  // 5 minutes expiration
//     issuer: process.env.JWT_ISSUER,
//     audience: process.env.JWT_AUDIENCE
//   });

//   const refreshToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
//     expiresIn: '7d',  // Longer expiration for refresh token
// });
// res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingUserResult = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);
        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertResult = await pool.query('INSERT INTO "User" (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.json({ id: insertResult.rows[0].user_id });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);

        if (userResult.rows.length > 0 && await bcrypt.compare(password, userResult.rows[0].password)) {
            const user = userResult.rows[0];

            // Generate JWT token
            const token = generateToken(user);

            // Store token in session
            req.session.user = user;
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            res.json({ message: 'Login successful', token, user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    });
});


app.get('/profile', authenticateJWT, (req, res) => {
    res.json({ user: req.user });
});



// Check if username is available
app.post('/check-username', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const existingUserResult = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);
        res.json({ available: existingUserResult.rows.length === 0 });
    } catch (error) {
        console.error('Error checking username:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// PG Routes
app.get('/pgs', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pg');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching PGs:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/pg', async (req, res) => {
    const { pg_name, location_id } = req.body;
    if (!pg_name || !location_id) {
        return res.status(400).json({ message: 'PG name and location ID are required' });
    }
    try {
        const result = await pool.query('INSERT INTO pg (pg_name, location_id) VALUES ($1, $2) RETURNING *', [pg_name, location_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding PG:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/pg/:id', async (req, res) => {
    const { id } = req.params;
    const { pg_name, location_id } = req.body;
    try {
        const result = await pool.query('UPDATE pg SET pg_name = $1, location_id = $2 WHERE pg_id = $3 RETURNING *', [pg_name, location_id, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'PG not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating PG:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/pg/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM pg WHERE pg_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'PG not found' });
        }
        res.json({ message: 'PG deleted' });
    } catch (error) {
        console.error('Error deleting PG:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Location Routes
app.get('/locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM location');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/location', async (req, res) => {
    const { location_name, address } = req.body;
    if (!location_name || !address) {
        return res.status(400).json({ message: 'Location name and address are required' });
    }
    try {
        const result = await pool.query('INSERT INTO location (location_name, address) VALUES ($1, $2) RETURNING *', [location_name, address]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding location:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/location/:id', async (req, res) => {
    const { id } = req.params;
    const { location_name, address } = req.body;
    try {
        const result = await pool.query('UPDATE location SET location_name = $1, address = $2 WHERE location_id = $3 RETURNING *', [location_name, address, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating location:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/location/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM location WHERE location_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json({ message: 'Location deleted' });
    } catch (error) {
        console.error('Error deleting location:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Room Routes
app.get('/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM room');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rooms:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/room', async (req, res) => {
    const { room_name, pg_id } = req.body;
    if (!room_name || !pg_id) {
        return res.status(400).json({ message: 'Room name and PG ID are required' });
    }
    try {
        const result = await pool.query('INSERT INTO room (room_name, pg_id) VALUES ($1, $2) RETURNING *', [room_name, pg_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding room:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/room/:id', async (req, res) => {
    const { id } = req.params;
    const { room_name, pg_id } = req.body;
    try {
        const result = await pool.query('UPDATE room SET room_name = $1, pg_id = $2 WHERE room_id = $3 RETURNING *', [room_name, pg_id, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating room:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/room/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM room WHERE room_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted' });
    } catch (error) {
        console.error('Error deleting room:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bed Routes
app.get('/beds', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bed');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching beds:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/bed', async (req, res) => {
    const { bed_number, room_id } = req.body;
    if (!bed_number || !room_id) {
        return res.status(400).json({ message: 'Bed number and room ID are required' });
    }
    try {
        const result = await pool.query('INSERT INTO bed (bed_number, room_id) VALUES ($1, $2) RETURNING *', [bed_number, room_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding bed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/bed/:id', async (req, res) => {
    const { id } = req.params;
    const { bed_number, room_id } = req.body;
    try {
        const result = await pool.query('UPDATE bed SET bed_number = $1, room_id = $2 WHERE bed_id = $3 RETURNING *', [bed_number, room_id, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Bed not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating bed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/bed/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM bed WHERE bed_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Bed not found' });
        }
        res.json({ message: 'Bed deleted' });
    } catch (error) {
        console.error('Error deleting bed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Tenant Routes
app.get('/tenants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tenant');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tenants:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/tenant', async (req, res) => {
    const { tenant_name, bed_id, join_date } = req.body;
    if (!tenant_name || !bed_id || !join_date) {
        return res.status(400).json({ message: 'Tenant name, bed ID, and join date are required' });
    }
    try {
        const result = await pool.query('INSERT INTO tenant (tenant_name, bed_id, join_date) VALUES ($1, $2, $3) RETURNING *', [tenant_name, bed_id, join_date]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding tenant:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/tenant/:id', async (req, res) => {
    const { id } = req.params;
    const { tenant_name, bed_id, join_date } = req.body;
    try {
        const result = await pool.query('UPDATE tenant SET tenant_name = $1, bed_id = $2, join_date = $3 WHERE tenant_id = $4 RETURNING *', [tenant_name, bed_id, join_date, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating tenant:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/tenant/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tenant WHERE tenant_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json({ message: 'Tenant deleted' });
    } catch (error) {
        console.error('Error deleting tenant:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Expense Routes
app.get('/expenses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expense');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching expenses:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/expense', async (req, res) => {
    const { amount, pg_id, description, date } = req.body;
    if (!amount || !pg_id || !description || !date) {
        return res.status(400).json({ message: 'Amount, PG ID, description, and date are required' });
    }
    try {
        const result = await pool.query('INSERT INTO expense (amount, pg_id, description, date) VALUES ($1, $2, $3, $4) RETURNING *', [amount, pg_id, description, date]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding expense:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/expense/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, pg_id, description, date } = req.body;
    try {
        const result = await pool.query('UPDATE expense SET amount = $1, pg_id = $2, description = $3, date = $4 WHERE expense_id = $5 RETURNING *', [amount, pg_id, description, date, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating expense:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/expense/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM expense WHERE expense_id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

const port = 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
