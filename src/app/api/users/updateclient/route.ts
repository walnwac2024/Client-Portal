import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // PostgreSQL connection
import md5 from "md5"; // MD5 hashing
connect()
const sql = getConnection(); // PostgreSQL connection

export async function PUT(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    // Validate token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user email
        const user: any = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user?.email;

        // Get username based on the email from the token
        const userRow = await sql`
            SELECT username FROM users WHERE email = ${userEmail}
        `;

        if (userRow.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const username1 = userRow[0].username;

        // Parse the request data
        const { id, username, firstname, lastname, email, phone, address, password } = await req.json();

        // Check if the client exists
        const existingClient = await sql`
            SELECT * FROM users WHERE id = ${id}
        `;

        if (existingClient.length === 0) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Prepare update fields and values
        const updates = [];
        const values = [];

        if (username) {
            updates.push("username = ${username}");
            values.push(username);
        }
        if (firstname) {
            updates.push("firstname = ${firstname}");
            values.push(firstname);
        }
        if (lastname) {
            updates.push("lastname = ${lastname}");
            values.push(lastname);
        }
        if (email) {
            updates.push("email = ${email}");
            values.push(email);
        }
        if (phone) {
            updates.push("phone = ${phone}");
            values.push(phone);
        }
        if (address) {
            updates.push("address = ${address}");
            values.push(address);
        }
        if (password) {
            updates.push("password = ${password}");
            values.push(md5(password)); // Hash the password
        }

        // Execute the update query if any fields are provided
        if (updates.length > 0) {
            await sql`
                UPDATE users
                SET ${sql( updates.join(", "), ...values )}
                WHERE id = ${id}
            `;
        }

        return NextResponse.json({ message: 'Client updated successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating client:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
