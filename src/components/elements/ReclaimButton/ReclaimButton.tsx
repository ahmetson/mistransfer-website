import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { prepareWriteContract, writeContract, waitForTransaction, watchContractEvent } from 'wagmi/actions';
import { Address, getAddress, parseEther } from "viem";
import { getUserInterfaceAddress } from "../../../utils/contracts";
import userInterfaceAbi from "utils/abi/UserInterface.json";

interface ReclaimProps {
    reclaimType: "ERC20" | "NFT",
    txHash: string,
    targetContract: string,
    token: string,
    value: string | number,
    chainId: number,
    user: string,
}

const ReclaimButton = ({
                            reclaimType,
                            txHash,
                            targetContract,
                            token,
                            value,
                            chainId,
                            user,
                       }: ReclaimProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loadingText, setLoadingText] = useState("Confirming");
  const interfaceAddress = getUserInterfaceAddress(chainId);


  const clickReclaim = async function() {
      setSubmitted(true);
      setLoadingText("Signing")

      let txToWait: `0x${string}` = '0x0';

      try {
          const {request} = await prepareWriteContract({
              address: interfaceAddress as Address,
              abi: userInterfaceAbi,
              functionName: reclaimType === "ERC20" ? "recoverMyToken" : "recoverMyNft",
              args: [txHash, getAddress(targetContract), token, value],
              value: parseEther("0.01")
          });

          const {hash} = await writeContract(request);
          txToWait = hash;
      } catch (error) {
          console.error('Failed to writeContract', error);
          setSubmitted(false);
          return;
      }

      setLoadingText("Confirming");

      await waitForTransaction({
          hash: txToWait,
      })

      setLoadingText("Oracle validation");

      const unwatch = watchContractEvent(
          {
              address: interfaceAddress as Address,
              abi: userInterfaceAbi,
              eventName: 'Response',
          },
          (logs) => {
              for (const log of logs) {
                  if (log.address.toLowerCase() !== interfaceAddress.toLowerCase()) {
                      console.log(`Invalid log:`, log);
                      continue;
                  }
                  const topic0 = log.topics[0] as string;
                  const topic1 = log.topics[1] as string;
                  console.log(`Topics`, topic0, topic1);
                  if (topic0.toLowerCase() === user.toLowerCase() || topic1.toLowerCase() === user.toLowerCase()) {
                      setSubmitted(false);
                      console.log("Reclaimed");
                      unwatch();
                      break;
                  }
              }
          },
      )
  }

  return (
      <>
        <Button
            loadingText={loadingText}
            colorScheme='blue'
            variant='solid'
            onClick={() => {clickReclaim()}}
            isLoading={submitted}>
                Reclaim
            </Button>
      </>
  );
};

export default ReclaimButton;
