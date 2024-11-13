export interface Discount {
    id: number;
    code: string;
    type: string;
    value: number;
    startDate: string;
    endDate: string;
    linkedProducts: string[];
    linkedCategories: string[];
}

export const discounts: Discount[] = [
    {
        id: 1,
        code: 'SUMMER21',
        type: 'percentage',
        value: 20,
        startDate: '2021-06-01',
        endDate: '2021-08-31',
        linkedProducts: ['1', '2'],
        linkedCategories: ['A', 'B'],
    },
    {
        id: 2,
        code: 'WINTER21',
        type: 'fixed',
        value: 50,
        startDate: '2021-12-01',
        endDate: '2022-02-28',
        linkedProducts: ['3'],
        linkedCategories: ['C'],
    },
];