// pages/api/add-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connect, getConnection } from "@/dbConfig/dbConfig";
import md5 from "md5"; // Import MD5

connect();

export async function POST(req, res) {
    const token = req.cookies.get('token')?.value;
    const connection = getConnection();

    // Validate token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user email
        const user:any= jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user.email; // Extract email from token

        // Get username based on the email from the token
        const [userRow] = await connection.promise().query(
            "SELECT username FROM users WHERE email = ?",
            [userEmail]
        );

        if (!userRow.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const username1 = userRow[0].username;

        // Parse the request data
        let { username, firstname, lastname, email, phone, address,password } = await req.json();
        const hashedIncomingPassword = md5(password);
        password=hashedIncomingPassword;
        // console.log("the fist name is",firstname, lastname, email, phone, address)
        // Check if email or phone already exists
        const [existingClient] = await connection.promise().query(
            "SELECT * FROM users WHERE email = ? OR phone = ?",
            [email, phone]
        );
        console.log("the exiting user is:",existingClient)
        if (existingClient.length) {
            return NextResponse.json({ error: 'Email or phone already exists' }, { status: 409 });
        }

        // Insert the new client with the username from the token
        await connection.promise().query(
            "INSERT INTO users (username, firstname, lastname, email, password, phone,assigned_to, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [username, firstname, lastname, email, password, phone,username1, address]
        );

        return NextResponse.json({ message: 'Client added successfully!' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
