import {Button, Card, H4, H5, ScrollView, Separator, YStack} from "tamagui";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {Fragment, useCallback, useEffect, useState} from "react";
import {useDb} from "../../hooks/useDb";
import {Categories as CategoriesSchema, TransactionTypes} from "../../../schema";
import {SectionList} from "react-native";

export const Categories = () => {
  const {db} = useDb();
  const {navigate} = useNavigation();
  const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();

  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select({
        name: CategoriesSchema.categoryName,
        transactionType: CategoriesSchema.transactionType,
      }).from(CategoriesSchema);
      console.log(abc, 'abc');
      const def = await db.select().from(TransactionTypes);
      const newData = abc.map(d => ({
        ...d,
        transactionName: def.find(f => f.id == d.transactionType)?.transactionName,
        transactionId: def.find(f => f.id == d.transactionType)?.id,
      }));
      console.log(newData);

      const initialValue = [];
      const sectionalData = newData.reduce((acc, elm) => {

        const isPresent = acc?.find(e => e?.transactionName == elm?.transactionName);

        if (isPresent) {
          // console.log(isPresent, 'is present',)
          const index = acc?.findIndex(e => e?.transactionName == elm?.transactionName);
          const newDatas = {
            transactionName: acc[index].transactionName,
              transactionId: elm?.transactionId,
            data: [...acc[index].data, elm?.name]
          };
          return [...acc?.slice(0, index), newDatas, ...acc?.slice(index + 1)]
        } else {
          // console.log('else', elm)
          const addData = {
            transactionName: elm?.transactionName,
            transactionId: elm?.transactionId,
            data: [elm?.name],
          };
          return acc.concat(addData);
        }
      }, initialValue);
      console.log(sectionalData, 'what is')
      setCategories(sectionalData);
    })();
  }, []));
  return (
    <>
      {/*<YStack justifyContent="flex-start" flex={1} marginHorizontal="$2">*/}
      {/*  {Array.isArray(categories) && categories.map((category) => (*/}
      {/*    <Card*/}
      {/*      key={category.name}*/}
      {/*      elevate*/}
      {/*      size="$2"*/}
      {/*      marginVertical="$2"*/}
      {/*    >*/}
      {/*      <Card.Header>*/}
      {/*        <H5>*/}
      {/*          {category.name}*/}
      {/*        </H5>*/}
      {/*      </Card.Header>*/}
      {/*      <Separator/>*/}
      {/*    </Card>*/}
      {/*  ))}*/}
      {/*  <Button marginBottom="$3" onPress={() => navigate('addCategory')}>Add New</Button>*/}
      {/*</YStack>*/}
      {Array.isArray(categories) && (
        <SectionList sections={categories}
                     renderSectionHeader={({section: {transactionName}}) => (
                       <H5 textAlign="center" marginVertical="$2">{transactionName}</H5>
                     )}
                     renderSectionFooter={({section:{transactionName, transactionId}}) => (
                       <Button
                         elevate
                         size="$4"
                         margin="$2"
                         onPress={() => navigate('addCategory',{
                           name: transactionName, id: transactionId
                         })}
                       >
                         Add New{transactionName}Category
                       </Button>
                     )}
                     renderItem={({item}) => (
                       <Card elevate size="$2" margin="$2">
                         <Card.Header>
                           <H5>
                             {item}
                           </H5>
                         </Card.Header>
                       </Card>
                     )}/>
      )}
    </>
  );
}