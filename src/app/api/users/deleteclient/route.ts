// pages/api/users/[id].js
import { NextResponse } from 'next/server';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // PostgreSQL connection
connect()
const sql = getConnection(); // PostgreSQL connection

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); 
  console.log("the id with clients:",id)
    if (!id) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    try {
        // Update the user's status to 'N' in the database
        const result = await sql`
            UPDATE client
            SET status = 'N'
            WHERE id = ${id}
            RETURNING *; 
        `;

        // Check if any rows were affected
        if (result.length === 0) {
            return NextResponse.json({ error: 'Client not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Client status updated successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error updating Client status:", error);
        return NextResponse.json({ error: 'Failed to Delete Client .' }, { status: 500 });
    }
}
