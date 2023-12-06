import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Box,
  useColorModeValue, Text,
} from '@chakra-ui/react';
import { Address } from 'viem';
import { useEvmWalletTokenTransfers } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import {useEffect, useState, useCallback} from 'react';
import { getEllipsisTxt } from 'utils/format';
import { getUserInterfaceAddress } from "utils/contracts";
import { useNetwork } from 'wagmi';
import { readContract } from 'wagmi/actions';
import userInterfaceAbi from "utils/abi/UserInterface.json";
import userCaringInterface from "utils/abi/UserCaringInterface.json";
import {Erc20Transfer} from "@moralisweb3/common-evm-utils";
import ReclaimButton from "../../../elements/ReclaimButton/ReclaimButton";
import {BigNumber} from "@moralisweb3/common-core";

const ERC20Transfers = ({title = "Lost ERC20 tokens"}) => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const { fetch } = useEvmWalletTokenTransfers();
  const [transfers, setTransfers] = useState([] as Array<Erc20Transfer>);
  let userInterfaceAddress: `0x${string}` = "0x0";

  const fetchReclaimable = useCallback(async () => {
    if (!chain) {
      console.warn(`No chain so skip`);
      return;
    }
    userInterfaceAddress = getUserInterfaceAddress(chain?.id as number);
    if (!data || !data.user || !data.user.address) {
      return;
    }
    console.log(`User address: ${userInterfaceAddress}`);
    const response = await fetch({
      address: data?.user?.address,
      chain: chain?.id,
    });
    console.log(`Response from moralis`, response);
    if (!response) {
      return;
    }

    const fetchedTransfers = response.data.flatMap(async (transfer) => {
      let userInterfaceAddr: string;
      try {
        userInterfaceAddr = await readContract({
          address: transfer?.toAddress.checksum as Address,
          abi: userCaringInterface,
          functionName: 'userInterface',
          args: []
        }) as string;

        if (userInterfaceAddr.toLowerCase() !== userInterfaceAddress.toLowerCase()) {
          console.warn(`User Interface ${userInterfaceAddress} didn't match in ${transfer.toAddress.checksum}: ${userInterfaceAddr}`);
          return undefined;
        }
      } catch (e: any) {
        return undefined;
      }

      const recovered = await readContract({
         address: userInterfaceAddress as Address,
         abi: userInterfaceAbi,
         functionName: 'recoveredTokens',
         args: [transfer?.transactionHash.toString(), transfer?.fromAddress.checksum]
      });

      if (recovered) {
        return undefined;
      }

      return transfer;
    });
    const result = await Promise.all(fetchedTransfers);
    const cleaned: Erc20Transfer[] = [];
    for (const tx of result) {
      if (tx !== undefined) {
        cleaned.push(tx);
      }
    }

    setTransfers(cleaned);
  }, [chain, data]);

  useEffect(() => {
    fetchReclaimable();
  }, [fetchReclaimable, chain, data]);

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        {title}
      </Heading>
      {transfers?.length ? (
        <Box border="2px" borderColor={hoverTrColor} borderRadius="xl" padding="24px 18px">
          <TableContainer w={'full'}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Token</Th>
                  <Th>Smartcontract</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Value</Th>
                  <Th>Action</Th>
                  <Th>Fee</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transfers?.map((transfer, key) => {
                  return (
                  <Tr key={key} _hover={{bgColor: hoverTrColor}} >
                    <Td>{getEllipsisTxt(transfer?.address.checksum)}</Td>
                    <Td>{getEllipsisTxt(transfer?.toAddress.checksum)}</Td>
                    <Td>{new Date(transfer.blockTimestamp).toLocaleDateString()}</Td>
                    <Td isNumeric>{transfer.value.toDecimal(18)}</Td>
                    <Td cursor="pointer">
                      <ReclaimButton
                          reclaimType="ERC20"
                          txHash={transfer?.transactionHash}
                          targetContract={transfer?.toAddress.checksum as string}
                          token={transfer?.address.checksum as string}
                          value={(transfer?.value as BigNumber).toDecimal(0)}
                          chainId={chain?.id as number}
                          user={data?.user?.address}
                      />
                    </Td>
                    <Td>
                      <Text fontSize='sm' color={"#718096"}>0.01 ETH</Text>
                    </Td>
                  </Tr>);
                  }
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Looks Like you do not have any ERC20 token to recover</Box>
      )}
    </>
  );
};

export default ERC20Transfers;
