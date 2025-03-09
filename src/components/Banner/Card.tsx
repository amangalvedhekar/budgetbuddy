import {BannerCardProps} from "./types";
import {Card, Paragraph, XStack} from "tamagui";

export const BannerCard = ({icon, text, color, ...rest}: BannerCardProps) => {
  return (
    <Card
      elevate
      borderRadius="$8"
      {...rest}
    >
      <Card.Header>
        <XStack
          justifyContent="space-evenly"
          marginHorizontal="$2"
          alignItems="center"
        >
          <XStack paddingRight="$2">
            {icon}
          </XStack>
          <Paragraph
            size="$6"
            color={color}
            textWrap="wrap"
            flexWrap="wrap"
            paddingRight="$3"
          >
            {text}
          </Paragraph>
        </XStack>
      </Card.Header>
    </Card>
  );
}