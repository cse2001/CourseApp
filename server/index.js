const express = require('express');
const cors = require('cors');
const adminRouter = require("./routes/admin");
const studentRouter = require("./routes/user");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

app.use("/admin", adminRouter);
app.use("/student", studentRouter);


app.listen(3000, () => console.log('Server running on port 3000'));
