exports.run = async (client, message, args) => {
  const items = await CurrencyShop.findAll();
  return message.channel.send(
    items.map(item => `${item.name}: ${item.cost}💰`).join("\n"),
    { code: true }
  );
};
