import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _spinnerService : NgxSpinnerService) { }
  intercept(request: HttpRequest<any>,next : HttpHandler)  {

    this._spinnerService.show();


    return next.handle(request).pipe(
      map((event : HttpEvent<any>) => {
        if(event instanceof HttpResponse){
          setTimeout(()=>{
            this._spinnerService.hide()
          },2000)
          
        }
        return event;
      })
    )
  }
}
