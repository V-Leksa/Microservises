import { Injectable } from "@nestjs/common";
import { AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility, createMongoAbility } from "@casl/ability";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}

export class User {
    id: number;
    role: string;
}

export class Product {
    id: number;
    name: string;
}

export class Report {
    id: number;
    content: string;
}

export class Order {
    id: number;
    userId: number;
    orderDate: Date;
}

export type Subjects = InferSubjects<typeof Product | typeof User | typeof Order | typeof Report> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
    defineAbility(user: User) {
        const { can, cannot, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(createMongoAbility as unknown as AbilityClass<AppAbility>);

        if (user.role === 'admin') {
            can(Action.Manage, 'all');
        } else if (user.role === 'manager') {
            can(Action.Read, Product);
            can(Action.Update, Product);
            can(Action.Read, Report);
            can(Action.Read, Order); 
        } else if (user.role === 'moderator') {
            can(Action.Read, Report);
            can(Action.Update, Report);
        } else if (user.role === 'registered_user') {
            can(Action.Read, Product);
            can(Action.Create, Report);
            can(Action.Read, Report);
            can(Action.Read, Order, { userId: user.id }); 
            can(Action.Create, Order);  
        } else {
            can(Action.Read, Product); 
        }

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}