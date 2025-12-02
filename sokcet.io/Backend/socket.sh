#!/bin/bash
pnpm i --save @nestjs/websockets @nestjs/platform-socket.io socket.io
nest g module chat
nest g gateway chat --no-spec