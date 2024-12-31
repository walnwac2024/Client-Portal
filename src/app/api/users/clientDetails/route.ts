import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection, connect } from "@/dbConfig/dbConfig"; // PostgreSQL connection
connect();

export async function GET(req) {
    const token = req.cookies.get('token')?.value;

    // Check for a valid token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user info
        const user: any = jwt.verify(token, process.env.JWT_SECRET);
        const sql = getConnection(); // PostgreSQL connection

        let query;
        const params = [];

        // If admin, fetch all data; otherwise, fetch user-specific data
        if (user.isAdmin) {
            // Use the sql tagged template literal here
            query = sql`SELECT * FROM client WHERE status = 'Y'`; // Fetch all data for admin
        } else {
            const username = user.username; // Get the username from the token
            // Use the sql tagged template literal here as well
            query = sql`SELECT * FROM client WHERE assigned_to = ${username} AND status = 'Y'`; // Fetch data based on assigned_to
        }

        // Execute the query
        const data = await query;

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
