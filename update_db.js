const db = require('./backend/config/db');

const updateSchema = async () => {
    try {
        console.log('Checking reservationttbl schema...');
        
        const [rows] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'reservationttbl' AND COLUMN_NAME = 'name'
        `);

        if (rows.length === 0) {
            await db.query(`ALTER TABLE reservationttbl ADD COLUMN name VARCHAR(100) NOT NULL AFTER id`);
            console.log('Column "name" added.');
        } else {
            console.log('Column "name" already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
};

updateSchema();
