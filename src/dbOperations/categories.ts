import {AppDispatch} from "../store";
import {db} from "../hooks";
import {setCategories, Category, addCategories, CategoriesWithTransaction} from "../features/categoriesSlice";
import {Categories, TransactionTypes} from "../../schema";
import {eq} from "drizzle-orm";

export const fetchCategories = async (dispatch: AppDispatch) => {
  try {
    const data = await db
      .select({
        categoryName: Categories.categoryName,
        id: Categories.id,
        transactionType: Categories.transactionType,
        transactionName: TransactionTypes.transactionName
      })
      .from(Categories)
      .leftJoin(TransactionTypes, eq(Categories.transactionType, TransactionTypes.id))
    dispatch(setCategories(data));
  } catch (e) {

  }
}

export const addCategory = async (
  category: Omit<CategoriesWithTransaction, 'id'| 'transactionType'>,
  dispatch: AppDispatch) => {
  try {
    const id = Math.floor(Math.random() * 9999).toString();
    const transactionNameToAdd = await db
      .select({
        transactionName: TransactionTypes.transactionName,
        transactionId: TransactionTypes.id
      })
      .from(TransactionTypes)
      .where(eq(
        category.transactionName,
        TransactionTypes.transactionName,
      ));
    const {transactionName, transactionId} = transactionNameToAdd[0];

    const categoryToAdd = {
      categoryName: category.categoryName,
      transactionType: transactionId,
      id,
    };
    const categoryToDispatch = {
      ...category,
      id,
      transactionName,
      transactionType: transactionId,
    };

    await db.insert(Categories).values(categoryToAdd);
    dispatch(addCategories(categoryToDispatch));
  } catch (e) {
    console.log(JSON.stringify(e), 'error while adding')
  }
}
