"use client";

import {useState} from "react";

export default function Home() {

    const metaMaskInstalled = typeof window.ethereum !== 'undefined';
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(1);
    const [pouring, isPouring] = useState<boolean>(false);
    const [coffeeCount, setCoffeeCount] = useState<number>(0);

    const connectMetaMask = async () => {
        if (metaMaskInstalled) {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                setAccount(accounts[0]);
            } catch (error) {
                alert('Error connecting to MetaMask: ' + error.message);
            }
        }
    };

    const buyToken = async () => {
        if (account) {
            console.log(quantity)
        }
    };

    const pourCoffee = async () => {
        if (!pouring) {
            isPouring(true);
            setTimeout(() => {
                isPouring(false);
                serveCoffee();
            }, 1000);
        }
    };

    const serveCoffee = async () => {
        setCoffeeCount(coffeeCount + 1)
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
                            <div className="flex items-center space-x-2">
                                {(metaMaskInstalled) && (
                                    <button onClick={connectMetaMask}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-500 shadow">
                                        {account ? `Connected: ${account}` : 'Connect MetaMask'}
                                    </button>
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
                    </div>

                    {(account) && (
                        <div className="flex items-center bg-white p-4 rounded-lg shadow">
                            <img src="cashier.jpg" alt=""
                                className="w-20 h-20 object-cover rounded mr-4"/>
                            <div>
                                <p className="mb-2">How many token do you want? 1 Token is 0.001 SepoliaETH</p>
                                <div className="flex items-center space-x-2">
                                    <input type="number" value={quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setQuantity(e.target.value);
                                    }} className="w-16 p-1 border rounded" placeholder="Qty"/>
                                    <button onClick={buyToken} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span></span>
                        <h2 className="text-xl font-semibold text-center">Coffee machine - <i><small>Spend token</small></i></h2>
                        <span className="text-lg font-bold text-green-600">Balance: 0 Token</span>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-lg shadow">
                        <img src="machine.jpg" alt="Item 3"
                            className="w-20 h-20 object-cover rounded mr-4"/>
                        <div>
                            {(!pouring) && (
                                <div className="flex items-center space-x-2">
                                    <button onClick={pourCoffee} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Insert a token
                                    </button>
                                </div>)}

                            {(pouring) && (
                                <div className="flex items-center space-x-2">
                                    Pouring coffee...
                                </div>)}

                        </div>
                    </div>
                    {(coffeeCount > 0) && (
                        <div className="flex items-center bg-white p-4 rounded-lg shadow">
                            <img src="machine.jpg" alt="Item 3"
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
