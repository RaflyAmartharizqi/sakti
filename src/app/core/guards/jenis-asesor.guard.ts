import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JenisAsesorGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {

        const userRole = this.authService.getRole();
        const jenisAsesor = this.authService.getJenisAsesor();
        const allowedJenis = route.data['allowedJenis'];

        // Jika bukan Asesor → tidak perlu cek jenis
        if (userRole !== 'Asesor') {
            return true;
        }

        // Jika route tidak punya allowedJenis
        if (!allowedJenis) {
            return true;
        }

        const isAllowed = jenisAsesor.some(j =>
            allowedJenis.includes(j)
        );

        if (!isAllowed) {
            return false;
        }

        return true;
        }


}
