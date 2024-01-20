import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectToDatabase() {
    try {
        if(MONGODB_URI === undefined){
            console.log('MONGODB_URI is undefined');
            return
        }
        const conn = await mongoose.createConnection(MONGODB_URI).
            asPromise();
        let curState = conn.readyState
        console.log("curState", curState);

        if (curState === 1) {
            console.log('Have connect to MongoDB');
        } else {
            await mongoose.connect(MONGODB_URI, {
                dbName: 'evently',
                bufferCommands: true,
            });
            console.log('Connected to MongoDB');
        }
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}


