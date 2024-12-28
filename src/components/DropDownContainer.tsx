import React, {Fragment} from "react";
import {H4, Separator, YStack} from "tamagui";
import {TransactionTypeSelector} from "./TransactionType";

export const DropDownContainer = ({categories, type}) => {
  return (
    <>
      {
        type == 'category' ? <TransactionTypeSelector /> : (    <YStack justifyContent="flex-start" flex={1} padding="$4">
          {Array.isArray(categories) && categories.map((category) => (
            <Fragment key={category.name}>
              <H4 style={{paddingVertical: 8}}>
                {category.name}
              </H4>
              <Separator/>
            </Fragment>
          ))}
        </YStack>)
      }
    </>
  );
}