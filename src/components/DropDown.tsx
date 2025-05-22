import React from "react";
import {Adapt, Button, H4, H5, Select, Sheet, XStack, YStack} from "tamagui";
import {Check, ChevronDown, Plus} from "../icons";
import {QuestionMark} from "../icons/QuestionMark";
import {useTheme} from "@react-navigation/native";

export interface DropDownProps {
  buttonText: string | React.ReactNode,
  children: React.ReactNode
}

export const DropDown = ({items, placeholder, val, setVal, keyName = 'name', emptyItemOnPress, ...rest}) => {
  const {colors} = useTheme();
  return (
    <Select
      value={val}
      onValueChange={setVal}
      disablePreventBodyScroll
      size="$5"
      {...rest}
    >
      <Select.Trigger size="$5" iconAfter={() => <ChevronDown color={colors.text} width={32}/>} marginVertical="$2">
        <Select.Value placeholder={placeholder}/>
      </Select.Trigger>

      <Adapt platform="touch">
        <Sheet
          native={false}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents/>
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{opacity: 0}}
            exitStyle={{opacity: 0}}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >


        </Select.ScrollUpButton>

        <Select.Viewport
          minWidth={200}
        >
          <Select.Group>
            <Select.Label backgroundColor={colors.border}>
              <XStack justifyContent="space-between" flex={1} alignItems="center">
                <H5>
                  {placeholder}
                </H5>
                {/*<QuestionMark/>*/}
              </XStack>
            </Select.Label>
            {React.useMemo(
              () =>
                Array.isArray(items) && items.length > 0 ? items?.map((item, i) => {

                  return (
                    <Select.Item
                      index={i}
                      key={typeof item == 'object' ? item[keyName] : item}
                      value={item}

                    >
                      <Select.ItemText size="$6">{typeof item == 'object' ? item[keyName] : item}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check color={colors.text} height={32} width={32}/>
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }) : <YStack justifyContent="center" alignItems="center">
                  <H5>No Categories found! </H5>
                  <Button
                    themeInverse
                    size="$4"
                    marginVertical="$2"
                    onPress={emptyItemOnPress}
                  >
                    Add New Category
                  </Button>
                </YStack>,
              [items, val]
            )}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown color="purple"/>
          </YStack>

        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}

