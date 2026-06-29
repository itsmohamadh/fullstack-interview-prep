# ethers.js Interview Prep



---

## 📦 Core Concepts

### 1. Providers

**What:** A connection to the blockchain that allows read-only operations.

```javascript
import { ethers } from "ethers";

// Connect to a node
const provider = new ethers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/YOUR_KEY",
);

// Or use a public RPC
const provider = new ethers.getDefaultProvider("mainnet");

// For local development
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
```

**Key methods:**

- `provider.getBalance(address)` — Get ETH balance
- `provider.getBlockNumber()` — Get current block
- `provider.getTransaction(txHash)` — Get transaction details
- `provider.getCode(address)` — Check if address is a contract
- `provider.waitForTransaction(txHash)` — Wait for confirmation

**Common interview question:** _"What's the difference between a provider and a signer?"_

---

### 2. Signers

**What:** An object that holds a private key and can sign transactions.

```javascript
// From a private key
const privateKey = "0x...";
const signer = new ethers.Wallet(privateKey, provider);

// From a mnemonic
const mnemonic = "test test test...";
const wallet = ethers.Wallet.fromMnemonic(mnemonic);

// From a browser wallet (MetaMask)
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
```

**Key methods:**

- `signer.sendTransaction(tx)` — Send ETH or call contract
- `signer.getAddress()` — Get wallet address
- `signer.signMessage(message)` — Sign a message (for authentication)

**⚠️ NEVER hardcode private keys in frontend code!**

---

### 3. Contracts

**What:** A wrapper that makes calling smart contract functions feel like normal JavaScript.

```javascript
// ABI - defines the contract interface
const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const contractAddress = "0x...";

// Read-only contract (uses provider)
const contract = new ethers.Contract(contractAddress, abi, provider);

// Write contract (uses signer)
const contractWithSigner = new ethers.Contract(contractAddress, abi, signer);

// Read a function
const balance = await contract.balanceOf("0x...");
// Returns: BigNumber

// Write a function
const tx = await contractWithSigner.transfer("0x...", ethers.parseEther("1.0"));
await tx.wait(); // Wait for confirmation
```

**Common interview question:** _"What's an ABI and why do we need it?"_

> **ABI (Application Binary Interface):** Tells ethers.js how to encode function calls and decode responses. Without it, ethers wouldn't know what parameters a function expects or what return type it has.

---

### 4. BigNumber / Units

**What:** Ethereum uses 18 decimal places (wei). ethers.js uses `BigInt` (since v6) for precise arithmetic.

```javascript
// Parse Ether → Wei
const amount = ethers.parseEther("1.0"); // 1000000000000000000n
const amount = ethers.parseUnits("1.0", 18); // Same thing

// Format Wei → Ether
const eth = ethers.formatEther("1000000000000000000"); // "1.0"
const eth = ethers.formatUnits(amount, 18); // Same thing

// Other units
const gwei = ethers.parseUnits("1", "gwei"); // 1000000000n
const wei = 1n; // 1 wei
```

**Common interview question:** _"Why do we use BigNumber/ BigInt instead of regular numbers?"_

> **Answer:** JavaScript numbers can't safely represent integers beyond `2^53 - 1`. ETH amounts can be up to `2^256 - 1` (≈ 10^77), so we need BigInt.

---

### 5. Transactions

**What:** Sending ETH or interacting with contracts.

```javascript
// Send ETH
const tx = await signer.sendTransaction({
  to: "0x...",
  value: ethers.parseEther("0.1"),
  gasLimit: 21000,
});

// Wait for confirmation
const receipt = await tx.wait();
console.log("Block:", receipt.blockNumber);

// Contract interaction (already creates a transaction)
const tx = await contract.transfer("0x...", ethers.parseEther("1.0"));
const receipt = await tx.wait();

// Get transaction details
const txDetails = await provider.getTransaction(tx.hash);
```

**Transaction fields:**

