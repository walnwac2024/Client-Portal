// pages/api/protectedData.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // Use PostgreSQL connection
connect()
const sql = getConnection(); // PostgreSQL connection

export async function GET(req, res) {
    const token = req.cookies.get('token')?.value;

    // Check for a valid token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user info
        const user:any = jwt.verify(token, process.env.JWT_SECRET);

        let query;
        let params = [];

        // If admin, fetch all data; otherwise, fetch user-specific data
        if (user.isAdmin) {
            query = `SELECT * FROM client WHERE status = 'Y'`; // Fetch all data for admin
        } else {
            // You can modify this part to fetch user-specific data if necessary
            query = `SELECT * FROM client WHERE assigned_to = ${user?.email} AND status = 'Y'`;
        }

        // Fetch data from the database
        const rows = await sql`
            ${sql.raw(query)}
        `;

        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
