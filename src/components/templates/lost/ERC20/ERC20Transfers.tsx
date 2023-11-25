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
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Address } from 'viem';
import { useEvmWalletTokenTransfers } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import {useEffect, useState, useCallback} from 'react';
import { getEllipsisTxt } from 'utils/format';
import {isCaringContract, getUserInterfaceAddress} from "utils/contracts";
import { useNetwork } from 'wagmi';
import { readContract } from 'wagmi/actions';
import userInterfaceAbi from "utils/abi/UserInterface.json";
import {Erc20Transfer} from "@moralisweb3/common-evm-utils";

const ERC20Transfers = ({title = "Lost ERC20 tokens"}) => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const { fetch } = useEvmWalletTokenTransfers();
  const [transfers, setTransfers] = useState([] as Array<Erc20Transfer>);
  let userInterfaceAddress: string = "";

  const fetchReclaimable = useCallback(async () => {
    if (!data || !data.user || !data.user.address) {
      return;
    }
    const response = await fetch({
      address: data?.user?.address,
      chain: chain?.id,
    });
    if (response == undefined) {
      return;
    }

    let transfers = response.data.flatMap(async (transfer, key): Promise<any> => {
          if (!isCaringContract(chain?.id as number, transfer?.toAddress.checksum)) {
            return;
          }

          const data = await readContract({
            address: userInterfaceAddress as Address,
            abi: userInterfaceAbi,
            functionName: 'recoveredTokens',
            args: [transfer?.transactionHash.toString(), transfer?.fromAddress.checksum]
          });

          if (data) {
            return;
          }

          return transfer;
        }
    );
    let result = await Promise.all(transfers);
    let cleaned: any[] = [];
    for (let tx of result) {
      if (tx !== undefined) {
        cleaned.push(tx);
      }
    }

    setTransfers(cleaned);
  }, [chain, data]);

  useEffect(() => {
    userInterfaceAddress = getUserInterfaceAddress(chain?.id as number);
    fetchReclaimable();
  }, [fetchReclaimable]);

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
                </Tr>
              </Thead>
              <Tbody>
                {transfers?.map((transfer, key) => {
                  if (!isCaringContract(chain?.id as number, transfer?.toAddress.checksum)) {
                    return [];
                  }

                  return (
                  <Tr key={key} _hover={{bgColor: hoverTrColor}} >
                    <Td>{getEllipsisTxt(transfer?.address.checksum)}</Td>
                    <Td>{getEllipsisTxt(transfer?.toAddress.checksum)}</Td>
                    <Td>{new Date(transfer.blockTimestamp).toLocaleDateString()}</Td>
                    <Td isNumeric>{transfer.value.toDecimal(18)}</Td>
                    <Td cursor="pointer"><Button colorScheme='blue'>Reclaim</Button></Td>
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
