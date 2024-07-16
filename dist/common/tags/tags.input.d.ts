import { TagsEntity } from './tags.entity';
declare const TagsInput_base: import("@nestjs/common").Type<Partial<TagsEntity>>;
export declare class TagsInput extends TagsInput_base {
    title: string;
    color: string;
}
export {};
