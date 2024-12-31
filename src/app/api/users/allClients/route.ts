// pages/api/edit-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // PostgreSQL connection
connect()
const sql = getConnection(); // PostgreSQL connection

export async function POST(req) {
    const token = req.cookies?.get('token')?.value;

    // Validate token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token and extract user info
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        // Parse the request data (expecting a POST request)
        const { username } = await req.json();

        // Query to fetch data based on username and active status
        const data = await sql`
            SELECT * FROM client WHERE assigned_to = ${username} AND status = 'Y'
        `;

        console.log("The data is:", username, data);

        // If no data found, return an error
        if (data.length === 0) {
            return NextResponse.json({ error: 'No client data found' }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
