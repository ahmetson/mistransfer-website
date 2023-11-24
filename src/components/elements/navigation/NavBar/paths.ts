import { ISubNav } from '../SubNav/SubNav';

const NAV_LINKS: ISubNav[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Lost Assets',
    subLabel: 'Recover your crypto',
    href: '/lost',
    logo: 'looking',
    children: [
      {
        label: 'ERC20',
        subLabel: 'Get your ERC20 tokens back',
        href: '/lost/erc20',
        logo: 'token',
      },
      {
        label: 'NFT',
        subLabel: 'Get your NFTs back',
        href: '/lost/nft',
        logo: 'lazyNft',
      },
    ],
  },
  {
    label: 'Transactions',
    href: '/transactions',
  },
  {
    label: 'Transfers',
    href: '/transfers',
    children: [
      {
        label: 'ERC20',
        subLabel: 'Get your ERC20 transfers',
        href: '/transfers/erc20',
        logo: 'token',
      },
      {
        label: 'NFT',
        subLabel: 'Get your ERC721 an ERC1155 transfers',
        href: '/transfers/nft',
        logo: 'lazyNft',
      },
    ],
  },
  {
    label: 'Balances',
    href: '/balances',
    children: [
      {
        label: 'ERC20',
        subLabel: 'Get your ERC20 balances',
        href: '/balances/erc20',
        logo: 'token',
      },
      {
        label: 'NFT',
        subLabel: 'Get your ERC721 an ERC1155 balances',
        href: '/balances/nft',
        logo: 'pack',
      },
    ],
  },
];

export default NAV_LINKS;
