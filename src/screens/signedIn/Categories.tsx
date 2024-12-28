import {Button, Card, H4, H5, ScrollView, Separator, YStack} from "tamagui";
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
      if (typeof params?.categoryType == 'string' && params?.categoryType !== '') {
        console.log(typeof params?.categoryType, 'before filter')
        setCategories(abc.filter(a => a.transactionType == params.categoryType))
      } else {
        setCategories(abc);
      }

    })();
  }, [params?.categoryType]));
  return (
    <ScrollView>
      <YStack justifyContent="flex-start" flex={1} marginHorizontal="$2">
        {Array.isArray(categories) && categories.map((category) => (
          <Card key={category.name}
                elevate
                size="$2"
                marginVertical="$2"
          >
            <Card.Header>
              <H5>
                {category.name}
              </H5>
            </Card.Header>
            <Separator/>
          </Card>
        ))}
        <Button marginBottom="$3" onPress={() => navigate('addCategory')}>Add New</Button>
      </YStack>
    </ScrollView>
  );
}