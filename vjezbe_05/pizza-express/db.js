import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

let mongoURI = process.env.MONGO_URI;
let db_name = process.env.MONGO_DB_NAME;

async function connectToDatabase() {
  try {
    if (!mongoURI || !db_name) {
      throw new Error("Ne postoji mongoURI ili db_name u .env datoteki.");
    }
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log("Uspješno spajanje na bazu podataka");

    return client.db(db_name);
  } catch (error) {
    console.error("Greška prilikom spajanja na bazu podataka", error);
    throw error;
  }
}
export { connectToDatabase };
