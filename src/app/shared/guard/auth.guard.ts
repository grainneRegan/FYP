import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
      public authService: AuthService,
      public router: Router
  ){ }

   canActivate(
      // route that is wanted to access
      next: ActivatedRouteSnapshot,
      // the current route
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // condition to allow access or not & if access is not allowed route to sign in
      if(this.authService.isLoggedIn !== true) {
        this.router.navigate(['sign-in'])
      }
      // if true is returned access is granted
      return true;
  }
}
