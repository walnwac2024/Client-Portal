// app/api/users/AdminAllClients/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection, connect } from "@/dbConfig/dbConfig";
import { cookies } from 'next/headers';

// Make sure to properly type your user interface
interface User {
  email: string;
  isAdmin: boolean;
}

export async function GET() {
  try {
    // Get the cookie using the new cookies() API
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' }, 
        { status: 401 }
      );
    }

    // Connect to database
    await connect();
    const sql = getConnection();

    // Verify token and type-cast the decoded user
    const user:any = jwt.verify(token, process.env.JWT_SECRET as string) as User;

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' }, 
        { status: 401 }
      );
    }

    let query;
    console.log("the user is:",user)
    // Use SQL parameters instead of string interpolation for security
    if (user.isAdmin) {
      // Admin query
      console.log("running admin")
      query = await sql`
        SELECT * FROM client 
        WHERE status = 'Y'
      `;
    } else {
      console.log("running clinet")
      // Regular user query with parameterized query
      query = await sql`
        SELECT * FROM client 
        WHERE assigned_to = ${user.email}  
        AND status = 'Y'
      `;
    }

    // Return the results
    return NextResponse.json(query, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    
    // Determine if it's a JWT error
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      );
    }

    // Handle database errors
    if (error.code) { // SQL errors usually have a code
      return NextResponse.json(
        { error: 'Database error', details: error.code },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}