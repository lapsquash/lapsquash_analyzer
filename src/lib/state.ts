import { ENV } from "./constant";

interface State {
  uuid?: string;
  env?: ENV;
  bearer?: string;
}

class StateManager {
  private state: State = {};

  public get() {
    return this.state;
  }

  public getEnv() {
    const env = this.state.env;
    if (!env) throw new Error("env is not set");
    return env;
  }

  public set(newState: State) {
    this.state = newState;
  }
}

const stateManager = new StateManager();

export { stateManager };
