import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JoinRoomDto, RoomData } from './session.dto';
import {
  REQ_EVENTS,
  REST_TIME,
  RES_EVENTS,
  RoomInfo,
  WORK_TIME,
  Message,
  JoinRoomResponse,
} from 'models';
import { SessionService } from './session.service';

@WebSocketGateway({ namespace: '/session', cors: true, transports: ['websocket'] })
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private logger: Logger = new Logger('SessionGateway');

  afterInit(server: any) {
    this.wss = server;
  }
  @WebSocketServer() wss: Server;

  /**
   * @TODO remove this
   */
  private rooms: Map<string, RoomData> = new Map();

  constructor(private readonly sessionService: SessionService) {}

  handleConnection(client: Socket, ...args: any[]) {
    const socketId = client.id;
    this.logger.log(`Connection... socket id: ${socketId}`);
    this.sessionService.connect(socketId);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const socketId = socket.id;
    this.logger.debug(`Disconnection... socket id: ${socketId}`);
    const roomId = await this.sessionService.disconnect(socketId);
    if (roomId) {
      socket.leave(roomId);
      this.wss.to(roomId).emit(RES_EVENTS.QUITED, { id: socketId });
    }
  }

  @SubscribeMessage(REQ_EVENTS.GET_ROOM_INFO)
  async getRoomInfo(client: Socket, roomId: string): Promise<WsResponse<RoomInfo>> {
    const socketId = client.id;
    this.logger.log(`Get room info... room id: ${roomId} socket id: ${socketId}`);

    try {
      const room = await this.sessionService.getRoomInfo(socketId, roomId);
      return {
        event: RES_EVENTS.ROOM_INFO,
        data: room,
      };
    } catch (e) {
      this.logger.log(`Get room info error... ${e.message}`);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage(REQ_EVENTS.JOIN_ROOM)
  async joinRoom(client: Socket, joinRoomDto: JoinRoomDto): Promise<WsResponse<JoinRoomResponse>> {
    const socketId = client.id;
    this.logger.log(`Join room... socketId: ${socketId}`);

    const { roomId, participant } = await this.sessionService.joinRoom(socketId, joinRoomDto);

    this.wss.to(roomId).emit(RES_EVENTS.PARTICIPATED, { participant });
    client.join(roomId);

    return {
      event: RES_EVENTS.JOINED,
      data: { roomId },
    };
  }

  @SubscribeMessage(REQ_EVENTS.QUIT)
  async quit(client: Socket, roomId: string): Promise<void> {
    const socketId = client.id;
    this.logger.debug(`Quit room... room id: ${roomId} socket id: ${socketId}`);

    await this.sessionService.quitRoom(socketId, roomId);

    client.leave(roomId);
    this.wss.to(roomId).emit(RES_EVENTS.QUITED, { id: socketId });
  }

  @SubscribeMessage(REQ_EVENTS.SEND_MESSAGE)
  async sendMessage(client: Socket, message: string): Promise<void> {
    this.logger.debug(`Send message... message: ${message}`);
    const roomId = await this.sessionService.getRoomId(client.id);
    if (roomId) {
      this.wss.to(roomId).emit(RES_EVENTS.MESSAGE, {
        message,
        participantId: client.id,
      } as Message);
    }
  }

  /**
   * @TODO remove this
   */
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

  /**
   * @TODO remove this
   */
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
