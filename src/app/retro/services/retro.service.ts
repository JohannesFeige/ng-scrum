import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Retro } from '../models/retro.model';
import 'firebase/database';
import { AngularFireDatabase, SnapshotAction, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Keep } from '../models/keep.model';
import { CipherService } from './cipher.service';
import { Topic } from '../models/topic.model';

const retrosPath = 'retros';
const getRetroPath = (retroKey: string) => `${retrosPath}/${retroKey}`;
const getKeepPath = (retroKey: string) => `${getRetroPath(retroKey)}/keep`;
const getStartPath = (retroKey: string) => `${getRetroPath(retroKey)}/start`;
const getStopPath = (retroKey: string) => `${getRetroPath(retroKey)}/stop`;
const getTopicPath = (type: 'start' | 'keep' | 'stop') => {
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
    return this.getAsBehaviouSubject(
      this.repo.object<Retro>(getRetroPath(retroKey)).snapshotChanges().pipe(map(this.mapSnapshotToRetro))
    );
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

  pushKeep(retroKey: string, keep: Keep): void {
    this.repo.list(getKeepPath(retroKey)).push(keep);
  }

  getTopics(retroKey: string, topicType: 'start' | 'keep' | 'stop'): BehaviorSubject<Topic[]> {
    return this.getAsBehaviouSubject(
      this.repo
        .list<Topic>(getTopicPath(topicType)(retroKey))
        .snapshotChanges()
        .pipe(map((items) => items.map(this.mapSnapshotToObject))),
      []
    );
  }

  pushTopic(retroKey: string, topic: Topic): void {
    this.repo.list(getTopicPath(topic.type)(retroKey)).push(topic);
  }

  setRetroSecret(retroKey: string, retroSecret: string): void {
    window.localStorage.setItem(retroKey, retroSecret);
  }

  getRetroSecret(retroKey: string): string {
    return window.localStorage.getItem(retroKey);
  }

  private getAsBehaviouSubject<T>(observable: Observable<T>, initObject: T = {} as T) {
    const behaviourSubject: BehaviorSubject<T> = new BehaviorSubject(initObject);
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
}
