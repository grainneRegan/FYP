import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from './user';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private dbPath = '/users';
  auth = getAuth();

  usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
  }


  getAll(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  create(user: User): any {
    return this.usersRef.add({ ...user });
  }

  update(id: string, data: any): Promise<void> {
    console.log("in update, id: ", id, "email: ", "data")
    return this.usersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete();
  }
}
