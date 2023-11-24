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
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEvmWalletTokenTransfers } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getEllipsisTxt } from 'utils/format';
import {isCaringContract} from "utils/contracts";
import { useNetwork } from 'wagmi';

const ERC20Transfers = ({title = "Lost ERC20 tokens"}) => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const { data: transfers } = useEvmWalletTokenTransfers({
    address: data?.user?.address,
    chain: chain?.id,
  });

  useEffect(() => console.log('lost transfers: ', transfers, chain?.id), [transfers]);

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
                {transfers?.flatMap((transfer, key) => {
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
        <Box>Looks Like you do not have any ERC20 Transfers</Box>
      )}
    </>
  );
};

export default ERC20Transfers;
