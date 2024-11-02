// pages/api/edit-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connect, getConnection } from "@/dbConfig/dbConfig";
import md5 from "md5"; // Import MD5

connect();

export async function PUT(req, res) {
    const token = req.cookies.get('token')?.value;
    const connection = getConnection();

    // Validate token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user email
        const user:any= jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user?.email;

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
        let { id, username, firstname, lastname, email, phone, address, password } = await req.json();
        console.log("the eidtible data is:",id, username, firstname, lastname, email, phone, address, password)
        // Check if the client exists
        const [existingClient] = await connection.promise().query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!existingClient.length) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Only update fields that are defined and not empty
        const updates = [];
        const values = [];

        if (username) {
            updates.push("username = ?");
            values.push(username);
        }
        if (firstname) {
            updates.push("firstname = ?");
            values.push(firstname);
        }
        if (lastname) {
            updates.push("lastname = ?");
            values.push(lastname);
        }
        if (email) {
            updates.push("email = ?");
            values.push(email);
        }
        if (phone) {
            updates.push("phone = ?");
            values.push(phone);
        }
        if (address) {
            updates.push("address = ?");
            values.push(address);
        }
        if (password) {
            updates.push("password = ?");
            values.push(md5(password));
        }

        // If there are fields to update, execute the query
        if (updates.length > 0) {
            values.push(id);
            await connection.promise().query(
                `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
                values
            );
        }

        return NextResponse.json({ message: 'Client updated successfully!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
