// pages/api/edit-client.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connect, getConnection } from "@/dbConfig/dbConfig";

connect();

export async function POST(req) {
    const token = req.cookies?.get('token')?.value;
    const connection = getConnection();

    // Validate token
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
       
        

        

        // Parse the request data (expecting a POST request)
        const { username } = await req.json();
        const [data] = await connection.promise().query(
            "SELECT * FROM client WHERE assigned_to = ? AND status = 'Y'",
            [username]
        );

        console.log("The data is:", username, data);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
