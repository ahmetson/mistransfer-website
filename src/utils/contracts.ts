export const getUserInterfaceAddress = (chainId: number): `0x${string}` => {
  if (chainId === 11155111) {
    return process.env.USER_INTERFACE as `0x${string}` || "0x78220f1C11D91f9B5F21536125201bD1aE5CC676";
  }

  throw Error(`No user interface address at chain id ${chainId}`);
}


