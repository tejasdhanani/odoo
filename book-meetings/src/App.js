import { useEffect, useState } from 'react';
import './App.css';
import RoomBook from './components/RoomBook';
import RoomCard from './components/RoomCard';
import { timeOptions } from './constants';

function App() {
  const [selectedTime, setSelectedTime] = useState('');
  const [data, setData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomData, setSelectedRoomData] = useState(null);

  useEffect(() => {
    if (data != null && selectedRoom != null) {
      setSelectedRoomData(data.find(room => room.roomId === selectedRoom));
    }
  }, [selectedRoom, data])

  const handleOnSubmit = async () => {
    setData(null)
    if (selectedTime === "" || selectedTime === "Select") return;

    try {
      const response = await fetch('http://localhost:5000/rooms', {
        method: 'GET',
      });

      if (!response.ok) {
        console.error("Failed to fetch the data");
      }
      const jsonData = await response.json();
      console.log(jsonData)
      const filteredRooms = jsonData.rooms.filter(room => {
        return !room.bookings.some(booking => booking.times.includes(selectedTime))
      })

      setData(filteredRooms)
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <div className='app'>
      <div className='searchComponent'>
        <div>
          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            <option value="Select">Select</option>
            {timeOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <button className="btn" onClick={handleOnSubmit}>Search</button>
        </div>
      </div>
      <div className='main-panel'>
        <div className='main-panel-container'>
          <div className='left-panel'>
            <div>
              {data && data.map((room, index) => (
                <div key={index} className='roomCard-container' onClick={() => setSelectedRoom(room.roomId)}>
                  <RoomCard roomId={room.roomId} tags={room.tags} status={room.status} capacity={room.capacity} />
                </div>
              ))}
            </div>
          </div>
          <div className='right-panel'>
            {
              selectedRoom && <RoomBook data={selectedRoomData} />
            }

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
