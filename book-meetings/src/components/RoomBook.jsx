import { useEffect, useState } from "react"
import { dateOptions, days, timeOptions } from "../constants";

export default function RoomBook({ data }) {

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [roomId, setRoomId] = useState();
    const [error, setError] = useState("");

    const [unavailableTimes, setUnavailableTimes] = useState([]);


    const handleSubmit = async () => {
        console.log(selectedDate);
        console.log(selectedTime);

        if (selectedDate === "") {
            setError("Please select a date!");
        }

        if (selectedTime === "") {
            setError("Please select a time!")
        }

        console.log(unavailableTimes)

        setUnavailableTimes([...unavailableTimes, selectedTime]);

        setSelectedTime("");

        try {
            const response = await fetch('http://localhost:5000/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomId,
                    date: selectedDate,
                    time: selectedTime
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Post request failed")
            } else {
                console.log(data);
            }


        } catch (e) {
            console.error(e.message)
        }
    }




    useEffect(() => {
        if (data !== null) {
            const bookingsOnDate = data.bookings.filter(booking => booking.date === selectedDate);

            setUnavailableTimes(bookingsOnDate[0]?.times || [])
            setRoomId(data.roomId);
        }
    }, [selectedDate, data])

    useEffect(() => {
        console.log(selectedDate);
        console.log(selectedTime);
    }, [selectedDate, selectedTime])



    return (data &&

        <div className="room-book-container">

            <div className="room-book-panel">
                <div className="room-book-panel-left">
                    <h3 className="room-title">Room{data.roomId}</h3>

                    <div className="days-container">
                        {days.map((day, index) => (
                            <button className="day" key={index}>{day}</button>
                        ))}
                    </div>

                    <div className="dateOptions-container">
                        {dateOptions.map((date, index) => (
                            <button className={`date-option ${selectedDate === date && "selected"}`} key={index} onClick={() => setSelectedDate(date)}>{date}</button>
                        ))}
                    </div>
                </div>
                <div className="room-book-panel-right">
                    <div>
                        {data.tags.map((tag, index) => (
                            <span className="room-tag" key={index}>{tag} x</span>
                        ))}
                    </div>
                    <div className="capacity">
                        {data.capacity} seat capacity
                    </div>
                    <button disabled={!selectedDate || !selectedTime} className="btn book" onClick={handleSubmit} >Book</button>
                    {error && <div>{error}</div>}
                </div>
            </div>

            <div className="timeOptions-container">
                {timeOptions.map((time, index) => (
                    <button disabled={(unavailableTimes?.includes(time) || !selectedDate) || time === "10:30 - 11:00" || time === "2:30 - 3:00"} className="time-option" key={index} onClick={() => setSelectedTime(time)}>{time}</button>
                ))}
            </div>
        </div>

    )
}