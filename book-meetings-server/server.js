const express = require('express');
const fs = require('fs');
const port = 5000;

const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors());
app.use(express.json())

const bookingFilePath = path.join(__dirname, 'bookings.json');

const readDataFromDB = () => {
    const data = fs.readFileSync(bookingFilePath);
    return JSON.parse(data);
}

const writeDataToDB = (data) => {
    fs.writeFileSync(bookingFilePath, JSON.stringify(data, null, 2));
};

app.get('/rooms', (req, res) => {
    const data = readDataFromDB();

    res.json(data);
})

app.post('/book', (req, res) => {
    console.log("got req from client")
    const { roomId, date, time } = req.body;

    console.log(req.body);
    const data = readDataFromDB();

    const room = data.rooms.find(room => room.roomId === roomId);
    let booking = room.bookings.find(booking => booking.date === date);
    console.log(booking);

    if (booking) {
        // Append the time to existing times array
        booking.times.push(time);
    } else {
        // Create a new booking entry for the date
        booking = {
            date,
            times: [time]
        };
        room.bookings.push(booking);
    }

    // if (booking) {
    //     // Append the time to existing bookings
    //     if (booking.times.includes(time)) {
    //         return res.status(400).json({ message: 'Time slot already booked' });
    //     }
    //     booking.times.push(time);
    // } else {
    //     // Create a new booking entry for the date
    //     room.bookings.push({
    //         date,
    //         times: [time]
    //     });
    // }

    // if (!booking) {
    //     booking = { date, times: [] };
    //     room.bookings.push(booking);
    // }



    writeDataToDB(data);

    res.json({
        message: "Room booked sdfsdf!"
    })
})

app.listen(port, () => {
    console.log('Server is running: ' + port);
})