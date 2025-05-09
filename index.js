// Assuming you have set up Express and MongoDB connections
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");

const GridFSBucket = require("mongodb").GridFSBucket;
const { Readable } = require("stream");

const nodemailer = require("nodemailer");
const uuid = require("uuid").v4;
// const crypto = require('crypto');
// const session = require('express-session')
const cookieParser = require("cookie-parser");
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const Grid = require("gridfs-stream");

let gfs;

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://pandu-caa50-default-rtdb.firebaseio.com/", // Your Firebase Realtime Database URL
});

const conn = mongoose.connection;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

const app = express();
const BookingModel = require("./models/booking");
const UserModel = require("./models/Users");
const VenueModel = require("./models/venues");
const ManagementbookingModel = require("./models/managementbooking");
const FeedbackModel = require("./models/feedback");
const PORT = 3500;

app.use(
  cors({
    origin: ["http://localhost:4173","https://bookiva-frontend.vercel.app"],
    credentials: true,
  })
);

// Middleware to log requests to Firebase RTDB
app.use((req, res, next) => {
  const logRef = firebase.database().ref("logs").push(); // Create a new child node under 'logs'
  logRef
    .set({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    })
    .then(() => {
      console.log("Log saved to Firebase RTDB");
      next();
    })
    .catch((error) => {
      console.error("Error saving log:", error);
      next();
    });
});

