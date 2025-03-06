import * as THREE from "three";

/**
 * Computes an approximate collision normal based on the closest face of the box.
 * Compares the intersection point with the box's min and max on the X and Z axes.
 * @param box - The bounding box of the collidable.
 * @param point - The intersection point.
 * @returns A normalized vector representing the collision normal.
 */
export function computeBoxFaceNormal(
  box: THREE.Box3,
  point: THREE.Vector3
): THREE.Vector3 {
  let bestNormal = new THREE.Vector3();
  let minDistance = Infinity;

  const faces = [
    {
      normal: new THREE.Vector3(-1, 0, 0),
      distance: Math.abs(point.x - box.min.x),
    },
    {
      normal: new THREE.Vector3(1, 0, 0),
      distance: Math.abs(box.max.x - point.x),
    },
    {
      normal: new THREE.Vector3(0, 0, -1),
      distance: Math.abs(point.z - box.min.z),
    },
    {
      normal: new THREE.Vector3(0, 0, 1),
      distance: Math.abs(box.max.z - point.z),
    },
  ];

  for (const face of faces) {
    if (face.distance < minDistance) {
      minDistance = face.distance;
      bestNormal.copy(face.normal);
    }
  }
  return bestNormal;
}
