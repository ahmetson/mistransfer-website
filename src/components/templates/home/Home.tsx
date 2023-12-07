import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem } from '@chakra-ui/react';

const Home = () => {
  console.log(`The UserInterface: ${process.env.NEXT_PUBLIC_USER_INTERFACE!}`);

  return (
    <VStack w={'full'}>
      <Heading size="md" marginBottom={6}>
        Mistransfer
      </Heading>
      <List spacing={3}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Recover the tokens sent to a wrong address.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Everything is open sourced.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Explorer of Lost tokens.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Supports NFTs and Tokens.
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          One line of code to integrate
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Open source
        </ListItem>
      </List>
    </VStack>
  );
};

export default Home;
