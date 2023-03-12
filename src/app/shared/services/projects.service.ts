import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from './user';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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
    console.log("in update, id: ", id, "email: ", data)
    return this.usersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete();
  }

  async getUser(id: any): Promise<any> {
    console.log(id)
    console.log('here');
    const userRef = doc(this.usersRef.ref, "users", id);
    const docSnap = await getDoc(userRef);
    console.log(docSnap)
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
  }

  getProjects(id: string): Observable<any> {
    return this.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, projects: c.payload.doc.data()?.projects })
        )
      ),
      map(users => {
        return users.filter(user => user.id === id);
      })
    );
  }
}
