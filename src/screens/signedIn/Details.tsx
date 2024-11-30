import {Button, Card, H1, H4, Paragraph, Separator, XStack} from "tamagui";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {useDb} from "../../hooks/useDb";
import {TransactionLists} from "../../../schema";
import {eq} from "drizzle-orm";


export const Details = () => {
  const {setOptions} = useNavigation();
  const {db} = useDb();
  const {params} = useRoute();
  const [transactionDetail, setTransactionDetail] = useState();
  useFocusEffect(useCallback(() => {
    (async () => {
      console.log(params?.entryId, 'hmm')
      const abc = await db.select().from(TransactionLists).where(eq(TransactionLists.id, params?.entryId));
      console.log(abc, 'hmm')
      setTransactionDetail(abc[0]);
      setOptions({headerTitle: abc[0].description})
    })();
  }, [params]));
  return (
    <Card margin="$2"
          padding="$2"
          size="$2"
          bordered
          borderRadius="$8"
          animation="bouncy"
          scale={0.9}
          hoverStyle={{scale: 0.975}}
          pressStyle={{scale: 0.975}}>
      <Card.Header>
        <H1>
          Detailed info
        </H1>
      </Card.Header>
      <Separator/>
      <H4>
        Description - {transactionDetail?.description}
      </H4>
      <H4>
        Amount - {transactionDetail?.amount}
      </H4>
      <H4>
        Date Added - {transactionDetail?.createdDate}
      </H4>
      <Separator/>
      <Card.Footer>
        <XStack flex={1} flexWrap="wrap" justifyContent="space-between" padding="$2">
          <Button size="$6">
            <Paragraph>
              Edit
            </Paragraph>
          </Button>
          <Button size="$6">
            <Paragraph>
              Delete
            </Paragraph>
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
}