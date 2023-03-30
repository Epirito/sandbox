import ContainerSystem, { ContainerComponent, HandComponent } from "../logic/container";
import { PhysicsSystem } from "../logic/physics";
import { ProngSystem } from "../logic/prong";
import Simulation from "../logic/simulation";
import { SimulationPOV } from "../logic/simulation-pov";
import { examinables } from "../stuff/examinables";
const thingMaker = {}
export const phys = new PhysicsSystem();
export const electricity = new ProngSystem(phys);
export const container = new ContainerSystem(phys, thingMaker);
const sim = new Simulation({phys, electricity, container, thingMaker});
const player = sim.bareEntity(10);
export const pov = new SimulationPOV(sim, player);

player.examinableComp = examinables.man
player.handComp = new HandComponent(5);
player.blocksMovement = true;

const chest = sim.bareEntity(6);
chest.containerComp = new ContainerComponent(5);
chest.examinableComp = examinables.chest
chest.blocksMovement = true;
container.placeInside(chest, sim.make('wire'));


phys.place(player, { position: [5, 5], rotation: 0 });
phys.place(sim.make('craftingTable'), { position: [5, 6], rotation: 0 })
phys.place(chest, { position: [1, 0], rotation: 0 });
phys.place(sim.make('pressurePlate'), { position: [1, 3], rotation: 0 });
phys.place(sim.make('wire'), { position: [3, 3], rotation: 0 });
phys.place(sim.make('wire'), { position: [2, 3], rotation: 0 });
phys.place(sim.make('wire'), { position: [2, 2], rotation: 0 });
phys.place(sim.make('bimux'), { position: [3, 2], rotation: 0 });
phys.place(sim.make('wire'), { position: [4, 2], rotation: 0 });
phys.place(sim.make('wire'), { position: [5, 2], rotation: 0 });
phys.place(sim.make('bimux'), { position: [6, 2], rotation: 2 });
phys.place(sim.make('lamp'), { position: [7, 2], rotation: 0 });
phys.place(sim.make('lamp'), { position: [6, 1], rotation: 0 });
phys.place(sim.make('lamp'), { position: [6, 3], rotation: 0 });
phys.place(sim.make('belt'), { position: [1, 1], rotation: 0 });
phys.place(sim.make('belt'), { position: [2, 1], rotation: 0 });