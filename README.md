# JARVIS.js
J.A.R.V.I.S rewrite in discord.js

# Running the code

1. clone the repo using the command 
```
git clone https://github.com/ArvindAROO/JARVIS.js
```

2. Install the dependencies using
```
npm install
```

3. Set up the `.env` file in the format 
```
TOKEN = "Your Bot Token"
API_KEY = "your API key" 
```
TOKEN is your discord bot's token

API_KEY is the key for your auth in rapidapi.com for `+joke` command

Further info of the API and docs - https://rapidapi.com/KegenGuyll/api/dad-jokes

4. Set up the `config.json` file with the following details like `prefix` and allowed commands

`botManagers` is the array of role IDs who will have full access to all moderation commands

`botLogs` is the channel ID of the logs channel

5. Run the bot using
```
node index.js
```
Warning: Discord.js v13 requires Node 16.6 or higher
