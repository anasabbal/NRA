import { ConfigService } from "@nestjs/config";
import { ConnectOptions } from "mongoose";


const config = new ConfigService();


export default {
    uri: "mongodb+srv://user-service:anas13@cluster0.ekc9rnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", // MongoDB connection URI
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
  };