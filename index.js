import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import veterinarianRoutes from "./routes/veterinarianRoutes.js";
import patientsRoutes from "./routes/patientRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Forbiden by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/veterinarians", veterinarianRoutes);
app.use("/api/patients", patientsRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is working in port ${PORT}`);
});
