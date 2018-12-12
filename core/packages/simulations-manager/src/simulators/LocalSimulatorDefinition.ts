import { SimulatorDefinition } from "ditto-shared";

const localSimulatorDefinition: SimulatorDefinition = {
    id: {
        imageName: "Manager",
        version: "latest"
    },
    commands: [
        {
            commandName: "wait",
            commandSchema: {
                "type": "object",
                "properties": {
                    "time": {
                        "type": "integer"
                    }
                },
                "required": [
                    "time"
                ]
            }
        }
    ]
};

export default localSimulatorDefinition;