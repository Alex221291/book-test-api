import { CompanyEntity } from './companies.entity';
import { CompaniesService } from './companies.service';
import { UserEntity } from '../users/users.entity';
import { CompanyInput } from './companies.input';
import { FileService } from '../file/file.service';
export declare class CompaniesResolver {
    private companiesService;
    private fileService;
    constructor(companiesService: CompaniesService, fileService: FileService);
    getCompany(company: string): Promise<CompanyEntity>;
    getCompanies(user: UserEntity): Promise<CompanyEntity[]>;
    addCompany(user: UserEntity, payload: CompanyInput): Promise<CompanyEntity>;
    updateCompany(user: UserEntity, id: string, entity: CompanyInput): Promise<CompanyEntity>;
    removeCompany(user: UserEntity, hash: string): Promise<CompanyEntity>;
}
