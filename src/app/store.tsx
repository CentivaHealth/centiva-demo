// Based on https://dev.to/yezyilomo/global-state-management-in-react-with-global-variables-and-hooks-state-management-doesn-t-have-to-be-so-hard-2n2c
// Credit also goes to my mate Fülöp.

// 1. Create singletons via createGlobalState()
export const stateWallet = createGlobalState({
  chain: undefined,
  status: WalletStatus.Disconnected as WalletStatus,
  wallet: undefined,
  username: undefined,
  address: undefined,
  message: undefined,
} as any);

// 2. Then in the components: import those states you need there.
//    If you need re-render on state change then employ useGlobalState.
//    If you do not want re-render on state change
//    then use getters & setters directly.

// ##################################

function createGlobalState(initState: any = null) {
  const prototype = {
    data: { state: initState, reRenderFns: [] as Array<any> },

    get() {
      return this.data.state;
    },

    set(newState: any) {
      if (newState === this.data.state) return;
      this.data.state = newState;
      this.data.reRenderFns.forEach((reRender) => reRender());
      return this;
    },

    joinReRender(reRender: any) {
      if (this.data.reRenderFns.includes(reRender)) return;
      this.data.reRenderFns.push(reRender);
    },

    cancelReRender(reRender: any) {
      this.data.reRenderFns = this.data.reRenderFns.filter(
        (reRenderFn) => reRenderFn !== reRender
      );
    },
  };

  return Object.freeze(Object.create(prototype));
}

import { WalletStatus } from "cosmos-kit";
// ##################################
import { useState, useEffect } from "react";

export default function useGlobalState(globalState: any) {
  const [, set] = useState(globalState.get());
  const state = globalState.get();
  const reRender = () => set({});

  useEffect(() => {
    globalState.joinReRender(reRender);
    return () => {
      globalState.cancelReRender(reRender);
    };
  });

  function setState(newState: any) {
    globalState.set(newState);
  }

  return [state, setState];
}
