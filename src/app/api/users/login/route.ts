// import { connect, getConnection } from "@/dbConfig/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import md5 from "md5"; // Import MD5
// import jwt from "jsonwebtoken";

// // Ensure the connection is established
// connect();

// export async function POST(request: NextRequest) {
//     const startTime = Date.now(); // Start time for logging

//     try {
//         const reqBody = await request.json();
//         const { email, password } = reqBody;

//         console.log("Received request body:", reqBody);

//         const connection = getConnection();

//         // Check if user exists
        
//         // Adjust your SQL query to select only the necessary fields
// const [rows] = await connection.promise().query(
//     "SELECT id, username, password, isAdmin FROM users WHERE email = ? AND status='Y'",
//     [email]
// );

//         console.log("the eow is:",rows)
//         if (rows.length === 0) {
//             return NextResponse.json({ error: "User does not exist" }, { status: 400 });
//         }
//         const user = rows[0];
//         console.log("the user is:",user)

//         const hashedIncomingPassword =await md5(password);
// console.log("the hashed paswor is:",hashedIncomingPassword)
//         if (user.password !== hashedIncomingPassword) {
//             return NextResponse.json({ error: "Invalid password" }, { status: 400 });
//         }

//         const tokenData = {
//             id: user.id,
//             username: user.username,
//             email: user.email,
//             isAdmin: user.isAdmin,
//         };

//         const token = jwt.sign(tokenData, process.env.JWT_SECRET || "thisisme", { expiresIn: "1d" });
//         console.log("the token is",token)
//         const response = NextResponse.json({
//             message: "Login successful",
//             success: true,
//         });
//         console.log("the response is:",response)
//         response.cookies.set("token", token, {
//             httpOnly: true,
//             secure: false,
//             path: "/",
//             maxAge: 24 * 60 * 60,
//         });

     

//         return response;

//     } catch (error: any) {
//         console.log("the error is:",error)
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// pages/api/login.js
import { connect, getConnection } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import md5 from "md5"; // Import MD5
import jwt from "jsonwebtoken";

// Ensure the connection is established
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
       
        console.log("Received request body:", reqBody);

        const connection = getConnection();

        // Check if user exists
        const [rows] = await connection.promise().query("SELECT * FROM users WHERE email = ? AND status='Y'", [email]);
        if (rows.length === 0) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        const user = rows[0];

        // Hash the incoming password with MD5 and compare with stored password
        const hashedIncomingPassword = md5(password);
  
        if (user.password !== hashedIncomingPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }
 
        // Create token data
        const tokenData = {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin:user.isAdmin,
        };
        const data = {firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
            isAdmin:user.isAdmin,
        }
    //   console.log("the token data is:",tokenData)
        // Generate JWT token
        const token = jwt.sign(tokenData, process.env.JWT_SECRET! || "thisisme", { expiresIn: "1d" });
        
        // Create and set the token in cookies
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            data,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            path: "/",
           maxAge: 24 * 60 * 60,//process.env.NODE_ENV === "development",
           
        });
       
        // console.log("the response is:",response)
        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}














// import {connect} from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// connect()

// export async function POST(request: NextRequest){
//     try {

//         const reqBody = await request.json()
//         const {email, password} = reqBody;
//         console.log(reqBody);

//         //check if user exists
//         const user = await User.findOne({email})
//         if(!user){
//             return NextResponse.json({error: "User does not exist"}, {status: 400})
//         }
//         console.log("user exists");
        
        
//         //check if password is correct
//         const validPassword = await bcryptjs.compare(password, user.password)
//         if(!validPassword){
//             return NextResponse.json({error: "Invalid password"}, {status: 400})
//         }
//         console.log(user);
        
//         //create token data
//         const tokenData = {
//             id: user._id,
//             username: user.username,
//             email: user.email
//         }
//         //create token
//         const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {expiresIn: "1d"})

//         const response = NextResponse.json({
//             message: "Login successful",
//             success: true,
//         })
//         response.cookies.set("token", token, {
//             httpOnly: true, 
            
//         })
//         return response;

//     } catch (error: any) {
//         return NextResponse.json({error: error.message}, {status: 500})
//     }
// }

// pages/api/login.js
// import { connect, getConnection } from "@/dbConfig/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// // Ensure the connection is established
// connect();

// export async function POST(request: NextRequest) {
//     try {
//         const reqBody = await request.json();
//         const { email, password } = reqBody;

//         console.log("Received request body:", reqBody); // Log the request body

//         const connection = getConnection(); // Get the current database connection

//         // Check if user exists
//         const [rows] = await connection.promise().query("SELECT * FROM users WHERE email = ?", [email]);
//         console.log("User query result:", rows); // Log the user query result

//         if (rows.length === 0) {
//             return NextResponse.json({ error: "User does not exist" }, { status: 400 });
//         }

//         const user = rows[0]; // Get the first user record

//         // Verify the password
//         const validPassword = await bcryptjs.compare(password, user.password);
//         if (!validPassword) {
//             return NextResponse.json({ error: "Invalid password" }, { status: 400 });
//         }

//         // Log user details after successful password check
//         console.log("User found and authenticated:", user);

//         // Create token data
//         const tokenData = {
//             id: user.id,
//             username: user.username,
//             email: user.email,
//         };

//         // Generate JWT token
//         const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });

//         // Create and set the token in cookies
//         const response = NextResponse.json({
//             message: "Login successful",
//             success: true,
//         });
//         response.cookies.set("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "development", // Only send over HTTPS in production
//         });

//         return response;

//     } catch (error: any) {
//         console.error("Error in login handler:", error); // Log the error message
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
