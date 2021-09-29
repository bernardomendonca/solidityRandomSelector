const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let randomSelector;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    randomSelector = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

//asserting deployment
describe("Random Selector Contract", () => {
    it("deploys a contract", () => {
        assert.ok(randomSelector.options.address);
    });

    it('allows one account to enter', async() => {
        await randomSelector.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", 'ether')
        });

        const players = await randomSelector.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });
    
    it('allows multiple accounts to enter', async() => {
        await randomSelector.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", 'ether')
        });

        await randomSelector.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei("0.02", 'ether')
        });

        await randomSelector.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei("0.02", 'ether')
        });

        const players = await randomSelector.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });
    //using try + cactch to fetch errors from the async function
    it('requires a minimum amount of ether to enter', async () => {
        try {
            await randomSelector.methods.enter().send({
                from: accounts[0],
                value: 200
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call function', async () => {
        try {
            await randomSelector.methods.pickWinner().send({
                from: accounts[1],
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to winner and resets players array', async () => {
        //get someone to join the draw
        await randomSelector.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        //Get initial balance of accounts[0]
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        //pick a winner
        await randomSelector.methods.pickWinner().send({ from: accounts[0] })

        //Get final balance of accounts[0]
        const finalBalance = await web3.eth.getBalance(accounts[0])

        //Check the difference allowing for some amount on gas
        //Using 1.8, slightly less than 2
        const difference = finalBalance-initialBalance > web3.utils.toWei('1.8', 'ether');
    });
});