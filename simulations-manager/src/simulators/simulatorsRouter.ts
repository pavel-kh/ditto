import { Router, Request, Response } from "express";
import { SimulatorDefinitionModel } from "../simulators/SimulatorDefinitionMongo";
import { UploadedFile } from "express-fileupload";
import { SimulatorDefinition, ExposedPort } from "./simulatorDefinition";
import { dockerode } from "../connectors/dockerodeConnector";
import fs from "fs";
import localSimulatorDefinition from "./localSimulatorDefinition";
import { PortType } from "./simulatorDefinition";
const UPLOADS_DIR = `${__dirname}/uploads`;
const IMAGES_DIR = `${__dirname}/images`;


export class SimulatorRouter {


    static routes(): Router {
        return Router()
            .get("/simulators", async (req: Request, res: Response) => {
                const simulators: SimulatorDefinition[] = await SimulatorDefinitionModel.find({}, "-_id");
                simulators.push(localSimulatorDefinition);
                res.status(200).json(simulators);
            }).post("/simulators/upload", async (req: Request, res: Response) => {
                try {
                    const simulatorFile: UploadedFile = <UploadedFile>req.files.file;
                    const uploadId = req.body.uploadId;
                    const temp = simulatorFile.name.split(".");
                    if (temp[temp.length - 1] !== "tar") {
                        throw ("Please provide tar file");
                    }
                    await simulatorFile.mv(`${UPLOADS_DIR}/${uploadId}.tar`);
                    res.status(200).send();
                }
                catch (e) {
                    res.status(500).send(e);
                }
            }).post("/simulators", async (req: Request, res: Response) => {
                try {
                    const simulatorDefinition: SimulatorDefinition = req.body.simulator as SimulatorDefinition;
                    const uploadId: string = req.body.uploadId;

                    const simulatorFilePath = `${UPLOADS_DIR}/${uploadId}.tar`;
                    const tag = `${simulatorDefinition.id.imageName}:${simulatorDefinition.id.version}`;
                    const readStream = await dockerode.buildImage(simulatorFilePath,
                        {
                            t: tag
                        });

                    simulatorDefinition.ports = await SimulatorRouter.getExposedPorts(tag);
                    const newSimulatorDefinition = new SimulatorDefinitionModel(simulatorDefinition);
                    await newSimulatorDefinition.save();
                    await fs.unlink(simulatorFilePath, (err) => {
                        if (err) {
                            console.log(`couldn't remove simulator file at ${simulatorFilePath}`);
                        }
                    });
                    res.status(200).send();
                } catch (e) {
                    res.status(500).send(e);
                }

            });
    }

    private static async getExposedPorts(tag: string) {
        const image = await dockerode.getImage(tag);
        const imageInfo = await image.inspect();
        const exposedPorts = imageInfo.ContainerConfig.ExposedPorts;
        const ports: ExposedPort[] = [];
        Object.keys(exposedPorts).forEach((port: string) => {
            const splitted = port.split("/");
            ports.push({
                port: +splitted[0],
                type: splitted[1] as PortType
            });
        });
        return ports;
    }
}