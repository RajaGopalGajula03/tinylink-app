const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require("dotenv").config();


const app = express();

app.use(cors({
  origin: 'https://tinylink-app1.onrender.com', // frontend URL
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

 
const port = process.env.PORT || 8080;
const startTime = Date.now();


//DB Initialization

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log("Connected to Neon PostgreSQL"))
    .catch(err => console.log("DB Connection error:", err));

// Validation

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// check for valid url

function isValidUrl(url) {
    try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
    }
    catch {
        return false;
    }
}

// post api link /api/links

app.post('/api/links', async (req, res) => {
    try {
        const { url, code } = req.body;

        if (!isValidUrl(url)) {
            return res.status(400).json({ error: "Invalid URL" });
        }
        let finalCode = code;

        // if user gave code

        if (finalCode) {
            if (!CODE_REGEX.test(finalCode)) {
                return res.status(400).json({ error: "Invalid Code format" });
            }
            //  check if custom code exists
            const exists = await pool.query("SELECT 1 FROM links WHERE code=$1", [finalCode]);


            if (exists.rowCount > 0) {
                return res.status(409).json({ error: "Code already exists" });
            }
        }

        // if user did not give code auto generate
        else {
            finalCode = Math.random().toString(36).substring(2, 8).slice(0, 6);
        }

        const result = await pool.query("INSERT INTO links(code,url) VALUES ($1,$2) RETURNING *", [finalCode, url]);
        res.status(201).json(result.rows[0]);
    }


    catch (err) {
        console.error("POST/api/links error: ", err);
        res.status(500).json({ error: "Internal Server error" })
    }
})
// console.log(new URL("https://google.com").protocol);

// get all links

app.get('/api/links', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id,code,url,clicks,last_clicked,created_at FROM links ORDER BY created_at DESC"
        );
        res.json(result.rows);
    }
    catch (err) {
        console.error("GET /api/links error:", err);
        res.status(500).json({ error: "Internal Server error" });
    }
})

//  get sinlgle link details

app.get('/api/links/:code', async (req, res) => {

    try {
        const { code } = req.params;

        if (!CODE_REGEX.test(code)) {
            return res.status(400).json({ error: " Invalid code format" });
        }

        const result = await pool.query(
            "SELECT * FROM links WHERE code=$1", [code]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error("GET/api/links/:code error: ", err);
        res.status(500).json({ error: "Internal Server error" });
    }
})

// delete link

app.delete('/api/links/:code', async (req, res) => {
    try {
        const { code } = req.params;

        if (!CODE_REGEX.test(code)) {
            return res.status(400).json({ error: "Invalid code format" });
        }

        const result = await pool.query(
            "DELETE FROM links WHERE code=$1 RETURNING id", [code]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: " Not found" })
        }

        res.json({ ok: true });
    }
    catch (err) {
        console.error("DELETE /api/link/:code error:", err);
        res.status(500).json({ error: "Internal Server error" });
    }
})

// health check api

app.get('/healthz', async (req, res) => {
    try {
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;

        const formattedUptime = `${hours}h ${minutes}m ${seconds}`;

        // count total links

        const result = await pool.query("SELECT COUNT(*) FROM links");
        const totalLinks = parseInt(result.rows[0].count, 10);

        res.json({
            ok: true,
            version: "1.0",
            uptime: formattedUptime,
            total_links: totalLinks
        })
    }
    catch (err) {
        console.error("Healthz error:", err);
        res.status(500).json({ ok: false, error: "Internal Server error" });
    }
})

// redirect route 

app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;

        if (!CODE_REGEX.test(code)) {
            return res.status(400).send("Not found");
        }

        const result = await pool.query(
            "SELECT url FROM links WHERE code=$1", [code]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Not found");
        }

        const url = result.rows[0].url;

        // increment click count
        await pool.query(
            "UPDATE links SET clicks = clicks + 1, last_clicked = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata') WHERE code=$1",
            [code]
        );



        return res.redirect(302, url);
    }
    catch (err) {
        console.error("Redirect error:", err);
        res.status(500).send("Internal Server Error");
    }
})



app.listen(port, () => {
    console.log(`Server running at ${port}`);
})