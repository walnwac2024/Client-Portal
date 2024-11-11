// // dbConfig.js
// import mysql from 'mysql2';



// dbConfig.js
import mysql from 'mysql2';

// let connection:any;
// const port:number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306; // Default port if not provided


// export function connect() {
//     if (!connection) {
//         connection = mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD || '', // Empty if no password
//             database: process.env.DB_NAME,
//             port, // Default MySQL port
//         });

//         // Connect to the database
//         connection.connect((err:any) => {
//             if (err) {
//                 console.error('MySQL connection error:', err.message);
//                 process.exit();
//             } else {
//                 console.log('MySQL connected successfully');
//             }
//         });

//         // Handle connection errors after initial connection
//         connection.on('error', (err:any) => {
//             console.error('MySQL connection error:', err.message);
//             if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//                 console.error('MySQL connection lost. Trying to reconnect...');
//                 connect(); // Reconnect if connection is lost
//             } else {
//                 process.exit();
//             }
//         });
//     }
// }

// // Export a function to get the current connection
// export function getConnection() {
//     if (!connection) {
//         throw new Error('Database not connected. Call connect() first.');
//     }
//     return connection;
// }


let connection: any;
const port: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306; // Default port if not provided

export function connect() {
    if (!connection) {
        connection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost', // Replace with your cPanel MySQL host
            user: process.env.DB_USER || 'gcpakiee', // Your cPanel MySQL username
            password: process.env.DB_PASSWORD || 'd42BTzQBIPi8', // Your cPanel MySQL password
            database: process.env.DB_NAME || 'gcpakiee_clientportal', // Your cPanel MySQL database name
            port, // Default MySQL port
            connectTimeout: 10000,
        });

        // Connect to the database
        connection.connect((err: any) => {
            if (err) {
                console.error('MySQL connection error:', err.message);
                process.exit();
            } else {
                console.log('MySQL connected successfully');
            }
        });

        // Handle connection errors after initial connection
        connection.on('error', (err: any) => {
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
