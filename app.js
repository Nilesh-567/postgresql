const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// PostgreSQL database connection
const pool = new Pool({
    user: "myuser",
    host: "dpg-csq3ic9u0jms73fmoeig-a.oregon-postgres.render.com",
    database: "mydb_hswv",
    password: "uSfub3pbJM4MGK58DQkcW0oqG73hxG1Y",
    port: 5432
});

// Sign-up route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedPassword]
        );
        res.json({ message: "User registered successfully!" });
    } catch (error) {
        if (error.code === "23505") {
            res.json({ message: "Email is already registered!" });
        } else {
            res.json({ message: "An error occurred. Please try again." });
        }
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
