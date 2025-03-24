const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  const wsProvider = new WsProvider('wss://rpc.hydradx.cloud');
  const api = await ApiPromise.create({ provider: wsProvider });

  const omnipoolId = '7L53bUTBbfuj14UpdCNPwmgzzHSsrsTWBHX5pys32mVWM3C1';
  await api.query.omnipool.assets.entries();

  const keys = await api.query.tokens.accounts.keys(omnipoolId);
  const queries = keys.map((key) => [omnipoolId, key.args[1]]);

  api.query.tokens.accounts.multi(queries, (balances) => {
    balances.forEach((data, i) => {
      const token = queries[i][1].toString();
      const { free } = data;
      console.log(token, ' => ', free.toHuman());
    });
    const time = [
      '-----',
      new Date().toISOString().replace('T', ' ').replace('Z', ''),
      '-----',
    ].join('');
    console.log(time);
  });
}

main().catch(console.error);
