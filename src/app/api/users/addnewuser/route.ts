// pages/api/add-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connect, getConnection } from "@/dbConfig/dbConfig";


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
        let { firstname, lastname,cnic, email, phone, office_name,office_address } = await req.json();
        
       
        const [existingClient] = await connection.promise().query(
            "SELECT * FROM client WHERE email = ? OR phone = ? OR cnic=?",
            [email, phone, cnic]
        );
        // console.log("the exiting user is:",existingClient)
        if (existingClient.length) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Insert the new client with the username from the token
        await connection.promise().query(
            "INSERT INTO client (firstname, lastname, email, cnic, phone, office_name, office_address, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, cnic, phone, office_name, office_address, username1]
        );

        return NextResponse.json({ message: 'User added successfully!' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
