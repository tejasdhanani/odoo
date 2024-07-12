export default function RoomCard({ roomId, tags, status, capacity }) {



    return (
        <div className="roomCard">
            <div>
                <div className="roomCard_firstRow">
                    <h3 className="room-title">Room{roomId}</h3>
                    <span className="room-tags">
                        {tags.map((tag, index) => (
                            <span className="room-tag" key={index}>{tag} x</span>
                        ))}
                    </span>
                </div>
                <div className="roomCard_secondRow">
                    <span className="room-status">{status}</span>
                    <span className="room-capacity">{capacity} seat capacity</span>
                </div>
            </div>
        </div>
    )
}

