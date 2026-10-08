import {Box3,Plane,Vector3} from 'three';

/** Keep the far side of a camera-facing plane; depth measures distance, not tissue volume. */
export function cutawayPlane(box:Box3,direction:Vector3,depth:number):Plane|null {
 if(!Number.isFinite(depth)||depth<=0||box.isEmpty()||direction.lengthSq()===0)return null;
 const normal=direction.clone().normalize();let min=Infinity,max=-Infinity;
 for(let corner=0;corner<8;corner++){
  const point=new Vector3((corner&1)?box.max.x:box.min.x,(corner&2)?box.max.y:box.min.y,(corner&4)?box.max.z:box.min.z);
  const distance=normal.dot(point);min=Math.min(min,distance);max=Math.max(max,distance);
 }
 const fraction=Math.min(1,depth),epsilon=1e-5;
 return new Plane(normal,-(min+(max-min)*fraction+(fraction===1?epsilon:0)));
}

export function firstUnclippedHit<T extends {point:Vector3}>(hits:T[],plane:Plane|null):T|undefined {
 return hits.find(hit=>!plane||plane.distanceToPoint(hit.point)>=0);
}
