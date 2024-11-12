const expenseCategories = [
  {
    categoryName: 'Grocery',
    id: '0',
    transactionType: '1',
  },
  {
    categoryName: 'Internet',
    id: '1',
    transactionType: '1',
  },
  {
    categoryName: 'Rent',
    id: '2',
    transactionType: '1',
  },
  {
    categoryName: 'Uber/Lyft',
    id: '3',
    transactionType: '1',
  },
  {
    categoryName: 'DoorDash/Uber Eats',
    id: '4',
    transactionType: '1',
  },
  {
    categoryName: 'Medicines',
    id: '5',
    transactionType: '1',
  },
  {
    categoryName: 'Insurance',
    id: '6',
    transactionType: '1',
  },
  {
    categoryName: 'Subscriptions',
    id: '7',
    transactionType: '1',
  },
  {
    categoryName: 'Other',
    id: '8',
    transactionType: '1',
  }
];

const incomeCategories = [
  {
    categoryName: 'Dividend',
    id: '9',
    transactionType: '0',
  },
  {
    categoryName: 'Distribution',
    id: '10',
    transactionType: '0',
  },
  {
    categoryName: 'Pay Cheque',
    id: '11',
    transactionType: '0',
  },
  {
    categoryName: 'Bonus',
    id: '12',
    transactionType: '0',
  }
];

const categories = [
  ...expenseCategories,
  ...incomeCategories,
];

export {
  categories,
  incomeCategories,
  expenseCategories,
}