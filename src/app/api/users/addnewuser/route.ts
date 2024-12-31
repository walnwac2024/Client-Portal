// pages/api/add-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // Assuming getConnection is configured for PostgreSQL
connect();
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
        const userEmail = user?.email; // Extract email from token

        // Get username based on the email from the token
        const userRow = await sql`
            SELECT username FROM users WHERE email = ${userEmail}
        `;

        if (userRow.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const username1 = userRow[0].username;

        // Parse the request data
        const { firstname, lastname, cnic, email, phone, office_name, office_address } = await req.json();

        // Check if the client already exists (by email, phone, or cnic)
        const existingClient = await sql`
            SELECT * FROM client WHERE email = ${email} OR phone = ${phone} OR cnic = ${cnic}
        `;

        if (existingClient.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Insert the new client into the database
        await sql`
            INSERT INTO client (firstname, lastname, email, cnic, phone, office_name, office_address, assigned_to)
            VALUES (${firstname}, ${lastname}, ${email}, ${cnic}, ${phone}, ${office_name}, ${office_address}, ${username1})
        `;

        return NextResponse.json({ message: 'User added successfully!' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
