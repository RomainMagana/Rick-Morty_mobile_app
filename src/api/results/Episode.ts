import {Info} from '../responses/Info';
import {EpisodeDetails} from '../responses/EpisodeDetails';

export interface Episode {
    info?: Info;
    results: EpisodeDetails[];
}