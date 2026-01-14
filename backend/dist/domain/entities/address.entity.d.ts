import { Auditable } from '../../shared/domain/auditable.entity';
import { User } from './user.entity';
export declare class Address extends Auditable {
    label: string;
    fullAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
    instructions: string;
    isDefault: boolean;
    user: User;
    userId: string;
}
