# Buffer Trading Bot

This a proof of concept trading bot for the Buffer Finance protocol that takes Trading View alerts and submits 5 minute option trades on the price of ETH provided by the alert in the direction included in the alert.

## Setting up the bot

- Clone this repo
- `npm i` to install dependencies
- Create a `config.json` in the directory root
Copy the below into it and replace with your details.
```json
{
    "key": "MySuperSecretPrivateKey",  // This is the private key you want to trade with
    "alchemyKey": "My_Alchemy_API_key" // Create a free Alchemy account and put your api key here
}
```
- Install [ngrok](https://ngrok.com/)


## Running the bot

- Run `npm run dev` to start the bot
- Run `path/to/ngrok http 3000`

You should see something like:
```
Session Status                online                                            
Account                       yourSecretNgrokUserName (Plan: Free)                            
Version                       3.1.1                                             
Region                        United States (us)                                
Latency                       47ms                                              
Web Interface                 http://127.0.0.1:4040                             
Forwarding                    https://b0cf-71-69-227-154.ngrok.io -> http://localhost:3000
```

Copy the forwarding address that ends in `.ngrok.io`

## Set up your Trading View Alert

- Create a new TradingView alert on an ETHUSD chart.
- Click on the `Notifications` tab
- Paste the `ngrok` address into the `Webhook URL` field and make sure it has a checkmark next to it
- Select `Settings`
- Paste `{"pair":"{{ticker}}", "price": "{{close}}", "direction": "above"}` in the alert message box.  This will trigger a "long" option trade.  Change direction to "below" to do "short" options.
- Set your trigger condition and start the alert.

## See results

If all goes well, you should see a transction logged to the console indicating a trade was submitted.
