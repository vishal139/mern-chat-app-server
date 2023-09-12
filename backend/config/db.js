import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectToTB = async () => {
  try {
    const connect = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true, // Optional: Enables the use of the `createIndex` function to create indexes
    //   useFindAndModify: false, // Optional: Disables the use of `findOneAndUpdate()` and `findOneAndDelete()` to use `updateOne()` and `deleteOne()`
    });

    console.log('Mongo DB connected successfully....')
  } catch (err) {
    console.log('Error in connecting DB')
    console.log(err);
  }
};

export default connectToTB;
