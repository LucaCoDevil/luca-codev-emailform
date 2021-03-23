const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const {
    response
} = require('express');

const PORT = process.env.PORT || 5000;


const app = express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static('public'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/src/signup.html")
})

app.post("/", function (req, res) {
    const fName = req.body.inputFName;
    const lName = req.body.inputLName;
    const email = req.body.inputEmail;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.MAILCHIMP_URI;
    const options = {
        method: "POST",
        auth: process.env.AUTH
    }


    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/src/success.html");
        } else {
            res.sendFile(__dirname + "/src/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})


app.listen(PORT, function () {
    console.log(`server running on port ${PORT}`);
})

