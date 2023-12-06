# Mistransfer website

[Mistransfer](https://mistransfer-website-ahmetson.vercel.app)
is a platform to get back Tokens/NFTs sent to a wrong smartcontract.

*This boilerplate is built with [Moralis](https://moralis.io?utm_source=github&utm_medium=readme&utm_campaign=ethereum-boilerplate)*

# 🚀 `Quick Start`

<div justify="center">
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fahmetson%2Fmistransfer-website&env=MORALIS_API_KEY,NEXTAUTH_SECRET&envDescription=1.%20MORALIS_API_KEY%3A%20Visit%20admin.moralis.io.%202.%20NEXTAUTH_SECRET%3A%20Used%20for%20encrypting%20JWT%20tokens.%20You%20can%20put%20any%20or%20generate%20it%20on%20https%3A%2F%2Fgenerate-secret.now.sh%2F32&envLink=https%3A%2F%2Fgithub.com%2Fethereum-boilerplate%2Fethereum-boilerplate%23-quick-start"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
<a href="https://app.netlify.com/start/deploy?repository=https://github.com/ahmetson/mistransfer-website"><img src="https://www.netlify.com/img/deploy/button.svg"></a>
</div>

💿 Install all dependencies:

```sh
cd mistransfer/website
yarn install
```

✏ Rename `.env.local.example` to `.env.local` and provide required data. Get your Web3 Api Key from the [Moralis dashboard](https://admin.moralis.io/):

![image](https://user-images.githubusercontent.com/78314301/186810270-7c365d43-ebb8-4546-a383-32983fbacef9.png)

🖊️ Fill the environment variables in your .env.local file in the app root:

- `MORALIS_API_KEY`: You can get it [here](https://admin.moralis.io/web3apis).
- `NEXTAUTH_URL`: Your app address. In the development stage, use http://localhost:3000.
- `NEXTAUTH_SECRET`: Used for encrypting JWT tokens of users. You can put any value here or generate it on https://generate-secret.now.sh/32.
- `USER_INTERFACE`: UserInterface smartcontract address.

Example:

```
MORALIS_API_KEY=xxxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=7197b3e8dbee5ea6274cab37245eec212
USER_INTERFACE=0x1C5a4E5345E81db66EF3D739f7702DFb76a758b8
```

🚴‍♂️ Run your App:

```sh
yarn start
```

# 🧭 `Table of contents`

- [`Mistransfer unique sides`](#mistransfer-website)
- [🚀 Quick Start](#-quick-start)
- [🧭 Table of contents](#-table-of-contents)
- [🏗 Ethereum Components](#-ethereum-components)
  - [`<Lost/ERC20Transfers />`](#losterc20transfers-)
  - [`<Lost/NFTTransfers />`](#lostnfttransfers-)

# 🏗 Ethereum Components

## `<Lost/ERC20Transfers />`

location: `src/component/templates/lost/ERC20/ERC20Transfers.tsx`

💰 `<Lost/ERC20Transfers />` : displays the user's ERC20 transfers sent to a wrong contract. It shows the *"Reclaim"* button to get them back.

## `<Lost/NFTTransfers />`

location: `src/component/templates/lost/NFT/NFTTransfers.tsx`

🎨 `<Lost/NFTTransfers />` : displays the user's NFT transfers sent to a wrong contract. It shows the *Reclaim* button to recover lost NFTs.


