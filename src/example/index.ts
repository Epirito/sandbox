import CharacterMovement from "../logic/actions";
import ContainerSystem, { ContainerComponent, HandComponent } from "../logic/container";
import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import { ProngSystem } from "../logic/prong";
import Simulation from "../logic/simulation";
import { belt, bimux, lamp, pressurePlate, wire } from "../stuff/entities";
import { examinables } from "../stuff/examinables";

export const phys = new PhysicsSystem();
export const electricity = new ProngSystem(phys);
export const container = new ContainerSystem(phys);
export const charMov = new CharacterMovement(phys);
export const sim = new Simulation({phys, electricity, container}, ({action, terms}) => {
    console.log(action, terms);
})
export const player = new Entity(10);
player.examinableComp = examinables.man
player.handComp = new HandComponent(5);
player.blocksMovement = true;

const chest = new Entity(6);
chest.containerComp = new ContainerComponent(5);
chest.examinableComp = examinables.chest
chest.blocksMovement = true;


phys.place(player, { position: [5, 5], rotation: 0 });
phys.place(chest, { position: [1, 0], rotation: 0 });
phys.place(sim.make(pressurePlate(3)), { position: [1, 3], rotation: 0 });
phys.place(sim.make(wire), { position: [3, 3], rotation: 0 });
phys.place(sim.make(wire), { position: [2, 3], rotation: 0 });
phys.place(sim.make(wire), { position: [2, 2], rotation: 0 });
phys.place(sim.make(bimux), { position: [3, 2], rotation: 0 });
phys.place(sim.make(wire), { position: [4, 2], rotation: 0 });
phys.place(sim.make(wire), { position: [5, 2], rotation: 0 });
phys.place(sim.make(bimux), { position: [6, 2], rotation: 2 });
phys.place(sim.make(lamp), { position: [7, 2], rotation: 0 });
phys.place(sim.make(lamp), { position: [6, 1], rotation: 0 });
phys.place(sim.make(lamp), { position: [6, 3], rotation: 0 });
phys.place(sim.make(belt), { position: [1, 1], rotation: 0 });
phys.place(sim.make(belt), { position: [2, 1], rotation: 0 });