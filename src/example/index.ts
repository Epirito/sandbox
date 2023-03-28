import CharacterMovement from "../logic/character-movement";
import { ContainerComponent, HandComponent } from "../logic/container";
import Entity from "../logic/entity";
import { PhysicsSystem } from "../logic/physics";
import { ProngSystem } from "../logic/prong";
import { makeBelt, makeBimux, makeDemux, makeLamp, makeMux, makePressurePlate, makeWire } from "../stuff/entities";
import { examinables } from "../stuff/examinables";
export const physics = new PhysicsSystem();
export const electricity = new ProngSystem(physics);
export const charMov = new CharacterMovement(physics);

export const player = new Entity(10);
player.examinableComp = examinables.man
player.handComp = new HandComponent(5);
player.blocksMovement = true;

const chest = new Entity(6);
chest.containerComp = new ContainerComponent(5);
chest.examinableComp = examinables.chest
chest.blocksMovement = true;


physics.place(player, { position: [5, 5], rotation: 0 });
physics.place(chest, { position: [1, 0], rotation: 0 });
physics.place(makePressurePlate(physics, electricity, 3), { position: [1, 3], rotation: 0 });
physics.place(makeWire(electricity), { position: [3, 3], rotation: 0 });
physics.place(makeWire(electricity), { position: [2, 3], rotation: 0 });
physics.place(makeWire(electricity), { position: [2, 2], rotation: 0 });
physics.place(makeMux(electricity), { position: [3, 2], rotation: 0 });
physics.place(makeWire(electricity), { position: [4, 2], rotation: 0 });
physics.place(makeWire(electricity), { position: [5, 2], rotation: 0 });
physics.place(makeBimux(electricity), { position: [6, 2], rotation: 2 });
physics.place(makeLamp(electricity), { position: [7, 2], rotation: 0 });
physics.place(makeLamp(electricity), { position: [6, 1], rotation: 0 });
physics.place(makeLamp(electricity), { position: [6, 3], rotation: 0 });
physics.place(makeBelt(physics), { position: [1, 1], rotation: 0 });
physics.place(makeBelt(physics), { position: [2, 1], rotation: 0 });