- `to` — Recipient address
- `value` — Amount in wei (BigInt)
- `gasLimit` — Max gas to spend
- `gasPrice` — Price per gas (or use `maxFeePerGas` for EIP-1559)
- `nonce` — Transaction count (auto-handled)
- `data` — Contract call data (auto-generated)

---

### 6. Event Listening

**What:** Listen to smart contract events in real-time.

```javascript
// Listen to all Transfer events
contract.on("Transfer", (from, to, amount, event) => {
  console.log(`${from} sent ${formatEther(amount)} ETH to ${to}`);
});

// Listen to events from a specific address
contract.on("Transfer", (from, to, amount, event) => {
  if (from === myAddress) {
    console.log("Sent:", formatEther(amount));
  }
});

// Filter events by block range
const events = await contract.queryFilter("Transfer", blockFrom, blockTo);

// Get event logs
const filter = contract.filters.Transfer(specificAddress);
const events = await contract.queryFilter(filter);
```

**Common interview question:** _"What's the difference between on() and queryFilter()?"_

> **Answer:** `on()` listens for **new** events in real-time. `queryFilter()` retrieves **historical** events between two block numbers.

---

### 7. Common Utilities

```javascript
// Hash messages
ethers.id("Hello"); // keccak256
ethers.solidityPacked(["string", "uint"], ["Hello", 123]); // ABI encode

// Address utilities
ethers.isAddress("0x..."); // Check if valid
ethers.getAddress("0x..."); // Checksum address
ethers.verifyMessage(message, signature); // Verify signed message

// Network utilities
const network = await provider.getNetwork();
console.log(network.chainId); // 1 = mainnet, 5 = goerli, 137 = polygon

// Random
ethers.randomBytes(32); // Random 32 bytes
ethers.Wallet.createRandom(); // Generate new wallet
```

---

## 🔥 Most Asked Interview Topics

### 1. How does a transaction work from frontend to blockchain?

```javascript
// 1. User connects wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 2. Create transaction
const contract = new ethers.Contract(address, abi, signer);

// 3. Send transaction (user approves in MetaMask)
const tx = await contract.mint(ethers.parseEther("1"));

// 4. Wait for confirmation
const receipt = await tx.wait();

// 5. Handle result
if (receipt.status === 1) {
  console.log("Success!");
} else {
  console.log("Failed!"); // Reverted
}
```

**Key concepts to explain:**

- User signs with private key (MetaMask handles this)
- Transaction is broadcast to the network
- Miners include it in a block
- After confirmations, it's considered final

---

### 2. What's the difference between `call` and `sendTransaction`?

```javascript
// call - read-only, doesn't change state, no gas cost
const balance = await contract.balanceOf(address);

// sendTransaction - writes to blockchain, costs gas
const tx = await contract.transfer(address, amount);
```

|              | `call`                  | `sendTransaction`           |
| ------------ | ----------------------- | --------------------------- |
| State change | ❌ Read-only            | ✅ Writes to blockchain     |
| Gas cost     | ❌ Free                 | ✅ Costs ETH                |
| Returns      | Direct result           | Transaction hash            |
| Use for      | `view`/`pure` functions | Any state-changing function |

---

### 3. Error handling

```javascript
try {
  const tx = await contract.transfer(to, ethers.parseEther("1"));
  await tx.wait();
} catch (error) {
  // Parse the error
  if (error.code === "ACTION_REJECTED") {
    console.log("User rejected the transaction");
  } else if (error.code === "INSUFFICIENT_FUNDS") {
    console.log("Insufficient ETH balance");
  } else if (error.reason) {
    console.log("Contract revert reason:", error.reason);
  } else {
    console.log("Unknown error:", error);
  }
}
```

**Common errors:**

- `ACTION_REJECTED` — User rejected in wallet
- `INSUFFICIENT_FUNDS` — Not enough ETH for gas
- `CALL_EXCEPTION` — Contract reverted (check error.reason)
- `NETWORK_ERROR` — RPC connection issue
- `NONCE_EXPIRED` — Transaction stuck, try again with higher gas

---

### 4. Connected/Disconnected State

