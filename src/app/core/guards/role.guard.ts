import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleGuard  {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

      canActivate(route: ActivatedRouteSnapshot): boolean {
        const allowedRoles = route.data['role'] as string[];
        const userRole = this.authenticationService.getRole();

        if (!userRole || !allowedRoles.includes(userRole)) {
        this.router.navigate(['/unauthorized']); // atau halaman lain
        return false;
        }

        return true;
    }
    
}
