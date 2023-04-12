interface State {
  uuid?: string;
}

class StateManager {
  private state: State = {};

  public get() {
    return this.state;
  }

  public set(newState: State) {
    this.state = newState;
  }
}

const stateManager = new StateManager();

export { stateManager };
