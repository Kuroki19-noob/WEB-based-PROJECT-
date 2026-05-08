const db = require('./backend/config/db');

const createTables = async () => {
    try {
        console.log('Starting database setup...');

        // Create accounttbl
        await db.query(`
            CREATE TABLE IF NOT EXISTS accounttbl (
                accountID INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user'
            )
        `);
        console.log('Table "accounttbl" ensured.');

        // Create reservationttbl
        await db.query(`
            CREATE TABLE IF NOT EXISTS reservationttbl (
                id INT AUTO_INCREMENT PRIMARY KEY,
                DateD DATE NOT NULL,
                TableNum INT NOT NULL,
                email VARCHAR(100) NOT NULL,
                number VARCHAR(20) NOT NULL,
                UNIQUE KEY unique_reservation (DateD, TableNum)
            )
        `);
        console.log('Table "reservationttbl" ensured.');

        console.log('Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
};

createTables();
