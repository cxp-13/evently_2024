import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI;

// async function connectToDatabase() {
//     try {
//         if (MONGODB_URI === undefined) {
//             console.log('MONGODB_URI is undefined');
//             return
//         }
//         const conn = await mongoose.createConnection(MONGODB_URI).asPromise();
//         let curState = conn.readyState
//         console.log("curDatabaseState", curState);
//     } catch (error: any) {
//         console.error('Error connecting to MongoDB:', error.message);
//     }
// }

let cached = (global as any).mongoose || { conn: null, promise: null };

const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'evently',
        bufferCommands: false,
    })
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase


