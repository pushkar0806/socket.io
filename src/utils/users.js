const users = [];

/**
 * to track a new user
 */
const addUser = ({ id, username, room }) => {
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	if (!username || !room) {
		return {
			error: 'Username and Room are required'
		};
	}

	// check for the user's existense in the room
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username;
	});

	if (existingUser) {
		return {
			error: 'Username is already taken'
		};
	}

	// Store User
	const user = { id, username, room };
	users.push(user);
	return { user };
};

/**
 * to stop tracking the user when the user leaves the room
 */
const removeUser = (id) => {
	const index = users.findIndex((user) => {
		return user.id === id;
	});

	if (index !== -1) {
		return users.splice(index, 1)[0]; // splice will return an array
	}
};

/**
 * to get the user
 */
const getUser = (id) => {
	return users.find((user) => user.id === id);
};

/**
 * to get all the users in the room
 */
const getUserInRoom = (room) => {
	room = room.trim().toLowerCase();
	return users.filter((user) => user.room === room);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUserInRoom
};
