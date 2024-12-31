import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getConnection,connect } from "@/dbConfig/dbConfig"; // PostgreSQL connection
connect()
const sql = getConnection(); // PostgreSQL connection

export async function PUT(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    // Validate token 
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 

    try {
        // Verify the token and extract user email
        const user: any = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user?.email;

        // Get username based on the email from the token
        const userRow = await sql`
            SELECT username FROM users WHERE email = ${userEmail}
        `;

        if (userRow.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const username1 = userRow[0].username;

        // Parse the request data
        const { id, firstname, lastname, email, cnic, phone, office_name, office_address } = await req.json();
        console.log("The phone number from the front is:", phone);

        // Check if the client exists
        const existingClient = await sql`
            SELECT * FROM client WHERE id = ${id}
        `;

        if (existingClient.length === 0) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Prepare update fields and values
        const updates = [];
        const values = [];

        if (firstname) {
            updates.push("firstname = ${firstname}");
            values.push(firstname);
        }
        if (lastname) {
            updates.push("lastname = ${lastname}");
            values.push(lastname);
        }
        if (cnic) {
            updates.push("cnic = ${cnic}");
            values.push(cnic);
        }
        if (email) {
            updates.push("email = ${email}");
            values.push(email);
        }
        if (phone) {
            updates.push("phone = ${phone}");
            values.push(phone);
        }
        if (office_address) {
            updates.push("office_address = ${office_address}");
            values.push(office_address);
        }
        if (office_name) {
            updates.push("office_name = ${office_name}");
            values.push(office_name);
        }

        // Execute the update query if any fields are provided
        if (updates.length > 0) {
            await sql`
                UPDATE client
                SET ${sql( updates.join(", "), ...values )}
                WHERE id = ${id}
            `;
        }

        return NextResponse.json({ message: 'Client updated successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating client:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
