import { CreateOrderDto } from '../dto';

export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateOrderDto,
  ) {}
}

export class UpdateParameters {
  // Placeholder for status updates (e.g. by restaurant)
  status: string;
}

export class UpdateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly userId: string, // actor
    public readonly params: UpdateParameters,
  ) {}
}
