import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Import routes
import dashboardRoutes from "./routes/dashboard.js";
import reservationListRoutes from "./routes/reservationList.js";
import roomRackRoutes from "./routes/roomRack.js";
import customerRoutes from "./routes/customer.js";
import analyticsRoutes from "./routes/analytics.js";
import inventoryRoutes from "./routes/inventory.js";
import chatRoutes from "./routes/chat.js";
import settingsRoutes from "./routes/settings.js";

// Load environment variables
dotenv.config();

// Set up Express app
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Set up routes
app.use('/dashboard', dashboardRoutes);
app.use('/reservation-list', reservationListRoutes);
app.use('/room-rack', roomRackRoutes);
app.use('/customer', customerRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/chat', chatRoutes);
app.use('/settings', settingsRoutes);

// Set up MongoDB database connection and start server
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    // AffiliateStat.insertMany(dataAffiliateStat);
    // OverallStat.insertMany(dataOverallStat);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));