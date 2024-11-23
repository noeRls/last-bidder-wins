# Last Bidder Wins

https://noerls.github.io/last-bidder-wins/

A blockchain-based bidding application built on Solana where users can place bets to win a prize pool. The rules are simple: if no one bets higher than you within 24 hours, you win the prize pool! But beware, if someone bets higher, you lose your bet and your chance to win.

## 🚀 Features

- **Decentralized Bidding:** All operations are managed autonomously by smart contracts on the Solana blockchain.
- **Transparent and Secure:** Transactions and rules are visible on-chain.
- **Responsive UI:** Built with React, TailwindCSS, and DaisyUI for a seamless user experience.
- **Open Source:** The code is fully open source and community-driven.

## 📜 Rules

1. Place a bet higher than the current highest bet.
2. If no one bets higher within 24 hours (derived from Solana slot speed), you can withdraw the prize pool.
3. If someone places a higher bet before you withdraw, you lose your bet.
4. A 1% fee is applied to maintain the project and support development.
5. Blockchain transaction fees apply.

## 🛠 Tech Stack

- **Frontend:**
  - React
  - TailwindCSS + DaisyUI
  - TypeScript
- **Blockchain:**
  - Solana
  - Anchor Framework
- **Backend/Hosting:**
  - None (Fully decentralized and hosted via static assets)

## 📝 Legal Disclaimer

- This application operates autonomously using blockchain smart contracts.
- The creators and maintainers of this project assume no liability for any losses, misuse, or errors arising from its use.
- All transactions are final and non-refundable.
- Users are responsible for ensuring compliance with their local laws and regulations.

## 🔒 Why This is Secure

LastBidderWins leverages the decentralized and transparent nature of the Solana blockchain to ensure security and fairness. Here’s why the platform is secure and how users can validate it:

### **1. Fully Decentralized**
- The core logic of the game, including placing bets and withdrawing prizes, is governed by smart contracts deployed on the Solana blockchain.
- No centralized authority has control over the funds, ensuring fairness and eliminating single points of failure.

### **2. Transparent Smart Contracts**
- All smart contract code is open source, allowing anyone to audit and verify the program's behavior.
- Users can view the deployed contract on the Solana blockchain to confirm it matches the open-source repository.

### **3. Immutable Transactions**
- Once a transaction is confirmed on the blockchain, it cannot be altered or reversed.
- This ensures that all bets and withdrawals follow the rules defined in the smart contract.

### **4. User-Controlled Funds**
- The platform does not custody your funds. All bets and winnings are directly handled by the smart contract and associated with your Solana wallet.
- You retain full control of your private keys and wallet access.

---

### **How Users Can Validate Security**

You can validate the deployed program using the public program ID. Compare the on-chain program code to the code on this repository.

- **Program ID:** `7x5a4DsG7gtWDLyrDUWXqqbzWBc3CpD3vR1vNUD1R8ag`
- Use Solana Explorer to view the program details: [Solana Explorer](https://explorer.solana.com/).
- Confirm Non-Upgradeability: You can verify that the program is non-upgradeable by inspecting the deployment details on Solana Explorer. Programs marked as non-upgradeable cannot be altered after deployment.
- You can follow [How to Verify a Program](https://solana.com/developers/guides/advanced/verified-builds) solana documentation to verify that the deployed program match the code in this repository.
