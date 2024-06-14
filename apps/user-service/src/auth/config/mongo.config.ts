import { ConnectOptions } from "mongoose";



const uriDb = 'mongodb+srv://anas:anas@cluster0.uy7csfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


export default {
    uri: uriDb, // mongoDB connection URI
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
};