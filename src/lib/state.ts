import { type ENV } from "./constant";

type State = {
  uuid?: string;
  env?: ENV;
  bearer?: string;
};

class StateManager {
  private state: State = {};

  public get(): State {
    return this.state;
  }

  public getEnv(): ENV {
    const env = this.state.env;
    if (env == null) throw new Error("env is not set");
    return env;
  }

  public set(newState: State): void {
    this.state = newState;
  }
}

const stateManager = new StateManager();

export { stateManager };
