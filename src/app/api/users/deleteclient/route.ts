// pages/api/users/[id].js
import { NextResponse } from 'next/server';
import { connect, getConnection } from "@/dbConfig/dbConfig";

connect();

export async function PUT(req) {
    // Get the URL and extract the query parameters
    const url = req.nextUrl;
    const userId = url.searchParams.get('id'); // Extract user ID from the query string
    const connection = getConnection();

    console.log("The user ID from query is:", userId);

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    try {
        // Update the user's status to 'N'
        const [result] = await connection.promise().query(
            "UPDATE users SET status = 'N' WHERE id = ?",
            [userId]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User status updated successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error updating user status:", error);
        return NextResponse.json({ error: 'Failed to update user status.' }, { status: 500 });
    }
}
