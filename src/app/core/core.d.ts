declare interface Array<T> {
    firstOrDefault(predicate: (item: T) => boolean): T;
    where(predicate: (item: T) => boolean): T[];
    orderBy(propertyExpression: (item: T) => any): T[];
    orderByDescending(propertyExpression: (item: T) => any): T[];
    orderByMany(propertyExpressions: [(item: T) => any]): T[];
    orderByManyDescending(propertyExpressions: [(item: T) => any]): T[];
    remove(item: T): boolean;
    add(item: T): void;
    addRange(items: T[]): void;
    removeRange(items: T[]): void;
}

declare interface IEntidadDto {
    Id?: number;
    Nombre?: string;
}

declare module fw {

    interface IInitializable {
        init(ngModule: angular.IModule);
    }
    
    interface IConfig extends IInitializable { }

    interface IDirective extends IInitializable { }
    
    interface IComponent extends IInitializable { }

    interface IController extends IInitializable { }

    interface IService extends IInitializable { }
}