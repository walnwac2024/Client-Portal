// app/api/users/sendMessage/route.ts
import twilio from 'twilio';
import { NextResponse } from 'next/server';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
    throw new Error('Missing Twilio credentials in environment variables');
}

const client = twilio(accountSid, authToken);

// export const config = {
//     runtime: 'nodejs',
// };

export async function POST(req: Request) {
    try {
        // Parse the request body
        const body = await req.json();
        const { to, variables, mediaUrl } = body;

        console.log('Received request:', { to, variables, mediaUrl });

        if (!to) {
            return NextResponse.json(
                { error: 'Missing required field: "to"' },
                { status: 400 }
            );
        }

        // Convert variables to a string if it's an object
        let messageBody = '';
        if (typeof variables === 'object') {
            messageBody = JSON.stringify(variables);
        } else if (typeof variables === 'string') {
            messageBody = variables;
        } else {
            messageBody = 'Hello!'; // Default message if no variables provided
        }

        // Build the message options
        const messageOptions: any = {
            from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
            to: `whatsapp:${+923032144362}`, // Format the recipient's number
            body: messageBody,
        };

        // Add media URL if provided
        if (mediaUrl) {
            messageOptions.mediaUrl = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
            // messageOptions.mediaUrl="https://tse4.mm.bing.net/th?id=OIP.IbusXw6ZliqWPqRjqA3VKgHaE8&pid=Api&P=0&h=220"
        }

        console.log('Sending message with options:', messageOptions);

        // Send the WhatsApp message using Twilio
        const message = await client.messages.create(messageOptions);

        console.log('Message sent successfully:', message.sid);

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
            sid: message.sid,
        });

    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error);
        
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to send message', 
                details: error.message 
            },
            { status: 500 }
        );
    }
}