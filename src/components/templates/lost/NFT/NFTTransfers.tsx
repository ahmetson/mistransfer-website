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
import { useEvmWalletNFTTransfers } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback, useState } from 'react';
import { getEllipsisTxt } from 'utils/format';
import { useNetwork } from 'wagmi';
import {getUserInterfaceAddress, isCaringContract} from "utils/contracts";
import { readContract } from 'wagmi/actions';
import userInterfaceAbi from "utils/abi/UserInterface.json";
import {Address} from "viem";
import {EvmNftTransfer} from "@moralisweb3/common-evm-utils";
import ReclaimButton from "../../../elements/ReclaimButton/ReclaimButton";

const NFTTransfers = ({title = "NFT Transfers"}) => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const { fetch } = useEvmWalletNFTTransfers();
  let userInterfaceAddress: `0x${string}` = "0x0";
  const [transfers, setTransfers] = useState([] as Array<EvmNftTransfer>);

  const fetchReclaimable = useCallback(async () => {
    if (!chain) {
      return;
    }
    userInterfaceAddress = getUserInterfaceAddress(chain?.id as number);
    if (!data || !data.user || !data.user.address) {
      return;
    }
    const response = await fetch({
      address: data?.user?.address,
      chain: chain?.id,
    });
    if (!response) {
      return;
    }

    const fetchedTransfers = response.data.flatMap(async (transfer) => {
          if (!isCaringContract(chain?.id as number, transfer?.toAddress.checksum)) {
            return undefined;
          }

          const recovered = await readContract({
            address: userInterfaceAddress as Address,
            abi: userInterfaceAbi,
            functionName: 'recoveredNfts',
            args: [transfer?.transactionHash.toString(), transfer?.fromAddress?.checksum]
          });

          if (recovered) {
            return undefined;
          }

          return transfer;
        }
    );
    const result = await Promise.all(fetchedTransfers);
    const cleaned: EvmNftTransfer[] = [];
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
                  <Th>Token Id</Th>
                  <Th>Smartcontract</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Tx Hash</Th>
                  <Th>Action</Th>
                  <Th>Fee</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transfers?.flatMap((transfer, key) => {
                  if (transfer.contractType !== "ERC721") {
                    return [];
                  }
                  if (!isCaringContract(chain?.id as number, transfer?.toAddress.checksum)) {
                    return [];
                  }

                  return (
                  <Tr key={key} _hover={{bgColor: hoverTrColor}}>
                    <Td>{getEllipsisTxt(transfer?.tokenAddress.checksum)}</Td>
                    <Td>{transfer?.tokenId}</Td>
                    <Td>{getEllipsisTxt(transfer?.toAddress.checksum)}</Td>
                    <Td>{new Date(transfer.blockTimestamp).toLocaleDateString()}</Td>
                    <Td isNumeric>{getEllipsisTxt(transfer.transactionHash, 2)}</Td>
                    <Td cursor="pointer">
                      <ReclaimButton
                          reclaimType="NFT"
                          txHash={transfer?.transactionHash}
                          targetContract={transfer?.toAddress.checksum as string}
                          token={transfer?.tokenAddress.checksum as string}
                          value={parseInt(transfer?.tokenId)}
                          chainId={chain?.id as number}
                          user={data?.user?.address}
                      />
                    </Td>
                    <Td>
                      <Text fontSize='sm' color={"#718096"}>0.01 ETH</Text>
                    </Td>
                  </Tr>);
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Looks Like you do not have any NFT to recover</Box>
      )}
    </>
  );
};

export default NFTTransfers;
