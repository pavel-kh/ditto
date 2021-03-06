import Dockerode, { Container, ContainerInspectInfo, ContainerInfo } from "dockerode";



class DockerodeExtension extends Dockerode {
    async getContainerIdByName(name: string) {

        // filter by name
        const opts = {
            "limit": 1,
            "filters": `{"name": ["${name}"]}`
        };

        return new Promise<string>((resolve, reject) => {
            this.listContainers(opts, function (err, containers) {
                if (err) {
                    reject(err);
                } else {
                    resolve(containers && containers[0].Id);
                }
            });
        });
    }

    async getNetworkByName(name: string) {
        const opts = {
            "limit": 1,
            "filters": `{"name": ["${name}"]}`
        };
        const networks = await this.listNetworks(opts);
        if (networks && networks.length > 0) {
            return networks[0];
        } else {
            throw new Error(`Network ${name} not found`);
        }
    }

    async getNetworksByName(name: string) {
        const opts = {
            "filters": `{"name": ["${name}"]}`
        };
        const networks = await this.listNetworks(opts);
        if (networks && networks.length > 0) {
            return networks;
        } else {
            throw new Error(`Networks ${name} not found`);
        }
    }

    async removeExitedContainers() {
        // filter by status
        const opts = {
            "filters": { "status": ["exited"] }
        };
        const doRemoveExitedContainers = async () => {
            await this.listContainers(opts, async (err, containers) => {
                if (!containers || containers.length === 0) {
                    console.log("There were no exited containers to remove");
                    return;
                }

                await Promise.all(containers.map(async container => {
                    await this.getContainer(container.Id).remove();
                    console.log(`exited container ${container.Id} was removed`);
                }));

            });
        };
        doRemoveExitedContainers();
    }



}

export const dockerode = new DockerodeExtension(
    {
        host: process.platform === "linux" ? "http://172.17.0.1" : "host.docker.internal",
        port: 1234
    });
