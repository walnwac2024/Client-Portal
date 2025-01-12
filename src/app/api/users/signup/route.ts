// import {connect} from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";


// connect()


// export async function POST(request: NextRequest){
//     try {
//         const reqBody = await request.json()
//         const {username, email, password} = reqBody

//         console.log(reqBody);

//         //check if user already exists
//         const user = await User.findOne({email})

//         if(user){
//             return NextResponse.json({error: "User already exists"}, {status: 400})
//         }

//         //hash password
//         const salt = await bcryptjs.genSalt(10)
//         const hashedPassword = await bcryptjs.hash(password, salt)

//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword
//         })

//         const savedUser = await newUser.save()
//         console.log(savedUser);

//         //send verification email

//         // await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

//         return NextResponse.json({
//             message: "User created successfully",
//             success: true,
//             savedUser
//         })
        
        


//     } catch (error: any) {
//         return NextResponse.json({error: error.message}, {status: 500})

//     }
// }
// pages/api/register.js
import { connect, getConnection } from "@/dbConfig/dbConfig"; // Import your existing connect function
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer"; // Uncomment if needed
connect()

const sql = getConnection(); // PostgreSQL connection

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        console.log("Received request body:", reqBody); // Log the request body

        // Check if user already exists (using PostgreSQL)
        const existingUser = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        console.log("Existing users found:", existingUser); // Log existing users

        if (existingUser.length > 0) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password using bcryptjs
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        console.log("Hashed password:", hashedPassword); // Log the hashed password

        // Insert new user into the database (PostgreSQL)
        const result = await sql`
            INSERT INTO users (username, email, password)
            VALUES (${username}, ${email}, ${hashedPassword})
            RETURNING id;  // Return the newly inserted user's ID
        `;
        console.log("Insert result:", result); // Log the result of the insert query

        const newUserId = result[0].id; // Get the new user ID
        console.log("New user created with ID:", newUserId); // Log the new user ID

        // Send verification email (uncomment if needed)
        // await sendEmail({ email, emailType: "VERIFY", userId: newUserId });

        // Respond with success message and new user ID
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            userId: newUserId,
        });

    } catch (error: any) {
        console.error("Error in POST handler:", error); // Log the error message
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
