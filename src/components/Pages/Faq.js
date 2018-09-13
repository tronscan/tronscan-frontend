import React, {Component} from 'react';
import {HrefLink} from "../common/Links";

export default class Faq extends Component {


  render() {

    return (
        <main className="container header-overlap news">
          <div className="row _faq">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h2>What is token migration and Independence Day?</h2>
                  <p>Independence Day is when TRON leaves the Ethereum network and becomes its own coin with its own
                    network. For coins to be converted, they need to be on an exchange by June 21st. By June 24th the
                    TRX ERC20 tokens will be converted to TRX coins and can be withdrawn from exchanges. Below is a list
                    of some of the exchanges that support the migration.</p>
                  <p>
                    Bi, Bibox, BIHUEX, Binance, Bitbns, Bitfinex, Bitflip, Bitforex, Bithumb, BITKOP, BitoEX,
                    Bitpie, Bittrex, Bit-Z www, Bixin, BJEX, CEO, COBINHOOD, Cobo, CoinBene, CoinEgg, CoinEx, Coinnest,
                    Coinoah, CoinTiger, Cryptopia www, DragonEX, Gate.io, HitBTC, HPX, Huobi, IDAX, IDCM.IO, Indodax,
                    Koinex, Lbank, Liqui, Livecoin, lomostar, Maincoin, Max Exchange, Mercatox, Mercatox, OEX,
                    OkCoin-kr,
                    OKEx, OTCBTC, Rfinex, RIGHTBTC, sistemkoin, stock.exchange, Tokenomy, Upbit, Zebpay
                  </p>
                  <h2>What If my coins are not on an exchange by the June 21st deadline?</h2>
                  <p>That is ok. Just don&rsquo;t move them between June 21st and June 24th. And after June 24th, they
                    will be unusable until you convert them. Not all exchanges will support a post June 25th conversion,
                    but some will. You will need to confirm with an exchange at that time, and then send your TRX ERC20
                    coins to them for migration.</p>
                  <h2>How do I get my new TRX address and private key?</h2>
                  <ul>
                    <li>
                      Follow the step-by-step guide on how to create a wallet on Tronscan.org{' '}
                      <HrefLink
                          href="https://medium.com/tron-foundation/how-to-create-a-wallet-on-trons-explorer-ee9505a12615">
                        https://medium.com/tron-foundation/how-to-create-a-wallet-on-trons-explorer-ee9505a12615
                      </HrefLink>
                    </li>
                    <li>
                      Or try an alternative wallet, recommended wallets can be found on <HrefLink
                        href="https://tron.network/wallet?lng=en">https://tron.network/wallet</HrefLink>
                      <ul>
                        <li>
                          Winner of the TRON Android Wallet contest. <HrefLink
                            href="https://github.com/Dryec/tron-wallet-android">https://github.com/Dryec/tron-wallet-android</HrefLink>
                        </li>
                        <li>
                          Winner of the TRON Chrome wallet contest. <HrefLink
                            href="https://github.com/Johnsavadkuhi/tron-walletex">https://github.com/Johnsavadkuhi/tron-walletex</HrefLink>
                        </li>
                        <li>
                          Winner of TRON Mac wallet contest. <HrefLink
                            href="https://github.com/zx63/TronWallet">https://github.com/zx63/TronWallet</HrefLink>

                        </li>
                        <li>
                          Winner of TRON Windows wallet contest. <HrefLink
                            href="https://github.com/TronWatch/Desktop-Wallet">https://github.com/TronWatch/Desktop-Wallet</HrefLink>
                        </li>
                        <li>
                          TRON&rsquo;s Wallet CLI. <HrefLink
                            href="https://github.com/tronprotocol/wallet-cli">https://github.com/tronprotocol/wallet-cli</HrefLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <h2>Are there any support hardware wallets?</h2>
                  <p>
                    Ledger support is expected to be available mid-July. Trezor support is under development.
                  </p>
                  <h2>When can I send my new TRX coins from Exchange to my new address?</h2>
                  <p>Not until June 25th. As a best practice with any new wallet address, it is always wise to send a
                    small amount (a few cents) as a test transition. Once you receive the initial deposit of a few
                    cents, you can safely send the rest.</p>
                  <h2>What is coin freezing?</h2>
                  <p>Freezing your TRX coins gives you two main things. TRON Power and Bandwidth. TRON power lets you
                    vote for SR candidates and you get 1 TRON power (vote) per TRX frozen. Bandwidth lets you make
                    transactions on the network. The more you TRX you freeze, the more transactions you can make at a
                    cheaper price. You NEVER LOSE any TRX for freezing. You just can&rsquo;t unfreeze coins for 3 days,
                    so you can&rsquo;t send to anyone or sell it while frozen.</p>
                  <h2>What are the mechanics of voting?</h2>
                  <p>Voting can be done on tronscan.org. Or by most wallets. Voting is not a one-time thing, it is
                    forever. You can change your votes at any time, and the top 27 SR can rotate as frequently as every
                    6 hours. You can vote for more than one candidate as you get one vote per TRON power (frozen TRX)
                    and can split them however you want.</p>
                  <p>On Tronscan org, just click on the voting tab, then start voting, and add votes to each SR
                    candidate. Then click the green submit votes button. All votes will remain casted until you change
                    your vote or unfreeze your TRX.</p>
                  <p>
                    A step-by-step guide can be found at{' '}
                    <HrefLink
                        href="https://medium.com/tron-foundation/how-to-vote-for-super-representatives-d81d14d9743d">
                      https://medium.com/tron-foundation/how-to-vote-for-super-representatives-d81d14d9743d
                    </HrefLink>
                  </p>
                  <h2>What is a Super Representative and why would I want to vote?</h2>
                  <p>On Independence Day, we leave the Ethereum network. The 27 SRs are the companies that are
                    responsible to build and operate the new TRON network. Additionally, there will be 50+ stand-by SRs.
                    TRON has set aside SR rewards in the form of TRX to pay these companies.</p>
                  <p>The voters, can select which SRs they want, based on their contribution to the community and how
                    they plan to spend their rewards. This gives the voters a direct say in the future of TRON, and how
                    they would like the SRs to reinvest in TRON.</p>
                  <p>In addition to network operations, some of the common SR plans include items like
                    Network Growth, Marketing and Promotions, Network Security, Voter TRX rewards, User guides, Test net
                    Operations, Voter Communication, Content and Education, dApp development
                  </p>
                  <h2>Where can I learn more about SR candidates?</h2>
                  <p>Many SR candidates have their own web pages, twitter accounts, telegram channels. However, there
                    are two central locations for information. The first is on Tronscan.org. Click on the votes tab and
                    you will see a list of all SR candidates. Next to each one is a link and you can open a page with
                    information about that SR. This is a perfect place for light research, since this is also where you
                    can vote. The second central location for SR information is at <HrefLink
                        href="https://tron.live/">https://tron.live</HrefLink>.</p>
                  <h2>What are full, witness and solidity nodes?</h2>
                  <p>Nodes are servers that run the TRON blockchain software.</p>
                  <p>There are only 27 Witness nodes, worldwide, and they are each run by independent companies. These
                    are the nodes that take turns creating the blocks of the blockchain, while the others act as the
                    signing witnesses. This is the process that allows trustless consensus without any authoritative
                    third party. Because of the serious and critical nature of this function, witness node owners
                    receive compensation.</p>
                  <p>Full nodes are the API nodes. There will be thousands, and even tens of thousands of these around
                    the world. These are the severs that will act as &ldquo;web servers&rdquo; on the decentralized web.
                    This is where smart contracts, dapps and user content is stored. However, no compensation is given
                    to Full node owners. Some SRs will use their rewards to fund these nodes, some dapp developers will
                    install these nodes, as will some enthusiasts.</p>
                  <p>A solidity node only shows data from irreversible blocks. It takes time for a witness node to
                    create a block, for other witnesses to agree to the block, and then for additional blocks to be
                    placed on the chain. It is not until a block gets &ldquo;buried&rdquo; in the chain that it is
                    deemed irrevocable. All transactions during this time are considered &ldquo;pending&rdquo;. It can
                    take a block anywhere from 30 second &ndash; 5 minutes to become irreversible.</p>
                  <p className="text-center text-muted p-3">
                    This FAQ was contributed by <HrefLink
                      href="https://medium.com/tron-foundation/election-manifesto-of-tron-super-representative-freespace-ad20054e55fc">Free
                    Space</HrefLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}
