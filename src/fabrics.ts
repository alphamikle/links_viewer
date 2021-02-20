import { Bot } from "./bots/bot";
import { HabrBot } from "./bots/habr-bot";
import { ViewBot } from "./bots/view-bot";

export type Creator<T> = () => T;

export type ConstructorOf<T> = new (...params: any[]) => T;

export class Fabrics {
  private fabrics: Map<ConstructorOf<any>, Creator<any>> = new Map();

  add<T>(id: ConstructorOf<T>, creator: Creator<T>): void {
    this.fabrics.set(id, creator);
  }

  addSingle<T>(id: ConstructorOf<T>, creator: Creator<T>): void {
    const dependency = creator();
    this.fabrics.set(id, () => dependency);
  }

  get<T>(id: ConstructorOf<T>): T {
    const creator: Creator<T> | undefined = this.fabrics.get(id);
    if (creator === undefined) {
      throw new Error(`Creator for id ${id} not registered`);
    }
    return creator();
  }

  getBots(): Bot[] {
    return [
      this.get(HabrBot),
      // ? PLACE FOR RETURN OTHER BOTS
      // TODO
      this.get(ViewBot), // This bot must always be last
    ];
  }
}