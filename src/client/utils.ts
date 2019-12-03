import { NexusGenRootTypes } from '../generated'

type ClientTask = NexusGenRootTypes['Task']

export interface IClientTask extends ClientTask {
  categoryName: string
}
