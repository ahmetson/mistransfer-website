import { Box, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const links = {
  github: 'https://github.com/ahmetson/user-caring/',
  presentation: 'https://devpost.com/software/user-caring',
};

const Footer = () => {
  return (
    <Box textAlign={'center'} w="full" p={6}>
      <Text>
        ⭐️ Please star this{' '}
        <Link href={links.github} isExternal alignItems={'center'}>
          ahmetson/user-caring <ExternalLinkIcon />
        </Link>
        , every star makes us very happy!
      </Text>
      <Text>
        📖 Read more about{' '}
        <Link href={links.presentation} isExternal alignItems={'center'}>
          User Caring presentation <ExternalLinkIcon />
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
