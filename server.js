const http = require("http");
const express = require("express");
const emailExistence = require("email-existence");
const app = express();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send("enter your email");
  }
  if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)) {
    return res.status(400).send("enter a valid email");
  }
  emailExistence.check(email, (error, response) => {
    if (error) {
      return res.status(400).send(error);
    }
    if (response) {
      return res.status(200).send("Email is available");
    }
    return res.status(400).send("Email not found");
  });
});
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
