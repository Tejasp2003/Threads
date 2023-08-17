import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDB = async ()=>{
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URL){
        return console.error('MONGODB_URL not found in .env file');
    }
    if(isConnected){
        return console.log('Already connected to database');
    }
    try {

        mongoose.connect(process.env.MONGODB_URL)
        isConnected= true;
        console.log('Connected to database');
        
    } catch (error) {
        console.error(error);
    }
}
