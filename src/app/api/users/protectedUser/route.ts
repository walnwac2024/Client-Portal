import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection, connect} from "@/dbConfig/dbConfig"; // PostgreSQL connection
connect()
const sql = getConnection(); // PostgreSQL connection

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    // Check for a valid token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user info
        const user: any = jwt.verify(token, process.env.JWT_SECRET);

        let query, params;

        // If the user is an admin, fetch all data; otherwise, fetch user-specific data
        if (user.isAdmin) {
            query = sql`SELECT * FROM users WHERE status = 'Y'`; // Fetch all data for admin
            params = [];
        } else {
            const username = user.username; // Get the username from the token
            query = sql`SELECT * FROM users WHERE assigned_to = ${username} AND status = 'Y'`; // Fetch data based on assigned_to
            params = [];
        }

        // Execute the query
        const rows = await query;

        return NextResponse.json(rows, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
