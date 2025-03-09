import {BannerCardProps, BannerListProps} from "./types";
import {BannerCard} from "./Card";

export const BannerList = ({data, style}: BannerListProps) => {
  return (
    <>
      {data.map(
        ({icon, text, color}: BannerCardProps, index) => {
          return (
            <BannerCard
              icon={icon}
              key={text}
              text={text}
              color={color}
              style={[style.box, {
                top: {0: 10, 1: 30, 2: 50}[index],
                left: 0,
              }]}
            />
          )
        }
      )}
    </>
  );
}
