import { ROOT_API_URL } from "../../constants";
import { SimulatorDefinition } from "ditto-shared";
import axios from "axios";
import { SimulatorActionTypes } from "./types";

const ROOT_URL_SIMULATORS = `${ROOT_API_URL}/simulators`;


export function fetchSimulators() {
  return async dispatch => {
    try {
      const simulators: SimulatorDefinition[] = (await axios.get(ROOT_URL_SIMULATORS)).data;
      dispatch(receiveSimulators(simulators));

    } catch (error) {
      console.log(error);

    }
  }
}

export function receiveSimulators(simulators: SimulatorDefinition[]) {
  return {
    type: SimulatorActionTypes.RECIEVE_SIMULATORS,
    simulators
  }
}



export function createSimulator(values) {
  console.log(values);

  return async dispatch => {

    try {
      dispatch({ type: SimulatorActionTypes.SIMULATOR_CREATION_STARTED });
      await axios.post(ROOT_URL_SIMULATORS, values);
      dispatch({ type: SimulatorActionTypes.SIMULATOR_CREATION_SUCCEEDED });

    } catch (error) {
      dispatch({ type: SimulatorActionTypes.SIMULATOR_CREATION_FAILED });

    }
  } 

}
  