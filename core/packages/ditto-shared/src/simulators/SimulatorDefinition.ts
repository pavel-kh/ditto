import { SimulatorId } from "./SimulatorId";
import { CommandDefinition } from "./../commands/CommandDefinition";

export enum PortType {
    Udp = "udp",
    Tcp = "tcp"
}

export interface ExposedPort {
    type: PortType;
    port: number;
}

export interface SimulatorDefinition {
    id: SimulatorId;
    configSchema?: any;
    ports?: ExposedPort[];
    commands: CommandDefinition[];

}