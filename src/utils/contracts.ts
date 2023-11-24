import {EvmAddressish} from "@moralisweb3/common-evm-utils";

export const userInterfaceAddress = (chainId: number): string => {
  if (chainId === 11155111) {
    return "0x78220f1C11D91f9B5F21536125201bD1aE5CC676";
  }

  throw `No user interface address at chain id ${chainId}`;
}

/**
 * Returns list of smartcontracts that cares about their users
 * @returns {Array<string>}
 */
export const userCaringContracts = (chainId: number) => {
  if (chainId === 11155111) {
    return ["0x418Ea9e6821177d3F4cd787F1c6dbb70781c0d51"];
  }
  return [];
};

export const isCaringContract = (chainId: number, address: EvmAddressish): boolean => {
  let contracts = userCaringContracts(chainId);
  if (contracts.length == 0) {
    return false;
  }

  return contracts.findIndex((contract) => contract.toLowerCase() === address.toString().toLowerCase()) > -1;
}