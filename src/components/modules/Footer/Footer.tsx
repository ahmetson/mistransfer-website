import { Box, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const links = {
  github: 'https://github.com/ahmetson/mistransfer/',
  githubWebsite: 'https://github.com/ahmetson/mistransfer-website',
  presentation: 'https://devpost.com/software/user-caring',
};

const Footer = () => {
  return (
    <Box textAlign={'center'} w="full" p={6}>
      <Text>
        ⭐️ Star the{' '}
        <Link href={links.github} isExternal alignItems={'center'}>
          ahmetson/mistransfer <ExternalLinkIcon />
        </Link>
        , smartcontracts!
      </Text>
      <Text>
          ⭐️ Star the{' '}
          <Link href={links.githubWebsite} isExternal alignItems={'center'}>
              ahmetson/mistransfer-website <ExternalLinkIcon />
          </Link>
          , UI website!
      </Text>
      <Text>
        📖 Read more about about{' '}
        <Link href={links.presentation} isExternal alignItems={'center'}>
          Mistransfer<ExternalLinkIcon /> in the hackathon page
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
