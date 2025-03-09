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
                idx={index}
                text={text}
                key={text}
                color={color}
                style={[style.box, {
                  top: {0: 10, 1: 30, 2: 50, 3: 70, 4: 90, 5: 110}[index],
                  left: 0,
                }]}
              />
          )
        }
      )}
    </>
  );
}
