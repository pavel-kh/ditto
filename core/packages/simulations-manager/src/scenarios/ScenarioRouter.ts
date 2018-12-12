import { Router, Request, Response } from "express";
import { Scenario } from "ditto-shared";
import { ScenarioModel } from "./ScenarioMongo";


export class ScenarioRouter {
    static routes(): Router {
        return Router()
            .post("/scenarios", async (req: Request, res: Response) => {
                const scenario: Scenario = req.body;
                try {
                    const newScenario = new ScenarioModel(scenario);
                    await newScenario.save();
                    res.status(200).send(newScenario);
                } catch (e) {
                    res.status(500).send(e);
                }
            })
            .get("/scenarios", async (req: Request, res: Response) => {
                const scenarios = await ScenarioModel.find({});
                res.status(200).json(scenarios);
            });
    }
}