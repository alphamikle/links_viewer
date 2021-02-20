import { Fabrics } from "./src/fabrics";
import { HabrBot } from "./src/bots/habr-bot";
import { Utils } from "./src/utils";
import { ViewBot } from "./src/bots/view-bot";
import { GoogleSheetHandler } from "./src/google-sheet-handler";
import { BotsFather } from "./src/bots-father";
import { Puppy } from "./src/puppy";
import { Config } from "./src/config";

let iteration = 1;

async function run(): Promise<void> {
  const fabrics = new Fabrics();
  fabrics.add(Utils, () => new Utils());
  new Config(fabrics.get(Utils));
  fabrics.addSingle(Puppy, () => new Puppy(fabrics.get(Utils)));
  fabrics.add(HabrBot, () => new HabrBot(fabrics.get(Utils), fabrics.get(Puppy)));

  // ? PLACE FOR INIT OTHER BOTS
  // TODO

  fabrics.add(ViewBot, () => new ViewBot(fabrics.get(Utils), fabrics.get(Puppy)));
  fabrics.add(GoogleSheetHandler, () => new GoogleSheetHandler());
  const googleSheetHandler = fabrics.get(GoogleSheetHandler);
  const puppy = fabrics.get(Puppy);
  await puppy.constructBrowser();
  const rows = await googleSheetHandler.loadRows();
  const botsFather = new BotsFather(rows, fabrics.getBots(), fabrics.get(Utils), googleSheetHandler);
  await botsFather.doWork();
  await puppy.destroyBrowser();
  await fabrics.get(Utils).wait(10 * 1000);
}

const functions: any[] = [];

async function main() {
  functions.push(run);
  while (functions.length > 0) {
    const mainFunction = functions.pop();
    await mainFunction();
    functions.push(run);
    console.log(`${iteration}-th was completed. Start ${++iteration}-th`);
  }
}

main().then(() => {
  console.log('All done');
  process.exit(0);
});