```javascript
// Check if user is connected
if (typeof window.ethereum !== "undefined") {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.listAccounts();

  if (accounts.length > 0) {
    // User is connected
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
  } else {
    // Not connected - prompt to connect
  }
}

// Listen for account changes
window.ethereum.on("accountsChanged", (accounts) => {
  if (accounts.length === 0) {
    // User disconnected
  } else {
    // New account selected
  }
});

// Listen for chain changes
window.ethereum.on("chainChanged", (chainId) => {
  window.location.reload(); // Usually need to reload
});
```

---

### 5. Estimating Gas

```javascript
// Estimate before sending
const gasEstimate = await contract.transfer.estimateGas(
  to,
  ethers.parseEther("1"),
);

// Add 20% buffer for safety
const gasLimit = (gasEstimate * 120n) / 100n;

const tx = await contract.transfer(to, ethers.parseEther("1"), {
  gasLimit: gasLimit,
});
```

---

### 6. Working with Different Networks

```javascript
// Chain IDs
const chainId = await provider.getNetwork();

// Switch network
try {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x89" }], // Polygon
  });
} catch (error) {
  if (error.code === 4902) {
    // Chain not added - add it
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          chainName: "Polygon Mainnet",
          rpcUrls: ["https://polygon-rpc.com"],
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          blockExplorerUrls: ["https://polygonscan.com"],
        },
      ],
    });
  }
}
```

---

## 🛠️ Pattern: Contract Factory

```javascript
// Reusable contract factory pattern
class ContractFactory {
  static getContract(contractName, signer) {
    const abi = ABI_MAP[contractName];
    const address = ADDRESS_MAP[contractName];
    return new ethers.Contract(address, abi, signer);
  }
}

// Usage
const tokenContract = ContractFactory.getContract("ERC20", signer);
const nftContract = ContractFactory.getContract("ERC721", signer);
```

---

## 🧪 Testing Patterns

```javascript
// Hardhat/Foundry style testing
import { ethers } from "hardhat";

describe("Token contract", () => {
  let token, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
  });

  it("Should transfer tokens", async () => {
    await token.transfer(user.address, ethers.parseEther("1"));
    const balance = await token.balanceOf(user.address);
    expect(balance).to.equal(ethers.parseEther("1"));
  });
});
```

---

## 🔥 Top 10 Interview Questions

### 1. What's the difference between ethers v5 and v6?

| Feature           | v5                         | v6                     |
| ----------------- | -------------------------- | ---------------------- |
| Big numbers       | BigNumber                  | BigInt (native)        |
| Formatting        | `ethers.utils.formatEther` | `ethers.formatEther`   |
| Contract creation | `new ethers.Contract`      | Same (but with BigInt) |
| Typed API         | ❌                         | ✅ `TypedContract`     |

### 2. How do you handle multiple RPC providers for reliability?

```javascript
// Fallback provider
const provider = new ethers.FallbackProvider([
  new ethers.JsonRpcProvider("https://rpc1.com"),
  new ethers.JsonRpcProvider("https://rpc2.com"),
]);
// Automatically switches if one fails
```

### 3. What's a nonce and why might it cause issues?

> **Answer:** The nonce is a transaction counter. If a transaction is stuck (low gas), subsequent transactions with the same nonce will fail. Solutions: speed up with higher gas or send a 0 ETH transaction to self with same nonce.

### 4. How do you handle gas price spikes?

```javascript
// Use EIP-1559 for better gas handling
const tx = await signer.sendTransaction({
  to: address,
  value: ethers.parseEther("0.1"),
  maxFeePerGas: ethers.parseUnits("100", "gwei"),
  maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
});

// Or get current gas price
const feeData = await provider.getFeeData();
const tx = {
  to: address,
  value: ethers.parseEther("0.1"),
  maxFeePerGas: (feeData.maxFeePerGas * 12n) / 10n, // 120%
  maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas * 12n) / 10n,
};
```

### 5. How do you verify a message signature?

