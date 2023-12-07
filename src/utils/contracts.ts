export const getUserInterfaceAddress = (chainId: number): `0x${string}` => {
  if (chainId === 11155111) {
    return process.env.NEXT_PUBLIC_USER_INTERFACE as `0x${string}`;
  }

  throw Error(`No user interface address at chain id ${chainId}`);
}


