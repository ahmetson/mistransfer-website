import { Default } from 'components/layouts/Default';
import { ERC20Transfers } from 'components/templates/lost/ERC20';

const ERC20LostPage = () => {
  return (
    <Default pageName="Lost ERC20 tokens">
      <ERC20Transfers title="Lost ERC20 tokens" />
    </Default>
  );
};

export default ERC20LostPage;
