import "dotenv/config"; // Fast way to import and configure dotenv at once
import app from "./src/app.js";
import connectDatabase from "./src/configs/database.config.js";

const PORT = process.env.PORT || 3000;

connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});