// Endpoint to get all logs
app.get("/logs", async (req, res) => {
  try {
    const logsSnapshot = await firebase.database().ref("logs").once("value");
    const logs = logsSnapshot.val();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Error fetching logs");
  }
});
app.use(express.static(path.join(__dirname, "./icon2.png")));
app.use(express.static(path.join(__dirname, "./bookiva3.png")));
app.use(express.static(path.join(__dirname, "./bookiva4.png")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

mongoose
  .connect(
    "mongodb+srv://pandukar98:pandu@cluster0.yt9ia3t.mongodb.net/mern",
     {}
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// module.exports = mongoose.connection;

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    //console.log(isMatch)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
     if (user.blockStatus) {
      return res
        .status(401)
        .json({
          message: "User Blocked By ADMIN",
          role: user.role,
          blockStatus: user.blockStatus,
        });
    }

    const token = generateToken(email);
    console.log(token)

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }); // Cookie expires in 1 hour0
    res.json({
      message: "Login successful",
      role: user.role,
      blockStatus: user.blockStatus,
    });

  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
function generateToken(email) {
  const secretKey = "gowthampraveeninbookivaproject";
  return jwt.sign({ email }, secretKey, { expiresIn: "1h" });
}


app.post("/register", async (req, res) => {
  try {
    // Extract user information from the request body
    const { name, dept, college, email, password } = req.body;
    const user = await UserModel.findOne({ email }); // Adjust timeout value as needed (in milliseconds)

    res.json({ type: typeof college, college: college });
    // const collegeAsString = typeof college === 'string' ? college : JSON.stringify(college);

    if (user) {
      // User already exists in the database
      return res
        .status(400)
        .json({ error: "User already exists,kindly login!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    const newUser = new UserModel({
      name,
      dept,
      college,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "Registration Successful!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/mobileUser", async (req, res) => {
  const { email, name } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      if (user.blockStatus) {
        return res.status(401).json({
          message: "User Blocked By ADMIN",
          role: user.role,
          blockStatus: user.blockStatus,
        });
      }
      //res.status(200).json({ message: "Login successful" });
    }
    else{
      const hashedPassword = await bcrypt.hash("Bookiva@123", 10);
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
  }
    const token = generateToken(email);
    //console.log(token)
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60 * 1000 * 60 * 60 * 24),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }); // Cookie expires in 60 days
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  // console.log("verify",token)

  if (!token) {
     res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.set('Cache-Control', 'no-store');
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "gowthampraveeninbookivaproject", (err, decoded) => {
    if (err) {
       res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.set('Cache-Control', 'no-store');
      return res.status(401).json({ message: "Invalid token" });
    }

    req.email = decoded.email;
    next();
  });
};


app.post("/venues", verifyToken, async (req, res) => {
  const {hallName} =req.body
  try {
    // Query MongoDB for venue data
    if(hallName.length==0){
    const venues = await VenueModel.find();
    res.json(venues);
    }else{
      const venues =await VenueModel.find({hallName})
      res.json(venues);
    }
    // Send the venue data as a response
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/", (req, res) => {
  // req.session.isAuth = true;
  res.status(200).json({ message: "This is Server side" });
});

app.get("/admin", verifyToken, async (req, res) => {
  try {
    // Filter data based on status and sort
    const pendingBookings = await BookingModel.find({
      status: { $in: ["denied_temp", "pending"] },
      dept: { $nin: ["management", "admin"] },
    }).sort({ date: 1, starttime: 1 });
    const acceptedBookings = await BookingModel.find({
      status: "accepted",
      dept: { $nin: ["management", "admin"] },
    }).sort({ date: 1, starttime: 1 });
    const deniedBookings = await BookingModel.find({
      status: "denied",
      dept: { $nin: ["management", "admin"] },
    }).sort({ date: 1, starttime: 1 });
    const cancelledBookings = await BookingModel.find({
      status: "cancelled",
      dept: { $nin: ["management", "admin"] },
    }).sort({ date: 1, starttime: 1 });

    // console.log(pendingBookings)

    // Prepare data object to send to frontend
    const data = {
      pendingBookings,
      acceptedBookings,
      deniedBookings,
      cancelledBookings,
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/modify", verifyToken, async (req, res) => {
  const {
    currentStatus,
    updateStatus,
    email,
    hallName,
    date,
    startTime,
    endTime,
  } = req.body;

  try {
    const booking = await BookingModel.findOne({
      email: email,
      hallname: hallName,
      date: date,
      starttime: startTime,
      endtime: endTime,
      status: currentStatus,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or already processed" });
    }

    // Update the status based on the provided status
    booking.status = updateStatus;
    await booking.save();
    sendEmail(
      booking.name,
      booking.email,
      booking.eventname,
      booking.hallname,
      new Date(booking.date).toLocaleDateString("en-GB"),
      booking,
      booking.status,
      `<p>
        Your booking has been ${booking.status}.
      </p>`
    ).catch((err) => console.log(err));

    // Update other bookings if necessary
    if (currentStatus === "pending" && updateStatus === "denied") {
      // Handle specific case if needed
    } else {
      try {
        const reject = await BookingModel.find({
          date: date,
          hallname: hallName,
          $or: [
            { starttime: { $gte: startTime, $lte: endTime } },
            { endtime: { $gte: startTime, $lte: endTime } },
          ],
          status: updateStatus === "denied" ? "denied_temp" : "pending",
        });

        reject.forEach(async (itr) => {
          try {
            await BookingModel.findByIdAndUpdate(
              itr._id,
              {
                status: updateStatus === "accepted" ? "denied_temp" : "pending",
              },
              { new: true }
            );
          } catch (error) {
            console.error("Error while updating booking status:", error);
          }
        });
      } catch (error) {
        console.error("Error while fetching other bookings:", error);
      }
    }

    res.status(200).json({ message: "Successfully Updated" });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/book", verifyToken, async (req, res) => {
  const email = req.email;
  const User = await UserModel.findOne({ email });
  try {
    const {
      hall,
      start,
      end,
      purpose,
      refreshment,
      seats,
      guest,
      num,
      refreshmentfor,
      refreshmenttype,
      food,
      eventname,
    } = req.body;

    const Hall = await VenueModel.findOne({ hallName: hall });
    const updateBookingDate = await BookingModel.findOne({
      email: email,
      status: "prebooking",
    });
    let st = new Date(updateBookingDate.date);
    //console.log("Original Start Time:", st);
    let sta = new Date(start);
    //console.log(sta)
    const hours = sta.getUTCHours();
    const minutes = sta.getUTCMinutes();
    const seconds = sta.getUTCSeconds();
    st.setUTCHours(hours, minutes, seconds);
    //console.log("Updated Start Time:", st);

    let et = new Date(updateBookingDate.date);
    //console.log("Original End Time:", et);
    let en = new Date(end);
    const ehours = en.getUTCHours();
    const eminutes = en.getUTCMinutes();
    const eseconds = en.getUTCSeconds();
    et.setUTCHours(ehours, eminutes, eseconds);
    // console.log("Updated End Time:", et);

    //console.log("Updated Start and End Time:", st, et);
    //console.log(Hall);
    const updateBooking = await BookingModel.updateOne(
      { email: email, status: "prebooking" },
      {
        name: User.name,
        dept: User.dept,
        college: Hall.campus,
        email: User.email,
        purpose: purpose,
        hallname: hall,
        eventname: eventname,
        //date: new Date (date),
        starttime: st,
        endtime: et,
        chiefguest: guest,
        seating: seats,
        refreshment: refreshment,
        status: "pending",
        mobilenumber: num,
        refreshmentfor: refreshmentfor,
        refreshmenttype: refreshmenttype,
        food: food,
      }
    );
    //await updateBooking.save();
    // const Booking= await BookingModel.findOne({hallname :hall})
    // console.log(Booking.college);
    res.status(200).json({ message: "Bokking was sucessfull" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

let logs = [];

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    // Add log entry to the array
    logs.push(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Endpoint to get logs
app.get('/logs', (req, res) => {
  console.log(logs);
    res.json(logs);
});

app.get("/allUsers", verifyToken, async (req, res) => {
  const allUsers = await UserModel.find({ role: "USER" });

  // console.log(allUsers)

  res.send(allUsers);
});

app.post("/updateUserStatus", verifyToken, async (req, res) => {
  const { blockStatus, updateStatus, email, name, dept, college } = req.body;
  // console.log(blockStatus,email,name,updateStatus)

  try {
    const user = await UserModel.findOne({
      name: name,
      dept: dept,
      college: college,
      email: email,
      blockStatus: blockStatus,
    });

    user.blockStatus = updateStatus;
    await user.save();
    blockEmail(email, user).catch((err) => console.log(err));

    // console.log(user)
    res.status(200).json({ message: "User Status is Successfully Updated" });
  } catch (error) {
    console.log(error);
  }
});

async function blockEmail(email, user) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "pandukar98@gmail.com",
      pass: "vwwgkxkuzrqyysgc",
    },
  });
  const message = user.blockStatus
    ? `<p style="color:red;">You has been BLOCKED by Admin, for more information kindly reach out admin office</p>`
    : `<p style="color:green;">You has been UN-BLOCKED by Admin</p>`;

  let info = await transporter.sendMail({
    from: "pandu",
    to: email,
    subject: `Bookiva`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Card</title>
      
      </head>
      <body>
      
      
      <div class="card">
     
      <img src="cid:bookiva3" alt="bookiva" style="width: 130px" />
       
        <div class="message">
        
          ${message}
        </div>
        
   
      </div>
      
      </body>
      </html>
      
      `,
    attachments: [
  
      {
        filename: "bookiva3.png",
        path: "./bookiva3.png",
        cid: "bookiva3",
      },
    ],
  });

  console.log(`Email sent to ${email}: ${info.messageId}`);
}

app.get("/getmanagementprebook", verifyToken, async (req, res) => {
  const email = req.email;
  const User = await ManagementbookingModel.findOne({
    email: email,
    status: "prebooking",
  });
  //console.log(User);
  if (User) {
    res
      .status(200)
      .json({ HALL: User.hallname, SEATS: User.seating, DATE: User.date });
  } else {
    res.status(401).json({ message: "no prebooking available" });
  }
});

app.get("/management", verifyToken, (req, res) => {
  res.status(200).json({ message: "Management Page is logged In" });
});

app.post("/managementbook", verifyToken, async (req, res) => {
  const email = req.email;
  const User = await UserModel.findOne({ email });
  try {
    const {
      hall,
      start,
      end,
      purpose,
      refreshment,
      seats,
      guest,
      refreshmentfor,
      refreshmenttype,
      food,
      eventname,
    } = req.body;

    const Hall = await VenueModel.findOne({ hallName: hall });
    const updateBookingDate = await ManagementbookingModel.findOne({
      email: email,
      status: "prebooking",
      hallname: hall,
    });
    // console.log(updateBookingDate.date);
    
    let st = new Date(updateBookingDate.date[0]);
    //console.log("Original Start Time:", st);
    let sta = new Date(start);
    //console.log(sta)
    const hours = sta.getUTCHours();
    const minutes = sta.getUTCMinutes();
    const seconds = sta.getUTCSeconds();
    st.setUTCHours(hours, minutes, seconds);
    //console.log("Updated Start Time:", st);

    let et = new Date(
      updateBookingDate.date[updateBookingDate.date.length - 1]
    );
    //console.log("Original End Time:", et);
    let en = new Date(end);
    const ehours = en.getUTCHours();
    const eminutes = en.getUTCMinutes();
    const eseconds = en.getUTCSeconds();
    et.setUTCHours(ehours, eminutes, eseconds);
    const rejectaccepted = await BookingModel.find({
      date: { $in: updateBookingDate.date },
      hallname: hall,
      status: "accepted",
    });
    const rejectpending = await BookingModel.find({
      date: { $in: updateBookingDate.date },
      hallname: hall,
      status: "pending",
    });

    // console.log(reject);
    for (const booking of rejectaccepted) {
      await BookingModel.findByIdAndUpdate(booking._id, {
        status: "denied_temp",
      });
      sendEmail(
        booking.name,
        booking.email,
        booking.eventname,
        booking.hallname,
        booking.date,
        booking,
        `<p>Your booking has been cancelled because of the management had booked the respective venue.</p>`
      ).catch((err) => console.log(err));
    }
    for (const booking of rejectpending) {
      await BookingModel.findByIdAndUpdate(booking._id, {
        status: "denied_temp",
      });
      sendEmail(
        booking.name,
        booking.email,
        booking.eventname,
        booking.hallname,
        booking.date,
        booking,
        `Your booking has been cancelled because of the management had booked the respective venue`
      ).catch((err) => console.log(err));
    }
    const updateBooking = await ManagementbookingModel.updateOne(
      { email: email, status: "prebooking" },
      {
        name: User.name,
        college: Hall.campus,
        email: User.email,
        purpose: purpose,
        hallname: hall,
        eventname: eventname,
        //date: new Date (date),
        starttime: st,
        endtime: et,
        chiefguest: guest,
        seating: seats,
        refreshment: refreshment,
        status: "pending",
        refreshmentfor: refreshmentfor,
        refreshmenttype: refreshmenttype,
        food: food,
      }
    );
    for (const date of updateBookingDate.date) {
      let st = new Date(date);
      let sta = new Date(start);
      const hours = sta.getUTCHours();
      const minutes = sta.getUTCMinutes();
      const seconds = sta.getUTCSeconds();
      st.setUTCHours(hours, minutes, seconds);

      let et = new Date(date);
      let en = new Date(end);
      const ehours = en.getUTCHours();
      const eminutes = en.getUTCMinutes();
      const eseconds = en.getUTCSeconds();
      et.setUTCHours(ehours, eminutes, eseconds);

      // Create new booking entry
      const newBooking = new BookingModel({
        name: User.name,
        dept: "management",
        college: Hall.campus,
        email: User.email,
        purpose: purpose,
        hallname: hall,
        eventname: eventname,
        date: date,
        starttime: st,
        endtime: et,
        chiefguest: guest,
        seating: seats,
        refreshment: refreshment,
        status: "accepted",
        refreshmentfor: refreshmentfor,
        refreshmenttype: refreshmenttype,
        food: food,
      });

      await newBooking.save();
    }
    res.status(200).json({ message: "Bokking was sucessfull" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


async function sendEmail(
  name,
  email,
  eventName,
  hallName,
  date,
  booking,
  status,
  reason
) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "pandukar98@gmail.com",
      pass: "vwwgkxkuzrqyysgc",
    },
  });

  let info = await transporter.sendMail({
    from: "pandu",
    to: email,
    subject: `Booking ${status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Card</title>
      <style>
        /* Inline CSS styles */
        .card {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
          text-align: center;
        }
      
        .card img {
          max-width: 100%;
          height: auto;
          margin-bottom: 20px;
        }
      
        .message {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
      
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .accepted {
          color: green;
        }

        .rejected {
          color: red;
        }
      </style>
      </head>
      <body>
      
      <div class="card">
  
      <img src="cid:bookiva3" alt="bookiva" style="width: 130px" />
       
        <div class="message">
          ${reason}
          <p>Booking Details</p>
        </div>
        <table>
        <tr>
          <th>Name</th>
          <td>${name}</td>
        </tr>
        <tr>
          <th>Event Name</th>
          <td>${eventName}</td>
        </tr>
        <tr>
          <th>Hall Name</th>
          <td>${hallName}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>${date}</td>
        </tr>
        <tr>
          <th>Start Time</th>
          <td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
      (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
      new Date(booking.starttime).getUTCMinutes()
    } ${new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"}</td>
        </tr>
        <tr>
          <th>End Time</th>
          <td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
      (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
      new Date(booking.endtime).getUTCMinutes()
    } ${new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"}</td>
        </tr>
        <tr>
        <th>Status</th>
        <td class="${
          status === "accepted" ? "accepted" : "rejected"
        }" style="font-weight:bold;">${status.toUpperCase()}</td>
      </tr>
      </table>
      <p>Book another slot now.</p>
        <a href="https://example.com/book" class="button">Book</a>
      </div>
      
      </body>
      </html>
      
      `,
    attachments: [
      
      {
        filename: "bookiva3.png",
        path: "./bookiva3.png",
        cid: "bookiva3",
      },
    ],
  });

  console.log(`Email sent to ${email}: ${info.messageId}`); // Print message ID for each email sent
}

app.post("/managementprebook", verifyToken, async (req, res) => {
  const { EMAIL, HALL, SEATS, DATES } = req.body;
  //console.log( EMAIL, HALL, SEATS, DATES);
  let date = DATES.map((dateString) => new Date(dateString));
  date.sort((a, b) => a - b); // Sort the dates in ascending order
  //console.log(date);
  //console.log(date);
  //console.log(DATE,typeof(DATE),new Date(DATE))
  try {
    const User = await ManagementbookingModel.findOne({
      email: EMAIL,
      status: "prebooking",
    });
    if (User) {
      const updateBooking = await ManagementbookingModel.updateOne(
        { email: EMAIL, status: "prebooking" },
        {
          email: EMAIL,
          hallname: HALL,
          date: date,
          seating: SEATS,
        }
      );
    } else {
      const newBooking = new ManagementbookingModel({
        name: 0,
        dept: 0,
        college: 0,
        email: EMAIL,
        purpose: 0,
        hallname: HALL,
        date: date,
        starttime: 0,
        endtime: 0,
        chiefguest: 0,
        seating: SEATS,
        refreshment: 0,
        status: "prebooking",
        mobilenumber: 0,
        refreshmentfor: "-",
        refreshmenttype: "-",
        food: [0],
      });

      await newBooking.save();
    }
    res.status(200).json({ message: "Booking was sucessfull" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/savefeedback", async (req, res) => {
  try {
    const {
      name,
      eventid,
      email,
      date,
      time,
      eventname,
      mobilenumber,
      comments,
      rating,
    } = req.body;
    // console.log(
    //   name,
    //   eventid,
    //   email,
    //   date,
    //   time,
    //   eventname,
    //   mobilenumber,
    //   comments,
    //   rating
    // );
    const check = await FeedbackModel.findOne({ email, eventid });
    if (check) {
      res.status(497).json({ message: "Email Already Exist" });
    } else {
      const newBooking = new FeedbackModel({
        name,
        eventid,
        email,
        date,
        time,
        eventname,
        mobilenumber,
        comments,
        rating,
      });

      await newBooking.save();
      res.status(200).json({ message: "Feedback saved Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/feedbackform", async (req, res) => {
  //const email=req.email;
  const { bookingId } = req.body;
  // console.log(bookingId);
  try {
    const user = await BookingModel.findOne({
      _id: bookingId,
      status: "completed",
    });
    //console.log("user");
    if (!user) {
      return res.status(404).json({ message: "User not completed the event" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addAdmin", verifyToken, async (req, res) => {
  try {
    // Extract user information from the request body
    const { name, email } = req.body;
    // console.log(name,email)

    const user = await UserModel.findOne({ name, email }); // Adjust timeout value as needed (in milliseconds)
    // console.log(user)
    // res.json({"type":typeof college,"college":college})
    // const collegeAsString = typeof college === 'string' ? college : JSON.stringify(college);

    if (user) {
      // User already exists in the database
      return res
        .status(400)
        .json({ error: "Admin already exists,kindly use another Email!" });
    }

    const dept = "-";
    const college = "Sri Sai Ram Engineering College";
    const role = "ADMIN";

    const hashedPassword = await bcrypt.hash("admin@123", 10);
    // Create a new user instance
    const newUser = new UserModel({
      name,
      dept,
      college,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res.status(200).json({ message: "Admin Created Successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/removeAdmin", verifyToken, async (req, res) => {
  try {
    // Extract user information from the request body
    const { email } = req.body;

    // Find the user in the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      // User not found in the database
      return res.status(404).json({ error: "Admin not found" });
    }

    user.role = "USER";
    // Remove the user from the database
    await user.save();

    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/changeToAdmin", verifyToken, async (req, res) => {
  try {
    // Extract user information from the request body
    const { email } = req.body;
    // console.log(email)

    const user = await UserModel.findOne({ email }); // Adjust timeout value as needed (in milliseconds)

    if (!user) {
      // User already exists in the database
      return res
        .status(400)
        .json({ error: "User Does not exists,Cant make him as ADMIN" });
    }

    user.role = "ADMIN";

    // Save the user to the database
    await user.save();

    res.status(200).json({ message: "Admin Created Successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/usercompleteddata", verifyToken, async (req, res) => {
  const email = req.email;
  try {
    const user = await BookingModel.find({ email, status: "completed" }).sort({
      date: -1,
      starttime: -1,
    });
    //console.log("user");
    if (!user) {
      return res.status(404).json({ message: "User not completed the event" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/userdata", verifyToken, async (req, res) => {
  const email = req.email;
  try {
    if (!email) {
      return res.status(404).json({ message: "User not found" });
    }
    const findUser = await UserModel.findOne({ email });
    const completeddata = await BookingModel.find({
      email,
      status: "completed",
    }).sort({ date: -1, starttime: -1 });
    const reservationsdata = await BookingModel.find({
      email,
      status: { $in: ["accepted", "denied", "pending", "denied_temp"] },
    }).sort({ date: -1, starttime: -1 });
    // console.log(completeddata,reservationsdata)
    const user = {
      name: findUser.name,
      email: findUser.email,
      college: findUser.college,
      dept: findUser.dept,
    };
    res.status(200).json({ completeddata, reservationsdata, user });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", async (req, res) => {
  const jwtToken = req.cookies.jwt;
  // console.log(jwtToken);
  try {
    const decoded = jwt.verify(jwtToken, "gowthampraveeninbookivaproject");
    const { email } = decoded;

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile
    res.status(200).json({
      name: user.name,
      email: user.email,
      clg: user.college,
      dept: user.dept,
      role: user.role,
      blockStatus: user.blockStatus,
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/updateprofile", verifyToken, async (req, res) => {
  const email = req.email;
  const { updatedName, updatedCollege, updatedDept } = req.body;
  // console.log(updatedName, updatedCollege, updatedDept, email);
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updateModel = await UserModel.updateOne(
      { email: email },
      {
        name: updatedName,
        dept: updatedDept,
        college: updatedCollege,
      }
    );
    //console.log("user")
    res.status(200).json({ message: "User found" });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/prebook", verifyToken, async (req, res) => {
  const { EMAIL, HALL, SEATS, DATE } = req.body;
  //console.log( EMAIL, HALL, SEATS, DATE);
  //console.log(DATE,typeof(DATE),new Date(DATE))
  try {
    const User = await BookingModel.findOne({
      email: EMAIL,
      status: "prebooking",
    });
    if (User) {
      const updateBooking = await BookingModel.updateOne(
        { email: EMAIL, status: "prebooking" },
        {
          email: EMAIL,
          hallname: HALL,
          date: new Date(DATE),
          seating: SEATS,
        }
      );
    } else {
      const newBooking = new BookingModel({
        name: 0,
        dept: 0,
        college: 0,
        email: EMAIL,
        purpose: 0,
        hallname: HALL,
        date: new Date(DATE),
        starttime: 0,
        endtime: 0,
        chiefguest: 0,
        seating: SEATS,
        refreshment: 0,
        status: "prebooking",
        mobilenumber: 0,
        refreshmentfor: "-",
        refreshmenttype: "-",
        food: [0],
      });

      await newBooking.save();
    }
    res.status(200).json({ message: "Booking was sucessfull" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getprebook", verifyToken, async (req, res) => {
  const email = req.email;
  const User = await BookingModel.findOne({
    email: email,
    status: "prebooking",
  });
  //console.log(User);
  if (User) {
    let Time = await BookingModel.find({
      status: "accepted",
      hallname: User.hallname,
      date: User.date,
    });
    // console.log(Time);
    let pTime = await BookingModel.find({
      status: "pending",
      hallname: User.hallname,
      date: User.date,
    });
    // console.log(pTime);
    pstartTime = [];
    pendTime = [];
    startTime = [];
    endTime = [];
    Time.forEach((element) => {
      startTime.push(element.starttime);
      endTime.push(element.endtime);
    });
    pTime.forEach((element) => {
      pstartTime.push(element.starttime);
      pendTime.push(element.endtime);
    });
    //console.log(startTime,endTime,pstartTime,pendTime);
    res.status(200).json({
      HALL: User.hallname,
      SEATS: User.seating,
      DATE: User.date,
      startTime,
      endTime,
      pstartTime,
      pendTime,
    });
  } else {
    res.status(401).json({ message: "no prebooking available" });
  }
});

app.post("/deleteevent", verifyToken, async (req, res) => {
  //const email=req.email;
  const { bookingId, bookingStatus } = req.body;
  // console.log(bookingId,bookingStatus);
  try {
    const user = await BookingModel.findOne({
      _id: bookingId,
      status: bookingStatus,
    });
    //console.log("user");
    if (!user) {
      return res.status(404).json({ message: "User not completed the event" });
    }
    await BookingModel.deleteOne({ _id: bookingId, status: bookingStatus });
    res.status(200).json("successfully deleted");
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/download/:fileId", verifyToken, (req, res) => {
  const fileId = req.params.fileId;

  try {
    // Convert the fileId string to a MongoDB ObjectId using mongoose.Types.ObjectId
    const objectId = new mongoose.Types.ObjectId(fileId);

    // Find the file in GridFS by fileId
    gfs
      .openDownloadStream(objectId)
      .pipe(res)
      .on("error", (err) => {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.error("Invalid fileId:", error);
    res.status(400).json({ error: "Invalid fileId" });
  }
});

// Route to handle file upload
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { bookingId } = req.body;
    // console.log(bookingId);
    // Find the booking based on the provided details
    const booking = await BookingModel.findOne({ _id: bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create a readable stream from the file buffer
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Create write stream to GridFS
    const writeStream = gfs.openUploadStream(req.file.originalname);

    // Pipe the readable stream to the write stream
    readableStream.pipe(writeStream);

    // When upload is complete, update the booking with file metadata
    writeStream.on("finish", async () => {
      booking.file = {
        filename: req.file.originalname,
        fileId: writeStream.id, // Save the file ID from GridFS
        contentType: req.file.mimetype,
      };
      booking.status = "completed";
      booking.feedback = `https://bookiva-frontend.vercel.app/feedback/index.html?${bookingId}`;
      // Save the updated booking
      await booking.save();

      res.status(200).json({ message: "Booking updated successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/completedform", verifyToken, async (req, res) => {
  //const email=req.email;
  const { bookingId } = req.body;
  //console.log(bookingId);
  try {
    const user = await BookingModel.findOne({
      _id: bookingId,
      status: "accepted",
    });
    //console.log("user");
    if (!user) {
      return res.status(404).json({ message: "User not completed the event" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(
  "/createHall",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const {
        hallName,
        campusName,
        location,
        projectorAvailable,
        acAvailable,
        seatingCapacity,
        currentlyAvailable,
      } = req.body;

      // Find the booking based on the provided details
      // console.log(
      //   hallName,
      //   campusName,
      //   location,
      //   projectorAvailable,
      //   acAvailable,
      //   seatingCapacity,
      //   currentlyAvailable
      // );

      // Create a new venue object
      const campus = campusName;
      const isAvailable = currentlyAvailable;
      const hasAC = acAvailable;

      const venue = new VenueModel({
        hallName,
        campus,
        location,
        projectorAvailable,
        hasAC,
        seatingCapacity,
        isAvailable,
      });

      // Handle multiple files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      let firstImageId; // To store the ID of the first image

      // Iterate through each file
      for (const [index, file] of req.files.entries()) {
        // Create a readable stream from the file buffer
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);

        // Create write stream to GridFS
        const writeStream = gfs.openUploadStream(file.originalname);

        // Pipe the readable stream to the write stream
        readableStream.pipe(writeStream);

        // Wait for upload to finish
        await new Promise((resolve, reject) => {
          writeStream.on("finish", async () => {
            // Update venue with file metadata
            venue.files.push({
              filename: file.originalname,
              fileId: writeStream.id,
              contentType: file.mimetype,
            });
            venue.carouselPics.push(
              `https://bookiva-backend.vercel.app/download/${writeStream.id}`
            );
            if (index === 0) {
              // If it's the first image, store its ID
              firstImageId = writeStream.id;
            }
            resolve();
          });
          writeStream.on("error", reject);
        });
      }

      // Store the URL of the first image in the venue's imgUrl field
      venue.imgUrl = `https://bookiva-backend.vercel.app/download/${firstImageId}`;

      // Save the venue to MongoDB after all files are uploaded
      await venue.save();

      res.status(200).json({ message: "New Hall added successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/reason", verifyToken, async (req, res) => {
  const { bookingId, cancellationReason } = req.body;
  try {
    // Find the booking by ID and update the cancellation reason
    await BookingModel.updateOne(
      { _id: bookingId },
      { reason: cancellationReason, status: "cancelled" }
    );

    res
      .status(200)
      .json({ message: "Reason for cancellation updated successfully" });
  } catch (error) {
    console.error("Error updating reason for cancellation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.set('Cache-Control', 'no-store'); // Prevent caching
  res.json({ message: "Logout successful" });
});


app.get("/summa", (req, res) => {
  res.json({ message: "summa" });
  res.json({ message: "second summa" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
