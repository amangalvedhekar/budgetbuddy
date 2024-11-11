import {Button, H4, ScrollView, Separator, YStack} from "tamagui";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {Fragment, useCallback, useEffect, useState} from "react";
import {useDb} from "../../hooks/useDb";
import {Categories as CategoriesSchema} from "../../../schema";

export const Categories = () => {
  const {db} = useDb();
  const {navigate} = useNavigation();
  const {params} = useRoute();
  const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();

  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select({
        name: CategoriesSchema.categoryName,
        transactionType: CategoriesSchema.transactionType,
      }).from(CategoriesSchema);
      if(typeof params?.categoryType == 'string' && params?.categoryType !== '') {
        console.log(typeof params?.categoryType, 'before filter')
        setCategories(abc.filter(a =>a.transactionType == params.categoryType))
      } else {
        setCategories(abc);
      }

    })();
  }, [params?.categoryType]));
  return (
    <ScrollView>
    <YStack justifyContent="flex-start" flex={1} padding="$4">
      {Array.isArray(categories) &&  categories.map((category) => (
        <Fragment key={category.name}>
          <H4 style={{paddingVertical: 8}} onPress={() => navigate('Add', {selectedCategory: category.name})}>
            {category.name}
          </H4>
          <Separator/>
        </Fragment>
      ))}
      <Button marginBottom="$4" onPress={() => navigate('addCategory')}>Add New</Button>
    </YStack>
    </ScrollView>
  );
}