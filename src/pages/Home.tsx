import {
    IonContent,
    IonHeader,
    IonItem, IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter, withIonLifeCycle,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar
} from '@ionic/react';
import './Home.css';
import React, {useState} from "react";
import {Episode} from "../api/results/Episode";


const Home: React.FC = () => {
    const [episode, setEpisode] = useState<Episode>({results: []});
    const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
    const [searchText, setSearchText] = useState('');

    async function getEpisode (url: string) {
        try {
            setIsInfiniteDisabled(true);
            const response = await fetch(url);
            const data = await response.json();

            let RickApi : Episode = {
                info: data.info,
                results: [...episode.results, ...data.results]
            };
            setEpisode(RickApi);
            setIsInfiniteDisabled(false)
        } catch (e) {
            console.log(e);
        }
    }

    async function searchEpisode (search: string) {
        setSearchText(search);
        try {
            setIsInfiniteDisabled(true);
            const response = await fetch(`https://rickandmortyapi.com/api/episode/?name=${search}`);
            const data = await response.json();
            if(data.results != null) {
                setEpisode(data);
            }
            else {
                setEpisode({results: [
                    {
                        error: 'No results found'
                    }
                    ]});
            }
            setIsInfiniteDisabled(false)
        } catch (e) {
            console.log(e);
        }
    }

    useIonViewWillEnter(async () => {await getEpisode('https://rickandmortyapi.com/api/episode')});

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) =>
                            searchEpisode(e.detail.value!)
                        }
                        placeholder="Search episode"
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    {episode.results.map(value =>
                        <IonItem routerLink={'details/'+value.id} key={value.id}>
                            <IonLabel>
                                <h2>{value.name}</h2>
                                <p>{value.episode} - {value.air_date}</p>
                            </IonLabel>
                            <IonTitle>{value.error}</IonTitle>
                        </IonItem>
                    )}
                </IonList>
                <IonInfiniteScroll
                    onIonInfinite={async () => await getEpisode(episode.info?.next as string)}
                    threshold="100px"
                    disabled={isInfiniteDisabled}>
                    <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more data..."/>
                </IonInfiniteScroll>

            </IonContent>
        </IonPage>
    );
};

export default withIonLifeCycle(Home);
