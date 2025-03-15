import React from 'react';
import {Check, Cross, Warning} from "../../icons";
import {BannerContainer} from "../../components/Banner/Container";
import {ScrollView} from "tamagui";
const data = [
  {
    text: 'Great job on staying within budget for subscriptions 🎉',
    icon: <Check color="green"/>,
    color: 'green'
  },
  {
    text: 'Your income came lower than expected for dividends.',
    icon: <Warning color="#8B8000" />,
    color: '#8B8000'
  },
  {
    text: 'You spent more than budgeted in Doordash/Uber Eats.',
    icon: <Cross color="red" />,
    color: 'red'
  },
]
export const Insight = () => {

  return (
    <ScrollView>
      <BannerContainer
        data={data}
      />
    </ScrollView>
  );
};

