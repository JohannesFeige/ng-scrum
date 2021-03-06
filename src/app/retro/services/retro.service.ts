import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Retro } from '../models/retro.model';
import 'firebase/database';
import { AngularFireDatabase, SnapshotAction, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Keep } from '../models/keep.model';
import { CipherService } from './cipher.service';
import { Topic, Vote } from '../models/topic.model';

const retrosPath = 'retros';
const getRetroPath = (retroKey: string) => `${retrosPath}/${retroKey}`;
const getKeepPath = (retroKey: string) => `${getRetroPath(retroKey)}/keep`;
const getStartPath = (retroKey: string) => `${getRetroPath(retroKey)}/start`;
const getStopPath = (retroKey: string) => `${getRetroPath(retroKey)}/stop`;
const getTopicsPath = (type: 'start' | 'keep' | 'stop') => {
  switch (type) {
    case 'start':
      return getStartPath;
    case 'keep':
      return getKeepPath;
    case 'stop':
      return getStopPath;
  }
};

@Injectable({
  providedIn: 'root',
})
export class RetroService {
  retrosRef: AngularFireList<Retro>;
  currentRetroKey$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private repo: AngularFireDatabase, private cipher: CipherService) {
    this.retrosRef = repo.list<Retro>(retrosPath);
  }

  getRetros(): BehaviorSubject<Retro[]> {
    const retros: BehaviorSubject<Retro[]> = new BehaviorSubject([]);

    this.retrosRef
      .snapshotChanges()
      .pipe(map((items) => items.map(this.mapSnapshotToRetro)))
      .subscribe({
        complete: () => retros.complete(),
        error: (x) => retros.error(x),
        next: (x) => retros.next(x),
      });

    return retros;
  }

  pushRetro(retro: Retro): string {
    const retroKey = this.retrosRef.push(retro).key;

    this.setRetroSecret(retroKey, this.cipher.generateSecret());

    return retroKey;
  }

  getRetro(retroKey: string): BehaviorSubject<Retro> {
    return this.getAsBehaviouSubjectObject(
      this.repo.object<Retro>(getRetroPath(retroKey)).snapshotChanges().pipe(map(this.mapSnapshotToRetro))
    );
  }

  updateRetroCurrentSteop(retroKey: string, currentStep: number): void {
    this.repo.object<Retro>(getRetroPath(retroKey)).update({ currentStep });
  }

  retroExists(retroKey: string): Observable<boolean> {
    return this.repo
      .object<Retro>(getRetroPath(retroKey))
      .snapshotChanges()
      .pipe(
        map((value) => {
          return !!value.key;
        })
      );
  }

  deleteRetro(retroKey: string): void {
    this.repo.object(getRetroPath(retroKey)).remove();
  }

  getTopics(retroKey: string, topicType: 'start' | 'keep' | 'stop'): BehaviorSubject<Topic[]> {
    return this.getAsBehaviouSubjectArray(this.getUnfilteredTopics(retroKey, topicType));
  }

  getActiveTopics(retroKey: string, topicType: 'start' | 'keep' | 'stop'): BehaviorSubject<Topic[]> {
    return this.getAsBehaviouSubjectArray(
      this.getUnfilteredTopics(retroKey, topicType).pipe(map((x) => x.filter((topic) => !topic.disabled)))
    );
  }

  private getUnfilteredTopics(retroKey: string, topicType: 'start' | 'keep' | 'stop'): Observable<Topic[]> {
    const secret = this.getRetroSecret(retroKey);
    return this.repo
      .list<Topic>(getTopicsPath(topicType)(retroKey))
      .snapshotChanges()
      .pipe(
        map((items) => items.map(this.mapSnapshotToTopic)),
        map((topics) =>
          topics.map((topic) => {
            topic.topic = this.cipher.decrypt(secret, topic.topic);
            return topic;
          })
        )
      );
  }

  pushTopic(retroKey: string, topic: Topic): void {
    const secret = this.getRetroSecret(retroKey);
    topic.topic = this.cipher.encrypt(secret, topic.topic);
    this.repo.list(getTopicsPath(topic.type)(retroKey)).push(topic);
  }

  updateTopicDisabled(retroKey: string, topic: Topic): void {
    this.repo.object<Topic>(`${getTopicsPath(topic.type)(retroKey)}/${topic.key}`).update({ disabled: topic.disabled });
  }

  updateTopicResponsible(retroKey: string, topic: Topic, responsible: string): void {
    this.repo.object<Topic>(`${getTopicsPath(topic.type)(retroKey)}/${topic.key}`).update({ responsible });
  }

  pushTopicVote(retroKey: string, topic: Topic, vote: Vote): void {
    this.repo.list(`${getTopicsPath(topic.type)(retroKey)}/${topic.key}/votes`).push(vote);
  }

  pullTopicVote(retroKey: string, topic: Topic, vote: Vote): void {
    this.repo.object(`${getTopicsPath(topic.type)(retroKey)}/${topic.key}/votes/${vote.key}`).remove();
  }

  setRetroSecret(retroKey: string, retroSecret: string): void {
    window.localStorage.setItem(retroKey, retroSecret);
  }

  getRetroSecret(retroKey: string): string {
    return window.localStorage.getItem(retroKey);
  }

  private getAsBehaviouSubjectObject<T>(observable: Observable<T>) {
    const behaviourSubject: BehaviorSubject<T> = new BehaviorSubject({}) as BehaviorSubject<T>;
    observable.subscribe({
      complete: () => behaviourSubject.complete(),
      error: (x) => behaviourSubject.error(x),
      next: (x) => behaviourSubject.next(x),
    });

    return behaviourSubject;
  }

  private getAsBehaviouSubjectArray<T>(observable: Observable<T[]>) {
    const behaviourSubject: BehaviorSubject<T[]> = new BehaviorSubject([]) as BehaviorSubject<T[]>;
    observable.subscribe({
      complete: () => behaviourSubject.complete(),
      error: (x) => behaviourSubject.error(x),
      next: (x) => behaviourSubject.next(x),
    });

    return behaviourSubject;
  }

  private mapSnapshotToObject<T>(snapshotAction: SnapshotAction<T>): T {
    const key = snapshotAction.payload.key;
    const data = snapshotAction.payload.val();
    return { key, ...data };
  }

  private mapSnapshotToRetro = (snapshotAction: SnapshotAction<Retro>): Retro => {
    const retro = this.mapSnapshotToObject(snapshotAction);
    return this.mapToRetro(retro);
  };

  private mapSnapshotToTopic = (snapshotAction: SnapshotAction<Topic>): Topic => {
    const topic = this.mapSnapshotToObject(snapshotAction);
    return this.mapToTopic(topic);
  };

  private mapToRetro(retro: Retro): Retro {
    const keep: Keep[] = [];
    for (const key in retro.keep) {
      if (retro.keep.hasOwnProperty(key)) {
        const keepData = (retro.keep[key] as unknown) as Keep;
        keep.push({ key, ...keepData });
      }
    }
    return { ...retro, keep };
  }

  private mapToTopic(topic: Topic): Topic {
    const votes: Vote[] = [];
    for (const key in topic.votes) {
      if (topic.votes.hasOwnProperty(key)) {
        const voteData = (topic.votes[key] as unknown) as Vote;
        votes.push({ key, ...voteData });
      }
    }
    return { ...topic, votes };
  }
}
