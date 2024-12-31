// pages/api/users/[id].js
import { NextResponse } from 'next/server';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // PostgreSQL connection
connect()
const sql = getConnection(); // PostgreSQL connection

export async function PUT(req) {
    // Get the userId from the request URL
    const { id } = req.query; // Extract user ID from the URL parameters

    if (!id) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    try {
        // Update the user's status to 'N' in the database (soft delete)
        const result = await sql`
            UPDATE users
            SET status = 'N'
            WHERE id = ${id}
            RETURNING *;  // Optionally return updated user data
        `;

        // Check if any rows were affected
        if (result.length === 0) {
            return NextResponse.json({ error: 'User not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error updating user status:", error);
        return NextResponse.json({ error: 'Failed to update user delete.' }, { status: 500 });
    }
}
