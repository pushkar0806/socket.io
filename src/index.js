const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils');
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
	/**
	 * Setting up the listener for JOIN event
	 */
	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room }); //destructuring as we can potentially get either error or user in success

		if (error) {
			return callback(error);
		}
		socket.join(user.room);
		/**
		* All the user gets treated with this initial message
		*/
		socket.emit('message', generateMessage('Chatting Arena', 'Welcome'));

		/**
		* Except new joining user, all other in the chat-room gets notified via broadcast(socket targets the individual connection ) through the 'message' event
		*/
		socket.broadcast
			.to(user.room)
			.emit('message', generateMessage('Chatting Arena', `${user.username} has joined!`));
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUserInRoom(user.room)
		});

		callback();
	});

	/**
     * Recieves the sendMessage event from the client
     */
	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('message', generateMessage(user.username, message));
		callback();
	});

	/**
     * Listening to the 'sendLocation' event from the client and emitting to the others
     */
	socket.on('sendLocation', (cords, callback) => {
		const user = getUser(socket.id);

		io
			.to(user.room)
			.emit(
				'locationMessage',
				generateLocationMessage(user.username, `https://google.com/maps?q=${cords.latitude},${cords.longitude}`)
			);
		callback();
	});

	/**
     * Emitting 'message' event to all users informing the exclusion of a user from the room
     */
	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('message', generateMessage('Chatting Arena', `${user.username} has left the room!`));
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUserInRoom(user.room)
			});
		}
	});
});

server.listen(port, () => {
	console.log(`Server is running at port ${port}!`);
});
