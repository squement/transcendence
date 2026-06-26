import { useState, useEffect } from 'react'
import { socket } from '../backend_communication/socket'
import { useAuth } from '../AuthContext.jsx'

export function useRoom() {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const { user } = useAuth();

    // écoute des événements socket liés aux rooms
    useEffect(() => {
        if (!socket.connected) socket.connect();

        // recevoir la liste des rooms
        socket.on('list', (msg) => {
            if (msg.type === 'rooms') {
                setRooms(msg.payload.array);
                console.log('got rooms: ', msg.payload.array);
            }
        });

        // recevoir les notifications de room (création, join, leave)
        socket.on('message', (msg) => {
            if (msg.type === 'notification') {
                console.log('room notification:', msg.payload.text);
            }
        });

        // demander la liste des rooms au démarrage
        socket.emit('getRoom');

        return () => {
            socket.off('list');
            socket.off('message');
        };
    }, []);

    const onRefresh = () => {
        console.log('emitting getRoom');
        socket.emit('getRoom');
    };

    const onCreate = () => {
        console.log('emitting createRoom');
        socket.emit('createRoom', { userId: user.id });
        // le roomId sera mis à jour via l'événement message du backend
    };

    const onJoin = (id) => {
        if (!id) return;
        console.log(`emitting joinRoom: ${id}`);
        socket.emit('joinRoom', { userId: user.id, roomId: id });
        setRoomId(id); // on stocke le roomId localement
    };

    const onLeave = () => {
        console.log('emitting leaveRoom');
        socket.emit('leaveRoom', { userId: user.id });
        setRoomId(null); // on remet roomId à null
    };

    return { rooms, roomId, onRefresh, onCreate, onJoin, onLeave };
}