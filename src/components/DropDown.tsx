import React from "react";
import {Adapt, Button, H4, H5, Select, Sheet, YStack} from "tamagui";
import {Check, ChevronDown} from "../icons";

export interface DropDownProps {
  buttonText: string | React.ReactNode,
  children: React.ReactNode
}

export const DropDown = ({items, placeholder, val,setVal}) => {
  return (
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll size="$5" >
      <Select.Trigger size="$5" iconAfter={() => <ChevronDown color="purple" width={32}/>} marginVertical="$2">
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
            <Select.Label>
              <H5>
                {placeholder}
              </H5>
            </Select.Label>
            {React.useMemo(
              () =>
                items?.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item}
                    >
                      <Select.ItemText size="$6">{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check color="purple" height={32} width={32}/>
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [items]
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

