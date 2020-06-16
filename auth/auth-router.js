const bcryptjs = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model.js');
const usersModel = require("../users/users-model.js");

router.post('/register', (req, res) => {
	const { username, password } = req.body;

	const rounds = process.env.HASH_ROUNDS || 9;
	const hash = bcryptjs.hashSync(password, rounds);

	Users.add({ username, password: hash })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => res.send(err));
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([ user ]) => {
			if (user && bcryptjs.compareSync(password, user.password)) {
				req.session.user = { id: user.id, username: user.username };

				res.status(200).json({ welcome: 'all onboard', session: req.session });
			} else {
				res.status(401).json({ message: 'invalid information' });
			}
		})
		.catch((err) => {
			console.log('error on login', err);
			res.status(500).send(err);
		});
});

router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((error) => {
			if (error) {
				res.status(500).json({ message: 'could not logout' });
			} else {
				res.status(204).end();
			}
		});
	} else {
		res.status(204).end();
	}
});

module.exports = router;
