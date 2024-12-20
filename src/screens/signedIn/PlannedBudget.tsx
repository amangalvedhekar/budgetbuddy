import {Card, H3, H5, Input, ScrollView, XStack} from "tamagui";
import {useDb} from "../../hooks";
import {useFocusEffect, useTheme} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {Categories as CategoriesSchema} from "../../../schema";
import {eq} from "drizzle-orm";
import {KeyboardAvoidingView} from "react-native";
import {KeyboardStickyView} from "react-native-keyboard-controller";

export const PlannedBudget = () => {
  const {db} = useDb();
  const [abc, setAbc] = useState();
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select({
        name: CategoriesSchema.categoryName,
        transactionType: CategoriesSchema.transactionType,
      }).from(CategoriesSchema).where(eq(CategoriesSchema.transactionType, "1"));
      const def = abc.map(d => ({
        ...d,
        value: '',
      }))
      setAbc(def);
    })();
  }, []));
  const offset = { closed: 0, opened: 90 };

  const handleChangeText = (a) => (b) => {
    const newData = abc.map(d => {
      if(d.name ==a){
        return {
          ...d,
          value:b
        }
      } else {
        return d;
      }
    });
    setAbc(newData);
  }
  const calculateTotal = () => {
    const total = Array.isArray(abc) ? abc.reduce((acc,elm) => acc + Number(elm.value),0) : 0 ;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  }
  return (
    <>
    {/*<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>*/}
      <H5 textAlign="center" marginVertical="$2">
        Monthly Budgeted Data
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
                  value={a.value}
                  onChangeText={handleChangeText(a.name)}
                />
              </XStack>
            </Card.Header>
          </Card>
        ))}
        </KeyboardAvoidingView>
      </ScrollView>
      <KeyboardStickyView offset={offset} style={{backgroundColor: useTheme().colors.background}}>
      <H5 margin="$2" padding="$2">
        Total Amount:
        <H3>
          {calculateTotal()}
        </H3>
      </H5>
      </KeyboardStickyView>
    {/*</KeyboardAvoidingView>*/}

    </>
  );
}