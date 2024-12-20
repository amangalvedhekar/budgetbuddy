# BudgetBuddy
 Mobile app to create and manage budget
 
## Technology Used
- Expo
- AWS Cognito
- Jest
- React Native Testing Library
- AWS CDK
- Typescript
- EAS

```typescript
const transaction = {
  description: string,
  amount: number,
  createdDate: Date,
  modifiedDate: Date,
  id: Id,
  addedBy: userId,
  categoryType: CategoryType,
  transactionType: TransactionType
};
```