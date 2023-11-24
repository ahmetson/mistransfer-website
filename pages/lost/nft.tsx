import { Default } from 'components/layouts/Default';
import { NFTTransfers } from 'components/templates/lost/NFT';

const NFTTransfersPage = () => {
  return (
    <Default pageName="Lost NFT">
      <NFTTransfers title="Lost NFTs" />
    </Default>
  );
};

export default NFTTransfersPage;
