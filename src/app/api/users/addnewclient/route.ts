// pages/api/add-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection, connect } from "@/dbConfig/dbConfig"; // Assuming getConnection is configured for PostgreSQL
import md5 from "md5"; // Import MD5
connect()
const sql = getConnection(); // Use PostgreSQL connection

export async function POST(req, res) {
    const token = req.cookies.get('token')?.value;

    // Validate token
    if (!token) {    
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user email
        const user:any = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user.email; // Extract email from token

        // Get username based on the email from the token
        const userRow = await sql`
            SELECT username FROM users WHERE email = ${userEmail}
        `;

        if (userRow.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const username1 = userRow[0].username;

        // Parse the request data
        const { username, firstname, lastname, email, phone, address, password } = await req.json();
        const hashedIncomingPassword = md5(password);
        const updatedPassword = hashedIncomingPassword;

        // Check if email or phone already exists
        const existingClient = await sql`
            SELECT * FROM users WHERE email = ${email} OR phone = ${phone}
        `;

        if (existingClient.length > 0) {
            return NextResponse.json({ error: 'Email or phone already exists' }, { status: 409 });
        }

        // Insert the new client with the username from the token
        await sql`
            INSERT INTO users (username, firstname, lastname, email, password, phone, assigned_to, address)
            VALUES (${username}, ${firstname}, ${lastname}, ${email}, ${updatedPassword}, ${phone}, ${username1}, ${address})
        `;

        return NextResponse.json({ message: 'Client added successfully!' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
