"use client";

import {useEffect, useState} from "react";
import Web3, {Contract} from 'web3';
import {AbiItem} from 'web3-utils';
import {ethers} from "ethers";
import {tokenContractABI, tokenSaleContractABI} from "@/app/abis";

type TokenContractType = AbiItem[];
type SalesContractType = AbiItem[];

const tokenContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const saleContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

export default function Home() {

    const metaMaskInstalled = typeof window.ethereum != 'undefined';
    const [showAccounts, setShowAccounts] = useState<boolean>(false);
    const [buyErrorMessage, setBuyErrorMessage] = useState<string>('');
    const [coffeeErrorMessage, setCoffeeErrorMessage] = useState<string>('');
    const [showBuyLoader, setShowBuyLoader] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [salesContractInstance, setSalesContractInstance] = useState<Contract<SalesContractType> | undefined>(undefined);
    const [tokenContractInstance, setTokenContractInstance] = useState<Contract<TokenContractType> | undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(1);
    const [pouring, isPouring] = useState<boolean>(false);
    const [coffeeCount, setCoffeeCount] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const [tokenPrice, setTokenPrice] = useState<string>();

    useEffect(() => {
        const web3 = new Web3(window.ethereum);
        initSalesContract(web3)
        initTokenContract(web3)
    }, [window.ethereum])

    useEffect(() => {
        populateTokenPrice()
    }, [salesContractInstance])

    useEffect(() => {
        setShowAccounts(true)
    }, [accounts])

    useEffect(() => {
        updateBalance()
    }, [account])

    const populateTokenPrice = () => {
        salesContractInstance?.methods.tokenPriceInWei().call().then((value) => {
            console.log(value)
            setTokenPrice(Number(value))
        })
    }

    const updateBalance = () => {
        tokenContractInstance?.methods.balanceOf(account).call().then((value) => {
            console.log(value)
            setBalance(Number(value))
        })
    }

    const buyTokens = () => {
        if (account && salesContractInstance && quantity) {
            const amount = quantity * tokenPrice;
            setShowBuyLoader(true)
            salesContractInstance.methods.purchase().send({from: account, value: amount}).then((value) => {
                console.log(value)
                updateBalance();
            }, (error: Error) => {
                setBuyErrorMessage(error.message)
                console.log(error)
            }).finally(() => {
                setShowBuyLoader(false)
            })
        }
    }

    const initSalesContract = (web3: Web3) => {
        const salesContractInstance = new web3.eth.Contract(tokenSaleContractABI, saleContractAddress);
        setSalesContractInstance(salesContractInstance);
    }

    const initTokenContract = (web3: Web3) => {
        const tokenContractInstance = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
        setTokenContractInstance(tokenContractInstance);
    }

    const connectMetaMask = async () => {
        if (metaMaskInstalled) {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({method: 'eth_requestAccounts'});
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);
                if (accounts.length > 0) {
                    setAccount(accounts[0])
                }
            } catch (error) {
                alert('Error connecting to MetaMask: ' + error.message);
            }
        }
    };

    const handleSelectAccount = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setAccount(value)
    };

    const pourCoffee = async () => {
        isPouring(true);
        if (!pouring && tokenContractInstance) {
            tokenContractInstance.methods.useOneTokenToGetACoffee().send({from: account}).then((value) => {
                serveCoffee();
            }, (error: Error) => {
                setCoffeeErrorMessage(error.message)
                console.log(error)
            }).finally(() => {
                isPouring(false);
                updateBalance()
            })
        }
    };

    const serveCoffee = async () => {
        if (tokenContractInstance) {
            setCoffeeCount(coffeeCount + 1)
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-center p-3 bg-gray-700 text-white"><img src="machine.jpg" alt=""
                className="w-10 h-10 object-cover rounded mr-4 inline-block"/> ERC-20 Coffee Machine</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Cashier - <i><small>Buy token</small></i></h2>

                    <div className="flex items-center bg-white p-4 rounded-lg shadow">
                        <img src="cashier.jpg" alt=""
                            className="w-20 h-20 object-cover rounded mr-4"/>
                        <div>
                            <p className="mb-2">Hello ! Buy some token here for the coffee machine.</p>
                        </div>
                    </div>

                    <div className="flex items-center bg-white p-4 rounded-lg shadow">
                        <img src="cashier.jpg" alt=""
                            className="w-20 h-20 object-cover rounded mr-4"/>
                        <div>
                            <p className="mb-2">First, connect your MetaMask</p>

                            {(metaMaskInstalled && accounts.length == 0) && (
                                <button onClick={connectMetaMask}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-500 shadow">
                                    Connect MetaMask
                                </button>
                            )}
                            {(accounts.length > 0) && (
                                <div>
                                    <select
                                        className="p-2 border rounded"

                                        onChange={handleSelectAccount}
                                    >
                                        <option value="" disabled>Select an option</option>
                                        {accounts.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {(!metaMaskInstalled) && (
                                <p className="text-red-500 font-bold">You need to <a className="underline"
                                    target="_blank"
                                    href="https://metamask.io">install
                                    MetaMask</a>.
                                </p>
                            )}
                        </div>
                    </div>

                    {(account) && (
                        <div className="flex items-center bg-white p-4 rounded-lg shadow">
                            <img src="cashier.jpg" alt=""
                                className="w-20 h-20 object-cover rounded mr-4"/>
                            <div>
                                <p className="mb-2">How many token do you want? 1 Token is <strong>{ethers.formatEther(String(tokenPrice))}</strong> ETH)</p>
                                <div className="flex items-center space-x-2">
                                    <input type="number" value={quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setQuantity(Number(e.target.value));
                                    }} className="w-16 p-1 border rounded" placeholder="Qty"/>
                                    <button onClick={buyTokens} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        <div className="flex items-center">
                                            {showBuyLoader && <svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"/>
                                            </svg>}
                                            Buy

                                        </div>
                                    </button>
                                    <p className="text-red-500">{buyErrorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span></span>
                        <h2 className="text-xl font-semibold text-center">Coffee machine - <i><small>Spend token</small></i></h2>
                        <span className="text-lg font-bold text-green-600">Balance: {balance} Token</span>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-lg shadow">
                        <img src="machine.jpg" alt=""
                            className="w-20 h-20 object-cover rounded mr-4"/>
                        <div className="overflow-auto">
                            {(!pouring) && (
                                <div className="flex items-center space-x-2">
                                    <button onClick={pourCoffee} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Insert a token
                                    </button>
                                </div>)}

                            {(pouring) && (
                                <div className="flex items-center space-x-2">
                                    <svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"/>
                                    </svg>
                                    Pouring coffee...
                                </div>)}
                            {(coffeeErrorMessage) && (
                                <p className="text-red-500 text-wrap">
                                    {coffeeErrorMessage}
                                </p>)}
                        </div>
                    </div>
                    {(coffeeCount > 0) && (
                        <div className="flex items-center bg-white p-4 rounded-lg shadow">
                            <img src="machine.jpg" alt=""
                                className="w-20 h-20 object-cover rounded mr-4"/>
                            <div>

                                <div className="flex flex-wrap gap-4 justify-center">
                                    {Array.from({length: coffeeCount}, (_, i) => i + 1).map((num) => (
                                        <img key={num} src="coffee.jpg" alt={`Coffee ${num}`} className="w-20 h-20 object-cover rounded"/>
                                    ))}
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>
        </>
    )
}
