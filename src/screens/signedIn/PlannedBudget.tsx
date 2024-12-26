import {Button, Card, H3, H5, Input, ScrollView, XStack} from "tamagui";
import {useAuth, useDb} from "../../hooks";
import {useFocusEffect, useNavigation, useTheme} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {eq} from "drizzle-orm";
import {KeyboardAvoidingView} from "react-native";
import {KeyboardStickyView} from "react-native-keyboard-controller";

export const PlannedBudget = () => {
  const {db} = useDb();
  const {ab} = useAuth();
  const {navigate} = useNavigation();
  const [abc, setAbc] = useState();
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select({
        id: BudgetedData.categoryType,
        value: BudgetedData.value,
      }).from(BudgetedData).where(eq(BudgetedData.userId, ab?.userId ?? ''));
      if (Array.isArray(abc) && abc.length === 0) {
        const def = await db.select({
          id: CategoriesSchema.id,
          name: CategoriesSchema.categoryName
        }).from(CategoriesSchema).where(eq(CategoriesSchema.transactionType, "1"));
        const freshData = def.map(d => ({
          ...d,
          value: '',
        }));
        console.log(freshData, 'hmm2')
        setAbc(freshData)
      } else {
        const def = await Promise.all(abc.map(async (d) => {
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
        setAbc(def);
      }
    })();
  }, []));
  const offset = {closed: 0, opened: 90};

  const handleChangeText = (a) => (b) => {
    const newData = abc.map(d => {
      if (d.name == a) {
        return {
          ...d,
          value: b
        }
      } else {
        return d;
      }
    });
    setAbc(newData);
  }
  const calculateTotal = () => {
    const total = Array.isArray(abc) ? abc.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };

  const saveBudgetedData = async () => {
    try {
      const dataToSave = abc.map(d => (
        {
          categoryType: d.id,
          userId: ab?.userId,
          value: Number(d.value) ?? 0,
        }
      ));
      // console.log(dataToSave, 'tosave')
      await db.insert(BudgetedData).values(dataToSave);
      navigate('accountEntry');
    } catch (e) {

    }
  }

  return (
    <>
      <H5 textAlign="center" marginVertical="$2">
        Monthly Budgeted Expenses
      </H5>

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
          {abc?.map(a => (
            <Card key={a.name} elevate
                  margin="$2"
                  bordered
                  borderRadius="$9"
                  size="$3"
                  animation="bouncy"
                  scale={0.9}
                  hoverStyle={{scale: 0.975}}
                  pressStyle={{scale: 0.975}}>
              <Card.Header>
                <XStack alignItems="center">
                  <H5 flex={0.7}>
                    {a.name}
                  </H5>
                  <Input
                    flex={0.3}
                    size="$6"
                    placeholder="amount"
                    keyboardType="numeric"
                    returnKeyType="next"
                    value={a?.value?.toString()}
                    onChangeText={handleChangeText(a.name)}
                  />
                </XStack>
              </Card.Header>
            </Card>
          ))}
        </KeyboardAvoidingView>
      </ScrollView>
      <KeyboardStickyView offset={offset} style={{backgroundColor: useTheme().colors.background}}>
        <XStack flexWrap="wrap" alignItems="center" justifyContent="space-between" margin="$2">
          <H5>
            Total Amount:
          </H5>
          <H3>
            {calculateTotal()}
          </H3>
          <Button elevate size="$4" onPress={saveBudgetedData}>
            Save
          </Button>
        </XStack>
      </KeyboardStickyView>
    </>
  );
}