```javascript
// Sign message
const message = "Login to app";
const signature = await signer.signMessage(message);

// Verify
const recoveredAddress = ethers.verifyMessage(message, signature);
const isValid = recoveredAddress === expectedAddress;

// Used for "Sign in with Ethereum" (SIWE) pattern
```

### 6. What's the difference between `wait()` and `waitForTransaction()`?

| Method                                | Purpose                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| `tx.wait()`                           | Waits for a specific transaction (from `sendTransaction`) |
| `provider.waitForTransaction(txHash)` | Waits for any transaction by hash                         |

### 7. How do you batch multiple contract calls efficiently?

```javascript
// Multicall pattern
const calls = [
  {
    target: token1,
    data: token1.interface.encodeFunctionData("balanceOf", [address]),
  },
  {
    target: token2,
    data: token2.interface.encodeFunctionData("balanceOf", [address]),
  },
];

// Use multicall contract to batch
const results = await multicall.aggregate(calls);
```

### 8. What are the different types of wallets?

| Type                               | Use Case              | Example            |
| ---------------------------------- | --------------------- | ------------------ |
| **Externally Owned Account (EOA)** | Regular user wallet   | MetaMask           |
| **Contract Wallet**                | Smart contract wallet | Safe (Gnosis Safe) |
| **Browser Provider**               | Web3 app integration  | `window.ethereum`  |

### 9. How do you handle ENS names?

```javascript
// Resolve ENS to address
const address = await provider.resolveName("vitalik.eth");

// Resolve address to ENS
const ensName = await provider.lookupAddress("0x...");

// Works with any function that accepts addresses
await contract.transfer("vitalik.eth", ethers.parseEther("1"));
```

### 10. What's a reorg and how does it affect your app?

> **Answer:** A blockchain reorganization happens when two blocks are mined at the same time. One becomes the canonical chain, the other is orphaned. Transactions in the orphaned block get reverted. Always wait for **confirmations** (3-12 blocks) before considering a transaction final.

```javascript
const receipt = await tx.wait(3); // Wait for 3 confirmations
```

---

## 📝 Quick Cheatsheet

```javascript
// 🏗️ Setup
const provider = new ethers.JsonRpcProvider('RPC_URL');
const signer = new ethers.Wallet('PRIVATE_KEY', provider);

// 📖 Read
const balance = await provider.getBalance(address);
const block = await provider.getBlockNumber();
const tx = await provider.getTransaction(hash);

// ✍️ Write
const tx = await signer.sendTransaction({ to, value: ethers.parseEther('1') });
await tx.wait();

// 📄 Contract
const contract = new ethers.Contract(address, abi, signer);
const data = await contract.viewFunction();
const tx = await contract.writeFunction(params);
await tx.wait();

// 🎧 Events
contract.on('EventName', (param1, param2) => { ... });
const events = await contract.queryFilter('EventName', from, to);

// 🔢 Units
ethers.parseEther('1') // 1 ETH → Wei
ethers.formatEther(balance) // Wei → ETH
```

---

## 🚨 Red Flags in Web3 Interviews

**If you hear these, run:**

- "We're building the next X" (without a clear differentiator)
- "We don't care about gas optimization" (🚩)
- "Security audits are too expensive" (🚩🚩🚩)
- "Our protocol is completely trustless" (rarely true)
- "We don't have a testnet" (🚩)
- "The founder controls the multisig" (🚩🚩)

**Good questions to ask:**

- "How many audits have you done?"
- "What's your security threshold for code review?"
- "What's your gas optimization strategy?"
- "How do you handle MEV (Miner Extractable Value)?"
- "What's your disaster recovery plan?"
- "How decentralized is your governance?"

---

## 📚 Additional Resources

- [ethers.js Documentation](https://docs.ethers.org/)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Solidity by Example](https://solidity-by-example.org/)
- [Secure Ethereum Development](https://consensys.github.io/smart-contract-best-practices/)

---

**Remember:** In Web3 interviews, they care as much about **security mindset** as technical knowledge. Always mention security considerations in your answers! 🔒
