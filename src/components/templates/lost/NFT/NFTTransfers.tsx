import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Heading,
  Box,
  useColorModeValue, Button,
} from '@chakra-ui/react';
import { useEvmWalletNFTTransfers } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getEllipsisTxt } from 'utils/format';
import { useNetwork } from 'wagmi';
import {isCaringContract} from "utils/contracts";

const NFTTransfers = ({title = "NFT Transfers"}) => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const { data: transfers } = useEvmWalletNFTTransfers({
    address: data?.user?.address,
    chain: chain?.id,
  });

  useEffect(() => console.log('lost nfts: ', transfers), [transfers]);

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
                    <Td cursor="pointer"><Button colorScheme='blue'>Reclaim</Button></Td>
                  </Tr>);
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Looks Like you do not have any NFT transfers</Box>
      )}
    </>
  );
};

export default NFTTransfers;
