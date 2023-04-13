import sirv from 'sirv';
import express from "express";
import compression from 'compression';
import formidable from "express-formidable";
import { Socket, Server } from 'socket.io';
import * as sapper from '@sapper/server';
import * as http from 'http';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const app = express();

app.use(

	formidable(),
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
);

const server = http.createServer(app);
const io = new Server(server);
io.of('/display').on('connection', (socket: Socket) => {
	console.log(`a user with socketID: ${socket.id} coonnected to the display module`);
	socket.on('timer-start',(data)=>{
		console.log('timer activation here', data);
		socket.broadcast.emit('timer-start', data)

	})
	socket.on('end-timer',(data)=>{
		socket.broadcast.emit('end-timer', data)

	})
	socket.on('show pool', (data) => {
		console.log('recieved show pool event');
		socket.broadcast.emit('active pool', data.pool)
	});
	socket.on('display athlete', (data) => {
		console.log('recieved show pool event');
		socket.broadcast.emit('display athlete', data)
	});
	socket.on('start judge', (data) => {
		socket.broadcast.emit('start judge', data);
	})
	socket.on('judge scores', (data) => {

		socket.broadcast.emit('judge scores', data);
	});
	socket.on('result', (data) => {

		socket.broadcast.emit('result', data);
	});
	socket.on('end of pool', (data) => {

		socket.broadcast.emit('end of pool', data);
	})

});

io.of('/judge').on('connection', (socket: Socket) => {
	console.log(`a user with socketID: ${socket.id} coonnected to the judges module`);

})

server.listen(PORT);
