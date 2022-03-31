// My Deps
import Intro from './Intro';
import { fetchJokes, sendJoke } from "../utils/anchorClient"

import React, { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import JokeEditor from './JokeEditor';

const JokeArena = ({ network }) => {
    const wallet = useWallet();
    const [jokes, setJokes] = useState([]);

    const submitJoke = async (joke) => {
        await sendJoke(wallet, network, joke);
        await getAllJokes()
    }

    const getAllJokes = async () => {
        const jokes = await fetchJokes(wallet, network);
        setJokes(jokes.flatMap(joke => joke.account));
    }

    useEffect(() => {
        getAllJokes();
    }, [network, wallet]);

    return (
        <div>
            { wallet.connected &&
                jokes.map((item, idx) => (
                    <div key={idx} className={"card"}>
                        <div className={"card-body"}>
                            <div className={"joke-author"}>
                                <small className="txt-muted">
                                    by @{ item.author.toString()}
                                </small>
                            </div>
                            <div className={"joke-content"}>
                                { item.content }
                            </div>
                        </div>
                    </div>
                ))
            }
            <JokeEditor wallet={wallet} submitJoke={submitJoke} />
        </div>
    )
}

export default JokeArena;
