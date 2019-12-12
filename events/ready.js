const storedBalances = await Users.findAll();
module.exports = (client, message) => {
  storedBalances.forEach(b => currency.set(b.user_id, b));
  client.user.setActivity(
    `${client.guilds.size.toLocaleString("en")} servers`,
    { type: "WATCHING" }
  );
  console.log(`Bot:     Ready and logged in as ${client.user.tag}`);
};
