// pages/api/protectedData.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import { getConnection } from '@/dbConfig/dbConfig';
import { connect, getConnection } from "@/dbConfig/dbConfig";
connect()

export async function GET(req, res) {
    const token = req.cookies.get('token')?.value;
    const connection = getConnection();

    // Check for a valid token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user info
        const user:any = jwt.verify(token, process.env.JWT_SECRET);
       
        let query, params;

        // If admin, fetch all data; otherwise, fetch user-specific data
        if (user.isAdmin) {
            query = "SELECT * FROM users"; // Fetch all data for admin
            params = [];
        } else {
            const username = user.username; // Get the username from token
            query = "SELECT * FROM users WHERE assigned_to = ?"; // Fetch data based on assigned_to
            params = [username];
        }

        const [rows] = await connection.promise().query(query, params);
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
