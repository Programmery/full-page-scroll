import axios from 'axios';
import {ServerStock} from '../../types/common';

type Entity = 'stocks' | 'random-stock';
type SingleOnlyEntity = 'random-stock';
type EntityId = string | number | undefined;

type ReturnData<Ent extends Entity> = Ent extends 'stocks' | 'random-stock'
  ? ServerStock
  : never;

type RequestReturnType<
  Ent extends Entity,
  Id extends string | number | undefined = undefined
> = Ent extends SingleOnlyEntity
  ? ReturnData<Ent>
  : Id extends undefined
  ? ReturnData<Ent>[]
  : ReturnData<Ent>;

export class BaseStore {
  protected baseUrl = `${process.env.API_BASE_URL}/api`;

  protected async getRequest<Ent extends Entity, Id extends EntityId>({
    entity,
    id,
    config = {},
  }: {
    entity: Ent;
    id?: Id;
    config?: {params?: Record<string, string>};
  }) {
    const entityIdUrl = id ? `/${id}` : '';
    const {data} = await axios.get<RequestReturnType<Ent, Id>>(
      `${this.baseUrl}/${entity}${entityIdUrl}`,
      config,
    );
    return data;
  }
}
