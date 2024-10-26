// dbConfig.js
import mysql from 'mysql2';

let connection:any;

export function connect() {
    if (!connection) {
        connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD || '', // Empty if no password
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306, // Default MySQL port
        });

        // Connect to the database
        connection.connect((err:any) => {
            if (err) {
                console.error('MySQL connection error:', err.message);
                process.exit();
            } else {
                console.log('MySQL connected successfully');
            }
        });

        // Handle connection errors after initial connection
        connection.on('error', (err:any) => {
            console.error('MySQL connection error:', err.message);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('MySQL connection lost. Trying to reconnect...');
                connect(); // Reconnect if connection is lost
            } else {
                process.exit();
            }
        });
    }
}

// Export a function to get the current connection
export function getConnection() {
    if (!connection) {
        throw new Error('Database not connected. Call connect() first.');
    }
    return connection;
}
