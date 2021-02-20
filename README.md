## Links viewer

To add a new bot, who can handle new links types - add file in folder bots. This file must contain a class, that implements interface `Bot`. After you write all logic of your bot, you should place it's constructor in file `index.ts`, under the comment `// ? PLACE FOR INIT OTHER BOTS`. Also you must place code in file `fabrics.ts`, under the comment `// ? PLACE FOR RETURN OTHER BOTS`. You can use `habr-bot.ts` as example.

Also, to make your bot working, and to have possibility to all program generally, you must fill credentials for all available bots in `credentials.json5` file.

To run program, you should have installed [node.js](https://nodejs.org/en/download/), after that, do following commands:

```bash
bash init-credentials.sh
```

After that - fill your credentials in currently created file `credentials.json5`, and then:

```bash
npm init
npm run start
```

If you want to see, how program is working - change param `headless` in `config.json5` to `true`.