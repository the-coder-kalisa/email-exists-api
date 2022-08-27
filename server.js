const http = require("http");
const express = require("express");
const emailExistence = require("email-existence");
const app = express();
const PORT = process.env.PORT || 5000;
var pdfcrowd = require("pdfcrowd");

var client = new pdfcrowd.PdfToHtmlClient(
  "giovanni",
  "049eff6854c12a54a2996a9ea8856d27"
);
const fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(200).send(false);
  }
  if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)) {
    return res.status(200).send(false);
  }
  emailExistence.check(email, (error, response) => {
    if (error) {
      return res.status(200).send(true);
    }
    if (response) {
      return res.status(200).send(true);
    }
    return res.status(200).send(false);
  });
});
app.post("/pdf", (req, res) => {
  let { pdf } = req.body;
  let createRandomname = () => {
    return (
      Math.random().toString(36).substring(7) + pdf.slice(pdf.lastIndexOf("/")-5)
    ).replace("/", "").replace(".pdf", ".html");
  };
  let files = fs.readdirSync("./");
  if (files.includes(createRandomname())) {
    createRandomname();
  } else {
    client.convertUrlToFile(pdf, createRandomname(), function (err, fileName) {
      if (err) return res.status(400).send("something wen wrong", err);
      res.status(200).send(req.hostname + "/" + fileName);
    });
  }
});
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
