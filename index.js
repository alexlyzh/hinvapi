const express = require('express');
const app = express();
const fs = require('fs');


app.use(express.json());

app.get('/api/rooms', (req, res) => {
    fs.readFile('data/rooms.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send([]);
            return;
        }

        res.send(data ?? []);
    });
});

app.get('/assets/config', (req, res) => {
    res.send({
        some: 'data',
        to: 'config',
        something: 'important',
    });
});

app.post('/api/rooms', (req, res) => {
    fs.readFile('data/rooms.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send([]);
            return;
        }

        const rooms = JSON.parse(data).map((room) => room);

        const maxRoomNumber = rooms.reduce((maxNumber, { roomNumber }) => {
            if (maxNumber < roomNumber) {
                maxNumber = roomNumber;
            }

            return maxNumber;
        }, 0);

        const updatedRooms = [...rooms, {
            ...req.body,
            roomNumber: (maxRoomNumber + 1),
        }];

        fs.writeFileSync('data/rooms.json', JSON.stringify(updatedRooms, null, 2));
        res.status(201).send(updatedRooms);
    });
});

app.put('/api/rooms/:roomNumber', (req, res) => {
    fs.readFile('data/rooms.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send([]);
            return;
        }

        const rooms = JSON.parse(data).map((room) => room);

        const updatedRooms = rooms.map((room) => {
            if (room.roomNumber === Number(req.params.roomNumber)) {
                return {
                    ...req.body,
                    roomNumber: room.roomNumber,
                };
            }

            return room;
        });

        fs.writeFileSync('data/rooms.json', JSON.stringify(updatedRooms, null, 2));
        res.send(updatedRooms);
    });
});

app.delete(`/api/rooms/:roomNumber`, (req, res) => {
    fs.readFile('data/rooms.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send([]);
            return;
        }

        const rooms = JSON.parse(data).map((room) => room);

        const updatedRooms = rooms.filter((room) => room.roomNumber !== Number(req.params.roomNumber));

        fs.writeFileSync('data/rooms.json', JSON.stringify(updatedRooms, null, 2));
        res.send(updatedRooms);
    });
});

app.listen(3000, () => console.log('Server started...'));
