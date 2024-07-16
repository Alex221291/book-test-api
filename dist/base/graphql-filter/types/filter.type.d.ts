declare class Filter {
    comparator: '>' | '<' | '=' | '>=' | '<=' | 'LIKE' | 'IN';
    values: [string];
    field: string;
}
export default Filter;
