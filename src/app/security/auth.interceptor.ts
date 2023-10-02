import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHeaders, HttpEventType
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private AUTH_HEADER = 'Authorization';
    private CUSTOMER_ID_HEADER = "x-cutomer-id";

    constructor(private auth: AuthService) { }

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (req.url.includes(environment.apiUrl)) {
            return next.handle(req.clone({
                headers: this.authheaders(req)
            }))
                .pipe(
                    tap(
                        res => {
                            if (res.type === HttpEventType.ResponseHeader
                                || res.type === HttpEventType.Response) {
                                if (res.headers.has(this.AUTH_HEADER)) {
                                    this.auth.saveToken(res.headers.get(this.AUTH_HEADER));
                                }
                            }
                        }
                    )
                );
        }
        return next.handle(req);
    }

    authheaders(req: HttpRequest<unknown>): HttpHeaders {
        let headers: HttpHeaders = req.headers;
        headers = headers.append(this.CUSTOMER_ID_HEADER, this.auth.getUnitName());

        const token = this.auth.getToken();

        if (!this.auth.isInvalidAccessToken()) {
            headers = req.headers.append(this.AUTH_HEADER, "Bearer ".concat(token))
                .append(this.CUSTOMER_ID_HEADER, this.auth.getUnitName());
        }

        return headers;
    }
}
