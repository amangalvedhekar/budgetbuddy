import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {and, eq,} from "drizzle-orm";
import {useAuth, useDb} from "../../hooks";
import {Button, Card, H3, H5, Input, ScrollView, useWindowDimensions, XStack} from "tamagui";
import {KeyboardAvoidingView, KeyboardStickyView} from "react-native-keyboard-controller";
import {calculateTotalInputted} from "../../utils/calculateTotalInputted";

export const EstimatedIncome = () => {
  const {db} = useDb();
  const {setOptions, navigate} = useNavigation();
  const {params} = useRoute();
  const {ab} = useAuth();
  const [incomeStream, setIncomeStream] = useState();
  useFocusEffect(useCallback(() => {
    (
      async () => {
        setOptions({
          headerTitle: `Estimated Income  for ${params?.selectedMonth.month}`
        });
        const abc = await db.select({
          id: BudgetedData.categoryType,
          value: BudgetedData.value,
        }).from(BudgetedData).where(and(
          eq(BudgetedData.userId, ab?.userId ?? ''),
          eq(BudgetedData.month, params?.selectedMonth?.id)
        ));
        const def = await db.select({
          id: CategoriesSchema.id,
          name: CategoriesSchema.categoryName
        }).from(CategoriesSchema).where(eq(CategoriesSchema.transactionType, "0"));
        const dataForIncome = def.map(d => {
          const found = abc.find(b => b.id == d.id)
          if (found) {
            return {...d, value: found.value};
          }
        }).filter(Boolean);
        console.log(dataForIncome, 'hmm')
        if (Array.isArray(dataForIncome) && dataForIncome.length === 0) {
          const freshData = def.map(d => ({
            ...d,
            value: '',
          }));
          setIncomeStream(freshData)
        } else {
          const defd = await Promise.all(dataForIncome.map(async (d) => {
            try {
              const h = await db.select({
                name: CategoriesSchema.categoryName
              }).from(CategoriesSchema).where(eq(CategoriesSchema.id, d.id));
              return {
                ...d,
                name: h[0].name
              };
            } catch (e) {

            }
          }));
          setIncomeStream(defd);
        }
      }

    )();
  }, []));

  const handleChangeText = (a) => (b) => {
    const newData = incomeStream?.map(d => {
      if (d.name == a) {
        return {
          ...d,
          value: b,
        };
      } else {
        return d;
      }
    });
    setIncomeStream(newData);
  }

  const saveEstimatedIncomeData = async () => {
    try {
      const dataToSave = incomeStream?.map(d => (
        {
          categoryType: d.id,
          userId: ab?.userId,
          value: Number(d.value) ?? 0,
          month: params?.selectedMonth?.id
        }
      ));
      console.log(dataToSave, 'is');
      const existingDataForUser = await db
        .select(
          {
            id: BudgetedData.categoryType,
            value: BudgetedData.value,
            userId: BudgetedData.userId,
          }
        )
        .from(BudgetedData)
        .where(
          and(eq(
              BudgetedData.userId,
              ab?.userId ?? ''
            ),
            eq(
              BudgetedData.month,
              params?.selectedMonth?.id
            ),)
        );
      console.log(existingDataForUser, 'existing')
      if(Array.isArray(existingDataForUser) && existingDataForUser.length !== 0) {
        const existingItems = existingDataForUser
          .map(item => {
            const foundItem = dataToSave
              .find(data => data.categoryType == item.id && item.userId == ab?.userId);
            if(foundItem)
              return foundItem;
          }).filter(Boolean);
        console.log(existingItems, 'existin')
        if(Array.isArray(existingItems) && existingItems.length > 0) {
          await Promise.all(existingItems.map(async (item) => {
            console.log(item, 'in iteration item is', ab?.userId,)
            try {
              const x = await db.update(BudgetedData).set({
                value: item.value,
              }).where(and(
                eq(BudgetedData.categoryType, item.categoryType),
                eq(BudgetedData.userId, ab?.userId),
              )).returning();
              console.log(x, 'updated data')
            } catch (e) {

            }
          }))
        } else {
          await db.insert(BudgetedData).values(dataToSave);
        }

      } else {
        await db.insert(BudgetedData).values(dataToSave);
      }
      navigate('accountEntry');
    } catch (e) {
      console.log(JSON.stringify(e), 'error while saving income')
    }
  }

  return (
    <>
    <ScrollView automaticallyAdjustKeyboardInsets>
      <KeyboardAvoidingView behavior="padding">
        {Array.isArray(incomeStream) && incomeStream.map(stream => (
          <Card key={stream.id} elevate margin="$2" size="$2" bordered>
            <Card.Header>
              <XStack alignItems="center">
                <H5 flex={0.7}>
                  {stream.name}
                </H5>
                <Input
                  flex={0.3}
                  size="$5"
                  placeholder="0.00"
                  keyboardType="numeric"
                  returnKeyType="done"
                  value={stream?.value?.toString()}
                  onChangeText={handleChangeText(stream?.name)}
                  borderWidth="$1"
                />
              </XStack>
            </Card.Header>
          </Card>))}
      </KeyboardAvoidingView>
    </ScrollView>
      <KeyboardStickyView  style={{backgroundColor: useTheme().colors.background}}>
        <XStack
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          margin="$2"

        >
          <H5>
            Total Amount:
          </H5>
          <H5 color="green">
            {calculateTotalInputted({inputList: incomeStream, currency: 'en-CA'})}
          </H5>
          <Button elevate size="$4" onPress={saveEstimatedIncomeData}>
            Save
          </Button>
        </XStack>
      </KeyboardStickyView>

    </>
  );
}