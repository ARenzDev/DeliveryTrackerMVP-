import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  deliveryAddress: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    default: { lat: 0, lng: 0 },
  })
  location: { lat: number; lng: number };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
