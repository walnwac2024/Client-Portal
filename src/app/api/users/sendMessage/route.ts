// app/api/users/sendMessage/route.ts
import twilio from 'twilio';
import { NextResponse } from 'next/server';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
    throw new Error('Missing Twilio credentials in environment variables');
}

const client = twilio(accountSid, authToken);

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

        // Extract and format the message body
        let messageBody: string = 'Hello!'; // Default message
        if (typeof variables === 'object' && variables.text) {
            messageBody = variables.text; // Use only the 'text' value
        } else if (typeof variables === 'string') {
            messageBody = variables;
        }

        // Build the message options
        const messageOptions: any = {
            from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
            to: `whatsapp:${to}`, // Format the recipient's number
            body: messageBody,
        };

        // Add media URL if provided
        if (mediaUrl) {
            messageOptions.mediaUrl = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
        }

        // console.log('Sending message with options:', messageOptions);

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
                details: error.message,
            },
            { status: 500 }
        );
    }
}
