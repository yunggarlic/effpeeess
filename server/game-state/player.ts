import * as THREE from "three";

export interface PlayerState {
    id: string;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    materialId: number;
    geometryId: number;
    // You could also include inputs or timestamps to help with lag compensation.
    lastUpdateTime: number;
}

export class Player {
    id: string;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    materialId: number;
    geometryId: number;
    lastUpdateTime: number;
    constructor(
        { id,
            position,
            velocity,
            materialId,
            geometryId,
            lastUpdateTime
        }: PlayerState
    ) {
        this.id = id;
        this.position = position;
        this.velocity = velocity;
        this.materialId = materialId;
        this.geometryId = geometryId;
        this.lastUpdateTime = lastUpdateTime;
    }
}