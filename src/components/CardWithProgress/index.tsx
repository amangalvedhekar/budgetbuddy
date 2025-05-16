import React from "react";
import {Card, H3, H5, Progress, YStack} from "tamagui";

export type CardWithProgressProps = {
  headingTitle: string;
  actualSpent: number;
  budgetedAmount: number;
}

export const CardWithProgress = (
  {
    headingTitle,
    actualSpent,
    budgetedAmount,
  }: CardWithProgressProps) => {
  const progress = () => {
    if (budgetedAmount <= 0) {
      return 0;
    } else if(actualSpent > budgetedAmount) {
      return 100;
    }else {
      return Math.round((actualSpent/budgetedAmount)*100);
    }
  };

  const progressBackgroundColor = (progress: number) => {
   if (progress <= 50) {
     return "green";
   } else if (progress >= 51 && progress <= 80) {
     return "orange";
   } else {
     return "red";
   }
  };
  return (
    <YStack
      marginHorizontal="$3"
      marginVertical="$2"
    >
      <Card
        elevate
        bordered
        marginVertical="$2"
        padding="$2"
      >
        <H3>
          {headingTitle}
        </H3>
        <Progress
          value={progress()}
          size="$6"
          themeInverse
        >
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={progressBackgroundColor(progress())}
          />
        </Progress>
        <YStack paddingHorizontal="$2">
          <H5>
            {`Spent ${actualSpent} of ${budgetedAmount}. You have ${Math.round(budgetedAmount - actualSpent)} left`}
          </H5>
        </YStack>
      </Card>
    </YStack>
  );
}