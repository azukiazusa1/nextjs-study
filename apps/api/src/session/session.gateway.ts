import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { nanoid } from 'nanoid';
import { Socket, Server } from 'socket.io';
import { JoinRoomDto, RoomData } from './session.dto';
import {
  MAX_PARTICIPANTS,
  Participant,
  REQ_EVENTS,
  REST_TIME,
  RES_EVENTS,
  RoomInfo,
  WORK_TIME,
  Message,
} from 'models';

@WebSocketGateway({ namespace: '/session', cors: true })
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private static rooms: Map<string, RoomData> = new Map();
  private static participants: Map<string, string> = new Map();
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() wss: Server;

  private rooms: Map<string, RoomData> = new Map();
  private participants: Map<string, string> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    const socketId = client.id;
    this.logger.log(`New connecting... socket id: ${socketId}`);
    this.participants.set(socketId, '');
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;
    this.logger.log(`Disconnection... socket id: ${socketId}`);
    const roomId = this.participants.get(socketId);
    this.participants.delete(socketId);
    const room = this.rooms.get(roomId);
    if (room) {
      socket.leave(roomId);
      room.participants = room.participants.filter((p) => p.id !== socketId);
      if (room.participants.length === 0) {
        clearInterval(room.timer);
        this.rooms.delete(roomId);
      }
      this.wss.to(roomId).emit(RES_EVENTS.QUITED, { id: socketId });
    }
  }

  @SubscribeMessage(REQ_EVENTS.GET_ROOM_INFO)
  getRoomInfo(client: Socket, roomId: string): WsResponse<RoomInfo> {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new NotFoundException(`Room ${roomId} not found`);
    }

    return {
      event: RES_EVENTS.ROOM_INFO,
      data: {
        participants: room.participants,
        isRestTime: room.isRestTime,
      },
    };
  }

  @SubscribeMessage(REQ_EVENTS.JOIN_ROOM)
  joinRoom(
    client: Socket,
    { username, score, avatar }: JoinRoomDto,
  ): WsResponse<{ roomId: string }> {
    this.logger.log(`Join room... username: ${username}`);
    let roomId: string;

    for (const [id, roomData] of this.rooms.entries()) {
      if (roomData.participants.length < MAX_PARTICIPANTS) {
        roomId = id;
        break;
      }
    }

    if (!roomId) {
      roomId = nanoid();
      const timer = this.startTimer(roomId, this.wss);
      this.rooms.set(roomId, new RoomData(username, timer));
    }

    this.participants.set(client.id, roomId);
    const participant: Participant = {
      roomId,
      username,
      avatar,
      score,
      id: client.id,
    };

    this.rooms.get(roomId).participants.push(participant);
    client.join(roomId);

    client.to(roomId).emit(RES_EVENTS.PARTICIPATED, {
      participant,
    });

    return {
      event: RES_EVENTS.JOINED,
      data: { roomId },
    };
  }

  @SubscribeMessage(REQ_EVENTS.QUIT)
  quit(client: Socket, roomId: string): void {
    this.logger.log(`Quit room... room id: ${roomId}`);
    const socketId = client.id;
    this.participants.delete(socketId);
    const room = this.rooms.get(roomId);
    if (room) {
      client.leave(roomId);
      room.participants = room.participants.filter((p) => p.id !== socketId);
      if (room.participants.length === 0) {
        clearInterval(room.timer);
        this.rooms.delete(roomId);
      }
      this.wss.to(roomId).emit(RES_EVENTS.QUITED, { id: socketId });
    }
  }

  @SubscribeMessage(REQ_EVENTS.SEND_MESSAGE)
  sendMessage(client: Socket, message: string): void {
    this.logger.log(`Send message... message: ${message}`);
    const roomId = this.participants.get(client.id);
    if (roomId) {
      this.wss.to(roomId).emit(RES_EVENTS.MESSAGE, {
        message,
        participantId: client.id,
      } as Message);
    }
  }

  private startTimer(roomId: string, wss: Server): NodeJS.Timeout {
    let startTime = Date.now();
    let time = 1 * 10 * 1000;
    let isRestTime = false;
    let remainngPercentage = 100;

    wss.to(roomId).emit(RES_EVENTS.TICK, {
      time,
      remainngPercentage,
    });

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = now - startTime;
      const milliseconds = time - diff;
      remainngPercentage = Math.max(0, Math.min(100, ((time - diff) / time) * 100));
      if (milliseconds <= 0) {
        isRestTime = !isRestTime;
        time = isRestTime ? REST_TIME : WORK_TIME;
        startTime = now;
        this.onComplete(roomId, isRestTime);
      }
      wss.to(roomId).emit(RES_EVENTS.TICK, {
        time: milliseconds,
        remainngPercentage,
      });
    }, 1000);

    return timer;
  }

  private onComplete(roomId: string, isRestTime: boolean): void {
    let score = 0;
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    room.isRestTime = isRestTime;
    if (isRestTime) {
      score = this.rooms.get(roomId).participants.length;
      const updatedParticipants = this.rooms.get(roomId).participants.map((p) => ({
        ...p,
        score: p.score + score,
      }));
      this.rooms.get(roomId).participants = [...updatedParticipants];
    }
    this.wss.to(roomId).emit(RES_EVENTS.COMPLETE, {
      isRestTime,
      score,
    });
  }
}
