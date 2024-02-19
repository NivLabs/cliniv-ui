import {
    HttpEvent,
    HttpEventType,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private AUTH_HEADER = 'Authorization';
    private CUSTOMER_ID_HEADER = "X-Customer-Id";
    private OPERATION_ID_HEADER = "X-Operation-Id";

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

        headers = headers.append(this.CUSTOMER_ID_HEADER, this.auth.getUnitName() || 'cliniv');
        headers = headers.append(this.OPERATION_ID_HEADER, uuidv4());

        const token = this.auth.getToken();

        if (!this.auth.isInvalidAccessToken()) {
            headers = req.headers.append(this.AUTH_HEADER, "Bearer ".concat(token))
                .append(this.CUSTOMER_ID_HEADER, this.auth.getUnitName())
                .append(this.OPERATION_ID_HEADER, uuidv4());
        }

        return headers;
    }
}
