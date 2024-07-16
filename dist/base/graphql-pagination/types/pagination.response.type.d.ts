import PaginatedResponseInterface from './pagination.response.interface';
import { ClassType } from '../../types/class.type';
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>): ClassType<PaginatedResponseInterface<TItem>>;
