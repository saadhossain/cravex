export class GetOrdersQuery {
  constructor(public readonly userId: string) {}
}

export class GetOrderDetailQuery {
  constructor(
    public readonly userId: string,
    public readonly orderId: string,
  ) {}
}
