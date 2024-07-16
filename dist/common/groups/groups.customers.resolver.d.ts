import { GroupsCustomersEntity } from './groups.customers.entity';
import { UserEntity } from '../users/users.entity';
import { GroupsCustomersService } from './groups.customers.service';
import { CompaniesService } from '../companies/companies.service';
import { GroupsService } from './groups.service';
import { GroupsCustomersInput } from './groups.customers.input';
import { CustomerService } from '../customers/customer.service';
export declare class GroupsCustomersResolver {
    private readonly groupService;
    private readonly companiesService;
    private readonly groupsCustomersService;
    private readonly customerService;
    constructor(groupService: GroupsService, companiesService: CompaniesService, groupsCustomersService: GroupsCustomersService, customerService: CustomerService);
    addCustomerToGroup(user: UserEntity, companyId: string, payload: GroupsCustomersInput): Promise<GroupsCustomersEntity>;
    updateGroupCustomer(user: UserEntity, id: number, companyId: string, payload: GroupsCustomersInput): Promise<GroupsCustomersEntity>;
    removeCustomerFromGroup(user: UserEntity, companyId: string, id: number): Promise<boolean>;
}
