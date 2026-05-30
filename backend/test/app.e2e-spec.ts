import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { io, Socket } from 'socket.io-client';

describe('Orders Flow (e2e)', () => {
  let app: INestApplication;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen(3001); // Use a different port for testing

    socket = io('http://localhost:3001', {
      transports: ['websocket'],
      forceNew: true,
    });
  });

  afterAll(async () => {
    socket.disconnect();
    await app.close();
  });

  it('should create an order via REST and receive it via WebSockets', (done) => {
    const orderPayload = {
      customerName: 'Test E2E User',
      deliveryAddress: '123 Test St',
    };

    // 1. Listen for the WebSocket event
    socket.on('orderCreated', (data) => {
      expect(data.customerName).toBe(orderPayload.customerName);
      expect(data.deliveryAddress).toBe(orderPayload.deliveryAddress);
      expect(data.status).toBe('pending');
      expect(data._id).toBeDefined();
      done(); // Complete the test successfully when event is received
    });

    // 2. Trigger the REST API call to create the order
    request(app.getHttpServer())
      .post('/orders')
      .send(orderPayload)
      .expect(201)
      .then((response) => {
        expect(response.body.customerName).toBe(orderPayload.customerName);
      });
  });
});
