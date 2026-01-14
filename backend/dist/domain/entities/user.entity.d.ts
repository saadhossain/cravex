import { Auditable } from '../../shared/domain/auditable.entity';
import { Address } from './address.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';
import { Review } from './review.entity';
export type UserRole = 'superadmin' | 'restaurant' | 'customer';
export declare class User extends Auditable {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarUrl: string;
    role: UserRole;
    isActive: boolean;
    isEmailVerified: boolean;
    refreshToken: string;
    restaurant: Restaurant;
    addresses: Address[];
    orders: Order[];
    reviews: Review[];
    cart: Cart;
}
