import {
    IonContent,
    IonHeader,
    IonItem, IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons, useIonViewWillEnter, IonGrid, IonRow, IonImg, IonCol, IonText
} from '@ionic/react';
import './Home.css';
import React, {useState} from "react";
import {RouteComponentProps} from "react-router";
import {EpisodeDetails} from "../api/responses/EpisodeDetails";
import {Characters} from "../api/results/Characters";
import "./Details.css";
import {Episode} from "../api/results/Episode";
interface DetailPageProps extends RouteComponentProps<{ id: string; }> {
}

const Details: React.FC<DetailPageProps> = ({match}) => {
    const [episode, setEpisode] = useState<EpisodeDetails>();
    const [characters, setCharacters] = useState<Characters[]>([]);
    let char : string[] = [];

    async function getEpisodeDetails(id: string) {
        let i = 0;
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
            const data = await response.json() as EpisodeDetails;
            setEpisode(data);

            if(data.characters != undefined) {
                data.characters.map((charUrl) => {
                    let test = charUrl.split('/');
                    char[i] = test[test.length - 1];
                    i++;
                })
                return `https://rickandmortyapi.com/api/character/${char}`
            }

        } catch (e) {
            console.log(e);
        }
    }

    async function getCharacters(url: string) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setCharacters(data);
        } catch (e) {
            console.log(e);
        }
    }

    useIonViewWillEnter(async () => {
        let hihi = await getEpisodeDetails(match.params.id);
        console.log(hihi);
        await getCharacters(hihi as string);
    });


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot={"start"}>
                        <IonBackButton defaultHref={"/home"}/>
                    </IonButtons>
                    <IonTitle>{episode?.episode} - {episode?.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className={"ion-margin-start"}>
                    <IonRow>
                        <IonLabel className={"ion-margin-top details__character"}><strong>Date de sortie :</strong> {episode?.air_date}</IonLabel>
                    </IonRow>
                    <IonRow>
                        {characters.map((character: Characters) => {
                            return (
                                <>
                                <IonRow className={"ion-margin-top"}>
                                    <IonCol size={"5"}>
                                        <IonImg src={character.image} className={"image__character"}/>
                                    </IonCol>
                                    <IonCol size={"7"} className={"ion-padding-start"}>
                                        <IonLabel className={'details__character'}>
                                            <h1 className={'ion-padding-bottom'}><strong>{character.name}</strong></h1>
                                            <h2 className={'details__character'}><strong>Status : </strong>{character.status}</h2>
                                            <h2 className={'details__character'}><strong>Species : </strong>{character.species}</h2>
                                            <h2 className={'details__character'}><strong>Gender : </strong> {character.gender}</h2>
                                        </IonLabel>
                                    </IonCol>
                                </IonRow>
                                </>
                            )
                        })}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Details;
