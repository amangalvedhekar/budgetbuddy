import {Accordion, Button, Checkbox, H3, H5, Label, Paragraph, ScrollView, Square, XStack, YStack} from "tamagui";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {Check, ChevronDown} from "../../icons";
import {useNavigation, useTheme} from "@react-navigation/native";
import {categories} from "../../utils";
import {resetFilters, setSelectedCategory, setSelectedMonth} from "../../features/transactionFilterSlice";

export const Filter = () => {
  const allCategories = useSelector((state: RootState) => state.categories);
  const {selectedCategory, selectedMonth} = useSelector((state: RootState)=> state.transactionFilter);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <>
    <ScrollView contentContainerStyle={{
      paddingBottom: 72,
    }}>
      <ScrollView horizontal>
        {
          Array.isArray(selectedCategory) &&
          selectedCategory.length > 0 ?
            selectedCategory.map((category) => (
              <XStack
                key={category}
                borderWidth={1}
                borderColor={colors.text}
                marginHorizontal="$2"
                marginVertical="$3"
                paddingHorizontal="$3"
                paddingVertical="$1"
                alignItems="center"
                borderRadius="$4"
              >
                <H5>
                  {category}
                </H5>
              </XStack>
            )) :
            <XStack marginHorizontal="$3"
                    marginTop="$4">
              <H5>
                No categories applied
              </H5>
            </XStack>
        }
      </ScrollView>
      <ScrollView horizontal>
        {
          Array.isArray(selectedMonth) &&
          selectedMonth.length > 0 ?
            selectedMonth.map((month) => (
              <XStack
                key={month}
                borderWidth={1}
                borderColor={colors.text}
                marginHorizontal="$2"
                marginVertical="$3"
                paddingHorizontal="$3"
                paddingVertical="$1"
                alignItems="center"
                borderRadius="$4"
              >
                <H5>
                  {month}
                </H5>
              </XStack>
            )) :
            <XStack marginHorizontal="$3"
                    marginTop="$4">
              <H5>
                No month applied
              </H5>
            </XStack>
        }
      </ScrollView>
      <Accordion
        overflow="hidden"
        type="multiple"
        marginHorizontal="$3"
        marginVertical="$4"
      >
        <Accordion.Item value="a1">
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            {({
                open,
              }: {
              open: boolean
            }) => (
              <>
                <Paragraph>
                  Categories
                  - {selectedCategory?.length > 0 ? `${selectedCategory.length} applied` : `${categories.length} available`}
                </Paragraph>
                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown color={colors.text}/>
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator animation="medium">
            <Accordion.Content
              animation="medium"
              exitStyle={{opacity: 0}}
            >
              <ScrollView>
                {allCategories?.map((x) => (
                  <XStack
                    alignItems="center"
                    marginHorizontal="$2"
                    key={x.categoryName}
                    justifyContent="space-between"
                  >
                    <H5 paddingVertical="$2">
                      {x.categoryName}
                    </H5>
                    <Checkbox
                      checked={selectedCategory?.some(cat => cat == x.categoryName)}
                      onCheckedChange={(e: boolean) => {
                        dispatch(setSelectedCategory({isSelected:e, categoryName: x.categoryName}));
                      }}
                      size="$6"
                    >
                      <Checkbox.Indicator>
                        <Check color={colors.text}/>
                      </Checkbox.Indicator>
                    </Checkbox>
                  </XStack>
                ))}
              </ScrollView>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>

        <Accordion.Item value="a2">
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            {({
                open,
              }: {
              open: boolean
            }) => (
              <>
                <Paragraph>
                  Month - {selectedMonth.length > 0 ? `${selectedMonth.length} applied` : `${filterDataForDashboard.length} available`}
                </Paragraph>
                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown color={colors.text}/>
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator animation="medium">
            <Accordion.Content animation="medium" exitStyle={{opacity: 0}}>
              <ScrollView>
                {filterDataForDashboard.map((x) => (
                  <XStack
                    alignItems="center"
                    marginHorizontal="$2"
                    key={x.name}
                    justifyContent="space-between"
                  >
                    <H5 paddingVertical="$2">
                      {x.name}
                    </H5>
                    <Checkbox
                      checked={selectedMonth.some(cat => cat == x.name)}
                      onCheckedChange={(e: boolean) => {
                        dispatch(setSelectedMonth({isSelected:e, name: x.name}))
                      }}
                      size="$6"
                    >
                      <Checkbox.Indicator>
                        <Check color={colors.text}/>
                      </Checkbox.Indicator>
                    </Checkbox>
                  </XStack>
                ))}
              </ScrollView>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      </Accordion>

    </ScrollView>
      <XStack
        justifyContent="space-between"
        marginHorizontal="$5"
        marginVertical="$6"
      >

        <Button
          paddingHorizontal="$6"
          themeInverse
          onPress={() => navigation.goBack()}
        >
          Apply
        </Button>

        <Button
          paddingHorizontal="$6"
          onPress={() =>{
            dispatch(resetFilters())
          }}
        >
          Clear
        </Button>
      </XStack>
    </>
  )
}